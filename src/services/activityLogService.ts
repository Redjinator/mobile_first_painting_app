import { prisma } from '@/lib/prisma';
import { EntityType, Action, UserRole } from '@prisma/client';
import { ActivityLogEntry, CreateActivityLogDto, ActivityLogFilters } from '@/types/activityLog';
import { UnauthorizedError } from '@/lib/api/errors';

export class ActivityLogService {
  /**
   * Create an activity log entry
   */
  static async createLog(
    userId: string,
    data: CreateActivityLogDto
  ): Promise<ActivityLogEntry> {
    const log = await prisma.activityLog.create({
      data: {
        userId,
        entityType: data.entityType,
        entityId: data.entityId,
        action: data.action,
        changes: data.changes || {},
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
      },
    });

    return log;
  }

  /**
   * Get activity logs for a specific entity
   */
  static async getLogsForEntity(
    entityType: EntityType,
    entityId: string,
    limit: number = 50
  ): Promise<ActivityLogEntry[]> {
    const logs = await prisma.activityLog.findMany({
      where: {
        entityType,
        entityId,
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
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs;
  }

  /**
   * Get activity logs for a user
   */
  static async getLogsForUser(
    userId: string,
    startDate?: Date,
    endDate?: Date,
    limit: number = 100
  ): Promise<ActivityLogEntry[]> {
    const logs = await prisma.activityLog.findMany({
      where: {
        userId,
        ...(startDate && { createdAt: { gte: startDate } }),
        ...(endDate && { createdAt: { lte: endDate } }),
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
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return logs;
  }

  /**
   * Get recent activity across a site or all sites
   */
  static async getRecentActivity(
    siteId: string | null,
    limit: number = 50,
    requestingUserId: string,
    requestingUserRole: UserRole
  ): Promise<ActivityLogEntry[]> {
    // Build the where clause based on siteId and role
    let whereClause: any = {};

    if (siteId) {
      // Get activity for a specific site
      // We need to find all entities related to this site
      const site = await prisma.jobSite.findUnique({
        where: { id: siteId },
        include: {
          floors: {
            include: {
              areas: {
                include: {
                  tasks: true,
                },
              },
            },
          },
        },
      });

      if (!site) {
        return [];
      }

      // Collect all entity IDs related to this site
      const entityIds = [
        site.id,
        ...site.floors.map(f => f.id),
        ...site.floors.flatMap(f => f.areas.map(a => a.id)),
        ...site.floors.flatMap(f => f.areas.flatMap(a => a.tasks.map(t => t.id))),
      ];

      whereClause.entityId = { in: entityIds };
    } else {
      // For EMPLOYEE role, only show their own activity
      if (requestingUserRole === UserRole.EMPLOYEE) {
        whereClause.userId = requestingUserId;
      }
      // For SUPERVISOR, show activity on their assigned sites
      else if (requestingUserRole === UserRole.SUPERVISOR) {
        const supervisorSites = await prisma.jobSite.findMany({
          where: { supervisorId: requestingUserId },
          include: {
            floors: {
              include: {
                areas: {
                  include: {
                    tasks: true,
                  },
                },
              },
            },
          },
        });

        const entityIds = supervisorSites.flatMap(site => [
          site.id,
          ...site.floors.map(f => f.id),
          ...site.floors.flatMap(f => f.areas.map(a => a.id)),
          ...site.floors.flatMap(f => f.areas.flatMap(a => a.tasks.map(t => t.id))),
        ]);

        whereClause.entityId = { in: entityIds };
      }
      // ADMIN sees all activity (no filter)
    }

    const logs = await prisma.activityLog.findMany({
      where: whereClause,
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
      take: limit,
    });

    return logs;
  }

  /**
   * Get activity logs with filters
   */
  static async getActivityLogs(
    filters: ActivityLogFilters,
    requestingUserId: string,
    requestingUserRole: UserRole
  ): Promise<ActivityLogEntry[]> {
    // Build where clause
    let whereClause: any = {};

    if (filters.entityType) {
      whereClause.entityType = filters.entityType;
    }

    if (filters.entityId) {
      whereClause.entityId = filters.entityId;
    }

    if (filters.userId) {
      whereClause.userId = filters.userId;
    }

    if (filters.startDate) {
      whereClause.createdAt = { ...whereClause.createdAt, gte: filters.startDate };
    }

    if (filters.endDate) {
      whereClause.createdAt = { ...whereClause.createdAt, lte: filters.endDate };
    }

    // Apply role-based filtering
    if (requestingUserRole === UserRole.EMPLOYEE) {
      // Employees can only see their own activity
      whereClause.userId = requestingUserId;
    } else if (requestingUserRole === UserRole.SUPERVISOR) {
      // Supervisors can only see activity on their assigned sites
      const supervisorSites = await prisma.jobSite.findMany({
        where: { supervisorId: requestingUserId },
        include: {
          floors: {
            include: {
              areas: {
                include: {
                  tasks: true,
                },
              },
            },
          },
        },
      });

      const entityIds = supervisorSites.flatMap(site => [
        site.id,
        ...site.floors.map(f => f.id),
        ...site.floors.flatMap(f => f.areas.map(a => a.id)),
        ...site.floors.flatMap(f => f.areas.flatMap(a => a.tasks.map(t => t.id))),
      ]);

      whereClause.entityId = { in: entityIds };
    }
    // ADMIN has no restrictions

    const logs = await prisma.activityLog.findMany({
      where: whereClause,
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
      take: filters.limit || 50,
    });

    return logs;
  }
}
