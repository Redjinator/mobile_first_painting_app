import { prisma } from '@/lib/prisma';
import { UserRole, FlagStatus, FlagType, FlaggableType } from '@prisma/client';
import { FlagWithDetails, CreateFlagDto, UpdateFlagDto, FlagFilters } from '@/types/flag';
import { NotFoundError, UnauthorizedError, BadRequestError } from '@/lib/api/errors';

export class FlagService {
  /**
   * Create a new flag
   */
  static async createFlag(
    data: CreateFlagDto,
    createdBy: string
  ): Promise<FlagWithDetails> {
    // Verify the entity exists
    await this.verifyEntityExists(data.flaggableType, data.flaggableId);

    const flag = await prisma.flag.create({
      data: {
        flaggableType: data.flaggableType,
        flaggableId: data.flaggableId,
        type: data.type,
        description: data.description,
        status: FlagStatus.OPEN,
        createdBy,
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        resolvedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return flag;
  }

  /**
   * Update a flag
   */
  static async updateFlag(
    id: string,
    data: UpdateFlagDto,
    userId: string,
    userRole: UserRole
  ): Promise<FlagWithDetails> {
    const flag = await prisma.flag.findUnique({
      where: { id },
    });

    if (!flag) {
      throw new NotFoundError('Flag not found');
    }

    // Only creator or admin can update
    if (flag.createdBy !== userId && userRole !== UserRole.ADMIN) {
      throw new UnauthorizedError('Only the flag creator or admin can update this flag');
    }

    const updatedFlag = await prisma.flag.update({
      where: { id },
      data,
      include: {
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        resolvedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return updatedFlag;
  }

  /**
   * Resolve a flag
   */
  static async resolveFlag(
    id: string,
    resolvedBy: string
  ): Promise<FlagWithDetails> {
    const flag = await prisma.flag.findUnique({
      where: { id },
    });

    if (!flag) {
      throw new NotFoundError('Flag not found');
    }

    if (flag.status === FlagStatus.RESOLVED) {
      throw new BadRequestError('Flag is already resolved');
    }

    const resolvedFlag = await prisma.flag.update({
      where: { id },
      data: {
        status: FlagStatus.RESOLVED,
        resolvedBy,
        resolvedAt: new Date(),
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        resolvedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return resolvedFlag;
  }

  /**
   * Delete a flag (admin only)
   */
  static async deleteFlag(
    id: string,
    userId: string,
    userRole: UserRole
  ): Promise<void> {
    if (userRole !== UserRole.ADMIN) {
      throw new UnauthorizedError('Only admins can delete flags');
    }

    const flag = await prisma.flag.findUnique({
      where: { id },
    });

    if (!flag) {
      throw new NotFoundError('Flag not found');
    }

    await prisma.flag.delete({
      where: { id },
    });
  }

  /**
   * Get flags for a site
   */
  static async getFlagsForSite(
    siteId: string,
    status?: FlagStatus,
    type?: FlagType,
    userId?: string,
    userRole?: UserRole
  ): Promise<FlagWithDetails[]> {
    // Verify site exists
    const site = await prisma.jobSite.findUnique({
      where: { id: siteId },
      include: {
        floors: {
          include: {
            areas: true,
          },
        },
      },
    });

    if (!site) {
      throw new NotFoundError('Job site not found');
    }

    // Collect all flaggable IDs for this site
    const flaggableIds = [
      siteId,
      ...site.floors.map(f => f.id),
      ...site.floors.flatMap(f => f.areas.map(a => a.id)),
    ];

    const flags = await prisma.flag.findMany({
      where: {
        flaggableId: { in: flaggableIds },
        ...(status && { status }),
        ...(type && { type }),
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        resolvedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return flags;
  }

  /**
   * Get flags for a specific entity
   */
  static async getFlagsForEntity(
    flaggableType: FlaggableType,
    flaggableId: string
  ): Promise<FlagWithDetails[]> {
    // Verify entity exists
    await this.verifyEntityExists(flaggableType, flaggableId);

    const flags = await prisma.flag.findMany({
      where: {
        flaggableType,
        flaggableId,
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        resolvedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return flags;
  }

  /**
   * Get a single flag by ID
   */
  static async getFlagById(id: string): Promise<FlagWithDetails> {
    const flag = await prisma.flag.findUnique({
      where: { id },
      include: {
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        resolvedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!flag) {
      throw new NotFoundError('Flag not found');
    }

    return flag;
  }

  /**
   * Get flags with filters
   */
  static async getFlags(
    filters: FlagFilters,
    userId: string,
    userRole: UserRole
  ): Promise<FlagWithDetails[]> {
    let whereClause: any = {};

    if (filters.flaggableType) {
      whereClause.flaggableType = filters.flaggableType;
    }

    if (filters.flaggableId) {
      whereClause.flaggableId = filters.flaggableId;
    }

    if (filters.type) {
      whereClause.type = filters.type;
    }

    if (filters.status) {
      whereClause.status = filters.status;
    }

    if (filters.createdBy) {
      whereClause.createdBy = filters.createdBy;
    }

    // Apply role-based filtering
    if (userRole === UserRole.SUPERVISOR) {
      // Supervisors can only see flags on their assigned sites
      const supervisorSites = await prisma.jobSite.findMany({
        where: { supervisorId: userId },
        include: {
          floors: {
            include: {
              areas: true,
            },
          },
        },
      });

      const flaggableIds = supervisorSites.flatMap(site => [
        site.id,
        ...site.floors.map(f => f.id),
        ...site.floors.flatMap(f => f.areas.map(a => a.id)),
      ]);

      whereClause.flaggableId = { in: flaggableIds };
    } else if (userRole === UserRole.EMPLOYEE) {
      // Employees can only see flags on their assigned areas
      const assignments = await prisma.assignment.findMany({
        where: { userId },
      });

      const flaggableIds = assignments.map(a => a.assignableId);
      whereClause.flaggableId = { in: flaggableIds };
    }
    // ADMIN has no restrictions

    const flags = await prisma.flag.findMany({
      where: whereClause,
      include: {
        createdByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        resolvedByUser: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return flags;
  }

  /**
   * Helper method to verify entity exists
   */
  private static async verifyEntityExists(
    flaggableType: FlaggableType,
    flaggableId: string
  ): Promise<void> {
    let exists = false;

    switch (flaggableType) {
      case FlaggableType.JOB_SITE:
        exists = !!(await prisma.jobSite.findUnique({ where: { id: flaggableId } }));
        break;
      case FlaggableType.FLOOR:
        exists = !!(await prisma.floor.findUnique({ where: { id: flaggableId } }));
        break;
      case FlaggableType.AREA:
        exists = !!(await prisma.area.findUnique({ where: { id: flaggableId } }));
        break;
    }

    if (!exists) {
      throw new NotFoundError(`${flaggableType} not found`);
    }
  }
}
