import { prisma } from '@/lib/prisma';
import { UserRole, EntityType, Action } from '@prisma/client';
import {
  TaskWithArea,
  TaskWithHistory,
  UpdateTaskProgressDto,
  UpdateTaskDto,
  CreateCustomTaskDto,
  TaskProgressUpdateResult,
} from '@/types/task';
import { NotFoundError, UnauthorizedError, BadRequestError } from '@/lib/api/errors';
import { ActivityLogService } from './activityLogService';
import { AreaService } from './areaService';
import { FloorService } from './floorService';
import { jobSiteService } from './jobSiteService';

export class TaskService {
  /**
   * Get all tasks for an area
   */
  static async getAllTasks(
    areaId: string,
    userId?: string,
    userRole?: UserRole
  ): Promise<TaskWithArea[]> {
    // Verify area exists
    const area = await prisma.area.findUnique({
      where: { id: areaId },
    });

    if (!area) {
      throw new NotFoundError('Area not found');
    }

    // Get all tasks ordered by taskOrder
    const tasks = await prisma.task.findMany({
      where: { areaId },
      include: {
        area: true,
      },
      orderBy: { taskOrder: 'asc' },
    });

    return tasks;
  }

  /**
   * Get single task details
   */
  static async getTaskById(
    id: string,
    userId?: string,
    userRole?: UserRole
  ): Promise<TaskWithHistory> {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        area: {
          include: {
            floor: {
              include: {
                jobSite: true,
              },
            },
          },
        },
        activityLogs: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return task;
  }

  /**
   * Update task progress and recalculate parent progress
   */
  static async updateTaskProgress(
    id: string,
    data: UpdateTaskProgressDto,
    userId: string,
    userRole: UserRole
  ): Promise<TaskProgressUpdateResult> {
    // Get task with area and site info
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        area: {
          include: {
            floor: {
              include: {
                jobSite: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Permission check: Only assigned painters, supervisors, or admins can update
    if (userRole === UserRole.EMPLOYEE) {
      // Check if painter is assigned to this site/floor/area
      const isAssigned = await this.isPainterAssigned(
        userId,
        task.area.floor.jobSiteId,
        task.area.floorId,
        task.areaId
      );

      if (!isAssigned) {
        throw new UnauthorizedError(
          'You are not assigned to this area and cannot update task progress'
        );
      }
    }

    const oldPercentage = task.completionPercentage;

    // Update task progress
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        completionPercentage: data.percentage,
        notes: data.notes || task.notes,
      },
    });

    // Create activity log
    await ActivityLogService.createLog(userId, {
      entityType: EntityType.TASK,
      entityId: id,
      action: Action.UPDATE,
      changes: {
        field: 'completionPercentage',
        oldValue: oldPercentage,
        newValue: data.percentage,
        notes: data.notes,
      },
    });

    // Recalculate progress up the hierarchy
    const areaProgress = await AreaService.calculateAreaProgress(task.areaId);
    const floorProgress = await FloorService.calculateFloorProgress(task.area.floorId);
    const siteProgressResult = await jobSiteService.calculateSiteProgress(
      task.area.floor.jobSiteId
    );
    const siteProgress = siteProgressResult.completionPercentage;

    return {
      task: updatedTask,
      areaProgress,
      floorProgress,
      siteProgress,
    };
  }

  /**
   * Update task details (name, notes)
   */
  static async updateTask(
    id: string,
    data: UpdateTaskDto,
    userId: string,
    userRole: UserRole
  ) {
    // Get task
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        area: {
          include: {
            floor: {
              include: {
                jobSite: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Permission check for taskOrder changes
    if (data.taskOrder !== undefined) {
      if (userRole === UserRole.EMPLOYEE) {
        throw new UnauthorizedError(
          'Only supervisors and admins can change task order'
        );
      }
    }

    // Update task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        name: data.name,
        notes: data.notes,
        taskOrder: data.taskOrder,
      },
    });

    // Create activity log
    await ActivityLogService.createLog(userId, {
      entityType: EntityType.TASK,
      entityId: id,
      action: Action.UPDATE,
      changes: {
        updated: data,
      },
    });

    return updatedTask;
  }

  /**
   * Delete task (admin only)
   */
  static async deleteTask(id: string, userId: string, userRole: UserRole) {
    // Only admins can delete tasks
    if (userRole !== UserRole.ADMIN) {
      throw new UnauthorizedError('Only admins can delete tasks');
    }

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        area: true,
      },
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Delete task
    await prisma.task.delete({
      where: { id },
    });

    // Create activity log
    await ActivityLogService.createLog(userId, {
      entityType: EntityType.TASK,
      entityId: id,
      action: Action.DELETE,
      changes: {
        taskName: task.name,
        areaId: task.areaId,
      },
    });

    // Recalculate progress
    await AreaService.calculateAreaProgress(task.areaId);
    if (task.area.floorId) {
      await FloorService.calculateFloorProgress(task.area.floorId);
      const floor = await prisma.floor.findUnique({
        where: { id: task.area.floorId },
      });
      if (floor) {
        await jobSiteService.calculateSiteProgress(floor.jobSiteId);
      }
    }

    return { success: true };
  }

  /**
   * Create custom task (admin or supervisor only)
   */
  static async createCustomTask(
    areaId: string,
    data: CreateCustomTaskDto,
    createdBy: string,
    userRole: UserRole
  ) {
    // Only admins and supervisors can create custom tasks
    if (userRole === UserRole.EMPLOYEE) {
      throw new UnauthorizedError(
        'Only supervisors and admins can create custom tasks'
      );
    }

    // Verify area exists
    const area = await prisma.area.findUnique({
      where: { id: areaId },
    });

    if (!area) {
      throw new NotFoundError('Area not found');
    }

    // Check if taskOrder is already taken
    const existingTask = await prisma.task.findFirst({
      where: {
        areaId,
        taskOrder: data.taskOrder,
      },
    });

    if (existingTask) {
      throw new BadRequestError(
        `Task order ${data.taskOrder} is already taken in this area`
      );
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        areaId,
        name: data.name,
        taskOrder: data.taskOrder,
        notes: data.notes,
        completionPercentage: 0,
      },
    });

    // Create activity log
    await ActivityLogService.createLog(createdBy, {
      entityType: EntityType.TASK,
      entityId: task.id,
      action: Action.CREATE,
      changes: {
        taskName: data.name,
        taskOrder: data.taskOrder,
        areaId,
      },
    });

    return task;
  }

  /**
   * Check if painter is assigned to site/floor/area
   */
  private static async isPainterAssigned(
    userId: string,
    siteId: string,
    floorId: string,
    areaId: string
  ): Promise<boolean> {
    const assignment = await prisma.assignment.findFirst({
      where: {
        userId,
        OR: [
          // Assigned to entire site
          { assignableType: 'JOB_SITE', assignableId: siteId },
          // Assigned to this floor
          { assignableType: 'FLOOR', assignableId: floorId },
          // Assigned to this area
          { assignableType: 'AREA', assignableId: areaId },
        ],
      },
    });

    return !!assignment;
  }
}
