import { prisma } from '@/lib/prisma';
import { UserRole, FlagStatus } from '@prisma/client';
import {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from '@/lib/api/errors';
import {
  CreateJobSiteDto,
  UpdateJobSiteDto,
  JobSiteFilters,
  JobSiteWithProgress,
  JobSiteHierarchy,
  ActivePainter,
  SiteProgressResult,
  FloorHierarchy,
  AreaHierarchy,
  TaskHierarchy,
} from '@/types/jobSite';

export class JobSiteService {
  /**
   * Get all job sites with filtering and permissions
   */
  async getAllJobSites(
    filters?: JobSiteFilters,
    userId?: string,
    userRole?: UserRole
  ): Promise<JobSiteWithProgress[]> {
    // Build where clause based on filters and permissions
    const where: any = {};

    // If supervisor, only show their sites
    if (userRole === UserRole.SUPERVISOR && userId) {
      where.supervisorId = userId;
    }

    // Apply filters
    if (filters?.supervisorId) {
      where.supervisorId = filters.supervisorId;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { address: { contains: filters.search } },
      ];
    }

    if (filters?.startDateFrom || filters?.startDateTo) {
      where.startDate = {};
      if (filters.startDateFrom) {
        where.startDate.gte = filters.startDateFrom;
      }
      if (filters.startDateTo) {
        where.startDate.lte = filters.startDateTo;
      }
    }

    if (filters?.minCompletion !== undefined || filters?.maxCompletion !== undefined) {
      where.completionPercentage = {};
      if (filters?.minCompletion !== undefined) {
        where.completionPercentage.gte = filters.minCompletion;
      }
      if (filters?.maxCompletion !== undefined) {
        where.completionPercentage.lte = filters.maxCompletion;
      }
    }

    // Fetch job sites with related data
    const jobSites = await prisma.jobSite.findMany({
      where,
      include: {
        supervisor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        floors: {
          select: { id: true },
        },
        assignments: {
          select: { userId: true },
          distinct: ['userId'],
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to JobSiteWithProgress
    return jobSites.map((site) => ({
      id: site.id,
      name: site.name,
      address: site.address,
      notes: site.notes,
      supervisorId: site.supervisorId,
      startDate: site.startDate,
      completionPercentage: site.completionPercentage,
      isActive: site.isActive,
      createdAt: site.createdAt,
      updatedAt: site.updatedAt,
      supervisor: site.supervisor,
      floorCount: site.floors.length,
      activeWorkerCount: site.assignments.length,
    }));
  }

  /**
   * Get a single job site by ID with permissions check
   */
  async getJobSiteById(
    id: string,
    userId?: string,
    userRole?: UserRole
  ) {
    const jobSite = await prisma.jobSite.findUnique({
      where: { id },
      include: {
        supervisor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        floors: {
          include: {
            areas: {
              include: {
                tasks: {
                  orderBy: { taskOrder: 'asc' },
                },
              },
              orderBy: { name: 'asc' },
            },
          },
          orderBy: { floorNumber: 'asc' },
        },
      },
    });

    if (!jobSite) {
      throw new NotFoundError('Job site not found');
    }

    // Check permissions - supervisor can only view their own sites
    if (
      userRole === UserRole.SUPERVISOR &&
      userId &&
      jobSite.supervisorId !== userId
    ) {
      throw new ForbiddenError('You do not have access to this job site');
    }

    return jobSite;
  }

  /**
   * Get complete job site hierarchy with all nested data
   */
  async getJobSiteHierarchy(
    id: string,
    userId?: string,
    userRole?: UserRole
  ): Promise<JobSiteHierarchy> {
    const jobSite = await prisma.jobSite.findUnique({
      where: { id },
      include: {
        supervisor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        floors: {
          include: {
            areas: {
              include: {
                tasks: {
                  orderBy: { taskOrder: 'asc' },
                },
                assignments: {
                  select: { userId: true },
                  distinct: ['userId'],
                },
                flags: {
                  where: { status: { not: FlagStatus.RESOLVED } },
                },
              },
              orderBy: { name: 'asc' },
            },
            assignments: {
              select: { userId: true },
              distinct: ['userId'],
            },
            flags: {
              where: { status: { not: FlagStatus.RESOLVED } },
            },
          },
          orderBy: { floorNumber: 'asc' },
        },
      },
    });

    if (!jobSite) {
      throw new NotFoundError('Job site not found');
    }

    // Check permissions
    if (
      userRole === UserRole.SUPERVISOR &&
      userId &&
      jobSite.supervisorId !== userId
    ) {
      throw new ForbiddenError('You do not have access to this job site');
    }

    // Transform floors to hierarchy structure
    const floors: FloorHierarchy[] = jobSite.floors.map((floor) => {
      const areas: AreaHierarchy[] = floor.areas.map((area) => {
        const tasks: TaskHierarchy[] = area.tasks.map((task) => ({
          id: task.id,
          name: task.name,
          taskOrder: task.taskOrder,
          notes: task.notes,
          completionPercentage: task.completionPercentage,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        }));

        return {
          id: area.id,
          name: area.name,
          notes: area.notes,
          areaType: area.areaType,
          completionPercentage: area.completionPercentage,
          createdAt: area.createdAt,
          updatedAt: area.updatedAt,
          tasks,
          assignedWorkerCount: area.assignments.length,
          flagCount: area.flags.length,
        };
      });

      return {
        id: floor.id,
        name: floor.name,
        floorNumber: floor.floorNumber,
        notes: floor.notes,
        completionPercentage: floor.completionPercentage,
        createdAt: floor.createdAt,
        updatedAt: floor.updatedAt,
        areas,
        assignedWorkerCount: floor.assignments.length,
        flagCount: floor.flags.length,
      };
    });

    // Calculate total worker count and flag count
    const uniqueAssignments = await prisma.assignment.findMany({
      where: {
        jobSiteId: id,
      },
      select: { userId: true },
      distinct: ['userId'],
    });
    const totalWorkerCount = uniqueAssignments.length;

    const totalFlagCount = await prisma.flag.count({
      where: {
        jobSiteId: id,
        status: { not: FlagStatus.RESOLVED },
      },
    });

    return {
      ...jobSite,
      supervisor: jobSite.supervisor,
      floors,
      totalWorkerCount,
      totalFlagCount,
    };
  }

  /**
   * Create a new job site
   */
  async createJobSite(
    data: CreateJobSiteDto,
    createdBy: string
  ) {
    // Validate supervisor exists and has SUPERVISOR role
    const supervisor = await prisma.user.findUnique({
      where: { id: data.supervisorId },
    });

    if (!supervisor) {
      throw new NotFoundError('Supervisor not found');
    }

    if (supervisor.role !== UserRole.SUPERVISOR) {
      throw new BadRequestError('Assigned user must have SUPERVISOR role');
    }

    // Create job site
    const jobSite = await prisma.jobSite.create({
      data: {
        name: data.name,
        address: data.address,
        supervisorId: data.supervisorId,
        startDate: data.startDate || new Date(),
        notes: data.notes,
        completionPercentage: 0,
      },
      include: {
        supervisor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: createdBy,
        action: 'CREATE',
        entityType: 'JOB_SITE',
        entityId: jobSite.id,
      },
    });

    return jobSite;
  }

  /**
   * Update a job site
   */
  async updateJobSite(
    id: string,
    data: UpdateJobSiteDto,
    userId: string,
    userRole: UserRole
  ) {
    // Check if site exists
    const existingSite = await prisma.jobSite.findUnique({
      where: { id },
    });

    if (!existingSite) {
      throw new NotFoundError('Job site not found');
    }

    // Check permissions - only admin or site supervisor can update
    if (
      userRole === UserRole.SUPERVISOR &&
      existingSite.supervisorId !== userId
    ) {
      throw new ForbiddenError('You do not have permission to update this job site');
    }

    // Cannot change supervisor if site has active workers
    if (
      data.supervisorId &&
      data.supervisorId !== existingSite.supervisorId
    ) {
      const activeAssignments = await prisma.assignment.count({
        where: { jobSiteId: id },
      });

      if (activeAssignments > 0) {
        throw new BadRequestError(
          'Cannot change supervisor while site has active worker assignments'
        );
      }

      // Validate new supervisor
      const newSupervisor = await prisma.user.findUnique({
        where: { id: data.supervisorId },
      });

      if (!newSupervisor) {
        throw new NotFoundError('New supervisor not found');
      }

      if (newSupervisor.role !== UserRole.SUPERVISOR) {
        throw new BadRequestError('Assigned user must have SUPERVISOR role');
      }
    }

    // Update job site
    const updatedSite = await prisma.jobSite.update({
      where: { id },
      data: {
        ...data,
      },
      include: {
        supervisor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'UPDATE',
        entityType: 'JOB_SITE',
        entityId: id,
      },
    });

    return updatedSite;
  }

  /**
   * Soft delete a job site (only ADMIN)
   */
  async deleteJobSite(
    id: string,
    userId: string,
    userRole: UserRole
  ) {
    // Only ADMIN can delete
    if (userRole !== UserRole.ADMIN) {
      throw new ForbiddenError('Only administrators can delete job sites');
    }

    // Check if site exists
    const existingSite = await prisma.jobSite.findUnique({
      where: { id },
    });

    if (!existingSite) {
      throw new NotFoundError('Job site not found');
    }

    // Soft delete the site
    await prisma.jobSite.update({
      where: { id },
      data: { isActive: false },
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId,
        action: 'DELETE',
        entityType: 'JOB_SITE',
        entityId: id,
      },
    });

    return { message: 'Job site deleted successfully' };
  }

  /**
   * Calculate and update site progress based on floor completion
   */
  async calculateSiteProgress(id: string): Promise<SiteProgressResult> {
    // Get all floors with their areas
    const floors = await prisma.floor.findMany({
      where: {
        jobSiteId: id,
      },
      include: {
        areas: {
          select: { completionPercentage: true },
        },
      },
    });

    if (floors.length === 0) {
      // No floors, set site to 0%
      await prisma.jobSite.update({
        where: { id },
        data: { completionPercentage: 0 },
      });

      return {
        siteId: id,
        completionPercentage: 0,
        lastUpdated: new Date(),
      };
    }

    // Calculate weighted average
    // Each floor's completion is the average of its areas
    // Site completion is the average of all floor completions weighted by area count
    let totalAreaCount = 0;
    let weightedSum = 0;

    for (const floor of floors) {
      const areaCount = floor.areas.length;
      if (areaCount > 0) {
        // Floor completion is already calculated as average of areas
        weightedSum += floor.completionPercentage * areaCount;
        totalAreaCount += areaCount;
      }
    }

    const completionPercentage =
      totalAreaCount > 0 ? Math.round(weightedSum / totalAreaCount) : 0;

    // Update site completion
    await prisma.jobSite.update({
      where: { id },
      data: { completionPercentage },
    });

    return {
      siteId: id,
      completionPercentage,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get all painters currently active at a job site
   */
  async getActivePainters(siteId: string): Promise<ActivePainter[]> {
    // Check if site exists
    const site = await prisma.jobSite.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      throw new NotFoundError('Job site not found');
    }

    // Get all active time entries (clocked in, no clock out)
    const activeEntries = await prisma.timeEntry.findMany({
      where: {
        jobSiteId: siteId,
        clockOut: null, // Currently clocked in
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        floor: {
          select: {
            name: true,
          },
        },
        area: {
          select: {
            name: true,
          },
        },
      },
    });

    // Calculate hours worked today for each painter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const painters: ActivePainter[] = await Promise.all(
      activeEntries.map(async (entry) => {
        // Get all time entries for today
        const todayEntries = await prisma.timeEntry.findMany({
          where: {
            userId: entry.userId,
            jobSiteId: siteId,
            clockIn: {
              gte: today,
              lt: tomorrow,
            },
          },
        });

        // Calculate total hours
        let totalMinutes = 0;
        for (const timeEntry of todayEntries) {
          const clockIn = timeEntry.clockIn;
          const clockOut = timeEntry.clockOut || new Date(); // Use current time if still clocked in
          const minutes = Math.floor(
            (clockOut.getTime() - clockIn.getTime()) / (1000 * 60)
          );
          totalMinutes += minutes;
        }

        return {
          id: entry.user.id,
          firstName: entry.user.firstName,
          lastName: entry.user.lastName,
          email: entry.user.email,
          currentFloor: entry.floor?.name || null,
          currentArea: entry.area?.name || null,
          clockedInAt: entry.clockIn,
          hoursWorkedToday: Math.round((totalMinutes / 60) * 100) / 100, // Round to 2 decimals
        };
      })
    );

    return painters;
  }
}

// Export singleton instance
export const jobSiteService = new JobSiteService();
