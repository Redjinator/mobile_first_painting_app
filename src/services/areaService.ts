import { prisma } from '@/lib/prisma';
import { UserRole, AreaType } from '@prisma/client';
import { NotFoundError, UnauthorizedError, BadRequestError } from '@/lib/api/errors';
import { CreateAreaDto, UpdateAreaDto, AreaWithTasks, AreaHierarchy } from '@/types/area';

// Default painting tasks to create for each area
const DEFAULT_TASKS = [
  { name: 'Cut', taskOrder: 1 },
  { name: 'Roll', taskOrder: 2 },
  { name: 'Trim', taskOrder: 3 },
  { name: 'Touch-up', taskOrder: 4 },
];

export class AreaService {
  /**
   * Get all areas for a floor
   */
  static async getAllAreas(
    floorId: string,
    userId?: string,
    userRole?: UserRole
  ): Promise<AreaHierarchy[]> {
    // Check if floor exists
    const floor = await prisma.floor.findUnique({
      where: { id: floorId },
      include: {
        jobSite: {
          include: { supervisor: true },
        },
      },
    });

    if (!floor) {
      throw new NotFoundError('Floor not found');
    }

    // Check permissions
    if (userRole === 'EMPLOYEE') {
      throw new UnauthorizedError('Employees cannot view area lists');
    }

    if (userRole === 'SUPERVISOR' && floor.jobSite.supervisorId !== userId) {
      throw new UnauthorizedError('You can only view areas for sites you supervise');
    }

    // Get all areas (only parent areas, sub-areas will be nested)
    const areas = await prisma.area.findMany({
      where: {
        floorId,
        parentAreaId: null, // Only get parent areas
      },
      include: {
        tasks: {
          orderBy: { taskOrder: 'asc' },
        },
        subAreas: {
          include: {
            tasks: {
              orderBy: { taskOrder: 'asc' },
            },
            assignments: {
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
            },
          },
        },
        assignments: {
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
        },
      },
      orderBy: { name: 'asc' },
    });

    return areas as AreaHierarchy[];
  }

