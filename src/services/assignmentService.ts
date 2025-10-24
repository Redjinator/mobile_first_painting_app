import { prisma } from '@/lib/prisma';
import { UserRole, AssignableType } from '@prisma/client';
import { NotFoundError, UnauthorizedError, BadRequestError } from '@/lib/api/errors';
import { CreateAssignmentDto, AssignmentWithDetails, AssignmentHierarchy } from '@/types/assignment';

export class AssignmentService {
  /**
   * Get all assignments for a user (painter)
   */
  static async getAssignmentsForUser(userId: string): Promise<AssignmentWithDetails[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const assignments = await prisma.assignment.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        jobSite: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        floor: {
          select: {
            id: true,
            name: true,
            floorNumber: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
            areaType: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    return assignments;
  }

  /**
   * Get all assignments for a job site (hierarchical view)
   */
  static async getAssignmentsForSite(
    siteId: string,
    userId?: string,
    userRole?: UserRole
  ): Promise<AssignmentHierarchy> {
    // Check if site exists
    const site = await prisma.jobSite.findUnique({
      where: { id: siteId },
      include: { supervisor: true },
    });

    if (!site) {
      throw new NotFoundError('Job site not found');
    }

    // Check permissions
    if (userRole === 'EMPLOYEE') {
      throw new UnauthorizedError('Employees cannot view site assignments');
    }

    if (userRole === 'SUPERVISOR' && site.supervisorId !== userId) {
      throw new UnauthorizedError('You can only view assignments for sites you supervise');
    }

    // Get site-level assignments
    const siteAssignments = await prisma.assignment.findMany({
      where: {
        jobSiteId: siteId,
        assignableType: 'JOB_SITE',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Get floors with their assignments and areas
    const floors = await prisma.floor.findMany({
      where: { jobSiteId: siteId },
      include: {
        areas: {
          include: {
            assignments: {
              where: {
                assignableType: 'AREA',
              },
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
        assignments: {
          where: {
            assignableType: 'FLOOR',
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { floorNumber: 'asc' },
    });

    // Build hierarchy
    return {
      site: {
        id: site.id,
        name: site.name,
        address: site.address,
      },
      sitePainters: siteAssignments.map((a) => a.user),
      floors: floors.map((floor) => ({
        id: floor.id,
        name: floor.name,
        floorNumber: floor.floorNumber,
        painters: floor.assignments.map((a) => a.user),
        areas: floor.areas.map((area) => ({
          id: area.id,
          name: area.name,
          areaType: area.areaType,
          painters: area.assignments.map((a) => a.user),
        })),
      })),
    };
  }

  /**
   * Assign painter to entire job site
   */
  static async assignPainterToSite(
    userId: string,
    siteId: string,
    assignedBy: string
  ) {
    // Validate user is a painter
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.role !== 'EMPLOYEE') {
      throw new BadRequestError('Only employees can be assigned to sites');
    }

    if (!user.isActive) {
      throw new BadRequestError('Cannot assign inactive user');
    }

    // Validate site exists
    const site = await prisma.jobSite.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      throw new NotFoundError('Job site not found');
    }

    // Check for existing assignment
    const existing = await prisma.assignment.findUnique({
      where: {
        userId_assignableType_assignableId: {
          userId,
          assignableType: 'JOB_SITE',
          assignableId: siteId,
        },
      },
    });

    if (existing) {
      throw new BadRequestError('User is already assigned to this site');
    }

    // Create assignment
    return prisma.assignment.create({
      data: {
        userId,
        assignableType: 'JOB_SITE',
        assignableId: siteId,
        jobSiteId: siteId,
        assignedBy,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        jobSite: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });
  }

  /**
   * Assign painter to specific floor
   */
  static async assignPainterToFloor(
    userId: string,
    floorId: string,
    assignedBy: string
  ) {
    // Validate user is a painter
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.role !== 'EMPLOYEE') {
      throw new BadRequestError('Only employees can be assigned to floors');
    }

    if (!user.isActive) {
      throw new BadRequestError('Cannot assign inactive user');
    }

    // Validate floor exists
    const floor = await prisma.floor.findUnique({
      where: { id: floorId },
      include: { jobSite: true },
    });

    if (!floor) {
      throw new NotFoundError('Floor not found');
    }

    // Check for existing assignment
    const existing = await prisma.assignment.findUnique({
      where: {
        userId_assignableType_assignableId: {
          userId,
          assignableType: 'FLOOR',
          assignableId: floorId,
        },
      },
    });

    if (existing) {
      throw new BadRequestError('User is already assigned to this floor');
    }

    // Create assignment
    return prisma.assignment.create({
      data: {
        userId,
        assignableType: 'FLOOR',
        assignableId: floorId,
        jobSiteId: floor.jobSiteId,
        floorId,
        assignedBy,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        floor: {
          select: {
            id: true,
            name: true,
            floorNumber: true,
          },
        },
      },
    });
  }

  /**
   * Assign painter to specific area
   */
  static async assignPainterToArea(
    userId: string,
    areaId: string,
    assignedBy: string
  ) {
    // Validate user is a painter
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.role !== 'EMPLOYEE') {
      throw new BadRequestError('Only employees can be assigned to areas');
    }

    if (!user.isActive) {
      throw new BadRequestError('Cannot assign inactive user');
    }

    // Validate area exists
    const area = await prisma.area.findUnique({
      where: { id: areaId },
      include: {
        floor: {
          include: { jobSite: true },
        },
      },
    });

    if (!area) {
      throw new NotFoundError('Area not found');
    }

    // Check for existing assignment
    const existing = await prisma.assignment.findUnique({
      where: {
        userId_assignableType_assignableId: {
          userId,
          assignableType: 'AREA',
          assignableId: areaId,
        },
      },
    });

    if (existing) {
      throw new BadRequestError('User is already assigned to this area');
    }

    // Create assignment
    return prisma.assignment.create({
      data: {
        userId,
        assignableType: 'AREA',
        assignableId: areaId,
        jobSiteId: area.floor.jobSiteId,
        floorId: area.floorId,
        areaId,
        assignedBy,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
            areaType: true,
          },
        },
      },
    });
  }

  /**
   * Remove an assignment
   */
  static async removeAssignment(
    assignmentId: string,
    removedBy: string,
    userRole: UserRole
  ) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        jobSite: {
          include: { supervisor: true },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundError('Assignment not found');
    }

    // Check permissions
    if (userRole === 'EMPLOYEE') {
      throw new UnauthorizedError('Employees cannot remove assignments');
    }

    if (
      userRole === 'SUPERVISOR' &&
      assignment.jobSite?.supervisorId !== removedBy
    ) {
      throw new UnauthorizedError(
        'You can only remove assignments for sites you supervise'
      );
    }

    // Check for active time entries
    const activeTimeEntry = await prisma.timeEntry.findFirst({
      where: {
        userId: assignment.userId,
        ...(assignment.jobSiteId && { jobSiteId: assignment.jobSiteId }),
        clockOut: null, // Still clocked in
      },
    });

    if (activeTimeEntry) {
      throw new BadRequestError(
        'Cannot remove assignment while painter is clocked in. Please clock them out first.'
      );
    }

    // Delete assignment
    await prisma.assignment.delete({
      where: { id: assignmentId },
    });

    return { success: true, message: 'Assignment removed successfully' };
  }

  /**
   * Bulk assign painters
   */
  static async bulkAssign(
    assignments: CreateAssignmentDto[],
    assignedBy: string
  ) {
    // Validate all assignments
    for (const assignment of assignments) {
      const user = await prisma.user.findUnique({
        where: { id: assignment.userId },
      });

      if (!user) {
        throw new NotFoundError(`User ${assignment.userId} not found`);
      }

      if (user.role !== 'EMPLOYEE') {
        throw new BadRequestError(
          `User ${user.email} is not an employee`
        );
      }

      if (!user.isActive) {
        throw new BadRequestError(`User ${user.email} is inactive`);
      }
    }

    // Create assignments in a transaction
    const created = await prisma.$transaction(
      assignments.map((assignment) => {
        // Determine the foreign keys based on assignable type
        let data: any = {
          userId: assignment.userId,
          assignableType: assignment.assignableType,
          assignableId: assignment.assignableId,
          assignedBy,
        };

        // We'll set the foreign keys based on the assignable type
        // This will be validated by the database constraints
        if (assignment.assignableType === 'JOB_SITE') {
          data.jobSiteId = assignment.assignableId;
        } else if (assignment.assignableType === 'FLOOR') {
          // We need to look up the floor to get the job site ID
          // This will be done in the transaction
          data.floorId = assignment.assignableId;
        } else if (assignment.assignableType === 'AREA') {
          data.areaId = assignment.assignableId;
        }

        return prisma.assignment.create({
          data,
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
      })
    );

    return created;
  }
}