  /**
   * Get a single area by ID
   */
  static async getAreaById(
    id: string,
    userId?: string,
    userRole?: UserRole
  ): Promise<AreaWithTasks> {
    const area = await prisma.area.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { taskOrder: 'asc' },
        },
        subAreas: {
          include: {
            tasks: {
              orderBy: { taskOrder: 'asc' },
            },
          },
        },
        assignments: {
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
        },
        floor: {
          include: {
            jobSite: {
              include: { supervisor: true },
            },
          },
        },
      },
    });

    if (!area) {
      throw new NotFoundError('Area not found');
    }

    // Check permissions
    if (userRole === 'EMPLOYEE') {
      // Employees can see areas if they have ANY assignment to the job site
      // This includes site-level, floor-level (any floor), or area-level assignments
      const hasAssignmentToSite = await prisma.assignment.findFirst({
        where: {
          userId,
          jobSiteId: area.floor.jobSite.id,
        },
      });

      if (!hasAssignmentToSite) {
        throw new UnauthorizedError('You can only view areas for job sites you are assigned to');
      }
    }

    if (userRole === 'SUPERVISOR' && area.floor.jobSite.supervisorId !== userId) {
      throw new UnauthorizedError('You can only view areas for sites you supervise');
    }

    return area;
  }

  /**
   * Create an area with auto-generated tasks
   */
  static async createArea(
    floorId: string,
    data: CreateAreaDto,
    createdBy: string
  ) {
    // Check if floor exists
    const floor = await prisma.floor.findUnique({
      where: { id: floorId },
    });

    if (!floor) {
      throw new NotFoundError('Floor not found');
    }

    // Create area with auto-generated tasks
    const area = await prisma.area.create({
      data: {
        ...data,
        floorId,
        completionPercentage: 0,
        tasks: {
          create: DEFAULT_TASKS.map((task) => ({
            ...task,
            completionPercentage: 0,
          })),
        },
      },
      include: {
        tasks: {
          orderBy: { taskOrder: 'asc' },
        },
      },
    });

    return area;
  }

  /**
   * Create a sub-area (closet) under a parent area
   */
  static async createSubArea(
    parentAreaId: string,
    data: Omit<CreateAreaDto, 'areaType'>,
    createdBy: string
  ) {
    // Check if parent area exists
    const parentArea = await prisma.area.findUnique({
      where: { id: parentAreaId },
    });

    if (!parentArea) {
      throw new NotFoundError('Parent area not found');
    }

    // Validate parent is not a closet
    if (parentArea.areaType === 'CLOSET') {
      throw new BadRequestError('Cannot create a sub-area under a closet');
    }

    // Create closet with auto-generated tasks
    const subArea = await prisma.area.create({
      data: {
        ...data,
        areaType: 'CLOSET',
        floorId: parentArea.floorId,
        parentAreaId,
        completionPercentage: 0,
        tasks: {
          create: DEFAULT_TASKS.map((task) => ({
            ...task,
            completionPercentage: 0,
          })),
        },
      },
      include: {
        tasks: {
          orderBy: { taskOrder: 'asc' },
        },
      },
    });

    return subArea;
  }

  /**
   * Create multiple areas at once
   */
  static async createAreasBulk(
    floorId: string,
    areaConfigs: (CreateAreaDto & { tasks?: Array<{ name: string; taskOrder: number }> })[],
    createdBy: string
  ) {
    // Check if floor exists
    const floor = await prisma.floor.findUnique({
      where: { id: floorId },
    });

    if (!floor) {
      throw new NotFoundError('Floor not found');
    }

    // Create areas with tasks in a transaction
    const areas = await prisma.$transaction(
      areaConfigs.map((config) => {
        // Use provided tasks or fall back to defaults
        const tasksToCreate = config.tasks && config.tasks.length > 0
          ? config.tasks
          : DEFAULT_TASKS;

        const { tasks, ...areaData } = config;

        return prisma.area.create({
          data: {
            ...areaData,
            floorId,
            completionPercentage: 0,
            tasks: {
              create: tasksToCreate.map((task) => ({
                ...task,
                completionPercentage: 0,
              })),
            },
          },
          include: {
            tasks: {
              orderBy: { taskOrder: 'asc' },
            },
          },
        });
      })
    );

    return areas;
  }

  /**
   * Update an area
   */
  static async updateArea(
    id: string,
    data: UpdateAreaDto,
    userId: string,
    userRole: UserRole
  ) {
    const area = await prisma.area.findUnique({
      where: { id },
      include: {
        floor: {
          include: {
            jobSite: true,
          },
        },
      },
    });

    if (!area) {
      throw new NotFoundError('Area not found');
    }

    // Check permissions
    if (userRole === 'EMPLOYEE') {
      throw new UnauthorizedError('Employees cannot update areas');
    }

    if (userRole === 'SUPERVISOR' && area.floor.jobSite.supervisorId !== userId) {
      throw new UnauthorizedError('You can only update areas for sites you supervise');
    }

    return prisma.area.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete an area
   */
  static async deleteArea(id: string, userId: string, userRole: UserRole) {
    const area = await prisma.area.findUnique({
      where: { id },
      include: {
        floor: {
          include: {
            jobSite: true,
          },
        },
      },
    });

    if (!area) {
      throw new NotFoundError('Area not found');
    }

    // Check permissions
    if (userRole !== 'ADMIN') {
      throw new UnauthorizedError('Only administrators can delete areas');
    }

    // Check for active time entries at this area
    const activeTimeEntries = await prisma.timeEntry.findMany({
      where: {
        areaId: id,
        clockOut: null, // Active time entries
      },
    });

    if (activeTimeEntries.length > 0) {
      throw new BadRequestError(
        'Cannot delete area with active painters. Please clock them out first.'
      );
    }

    // Delete area (cascade will handle tasks and sub-areas)
    await prisma.area.delete({
      where: { id },
    });

    return { success: true, message: 'Area deleted successfully' };
  }

  /**
   * Calculate and update area progress
   */
  static async calculateAreaProgress(id: string): Promise<number> {
    const area = await prisma.area.findUnique({
      where: { id },
      include: {
        tasks: true,
        subAreas: {
          include: {
            tasks: true,
          },
        },
      },
    });

    if (!area) {
      throw new NotFoundError('Area not found');
    }

    // Calculate progress from direct tasks
    let totalProgress = 0;
    let taskCount = area.tasks.length;

    if (taskCount === 0) {
      // No tasks, progress is 0
      await prisma.area.update({
        where: { id },
        data: { completionPercentage: 0 },
      });
      return 0;
    }

    // Sum up task progress
    totalProgress = area.tasks.reduce(
      (sum, task) => sum + task.completionPercentage,
      0
    );

    // Include sub-area progress (weighted equally with direct tasks)
    for (const subArea of area.subAreas) {
      const subTaskProgress = subArea.tasks.reduce(
        (sum, task) => sum + task.completionPercentage,
        0
      );
      const subTaskCount = subArea.tasks.length;
      if (subTaskCount > 0) {
        totalProgress += subTaskProgress / subTaskCount;
        taskCount += 1; // Count sub-area as one unit
      }
    }

    const averageProgress = Math.round(totalProgress / taskCount);

    // Update area progress
    await prisma.area.update({
      where: { id },
      data: { completionPercentage: averageProgress },
    });

    return averageProgress;
  }
}
