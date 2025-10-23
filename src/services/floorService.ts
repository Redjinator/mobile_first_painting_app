import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { NotFoundError, UnauthorizedError, BadRequestError } from '@/lib/api/errors';
import { CreateFloorDto, UpdateFloorDto, FloorWithAreas, FloorSummary } from '@/types/floor';

export class FloorService {
  /**
   * Get all floors for a job site
   */
  static async getAllFloors(
    jobSiteId: string,
    userId?: string,
    userRole?: UserRole
  ): Promise<FloorSummary[]> {
    // Check if site exists
    const site = await prisma.jobSite.findUnique({
      where: { id: jobSiteId },
      include: { supervisor: true },
    });

    if (!site) {
      throw new NotFoundError('Job site not found');
    }

    // Check permissions
    if (userRole === 'EMPLOYEE') {
      throw new UnauthorizedError('Employees cannot view floor lists');
    }

    if (userRole === 'SUPERVISOR' && site.supervisorId !== userId) {
      throw new UnauthorizedError('You can only view floors for sites you supervise');
    }

    const floors = await prisma.floor.findMany({
      where: { jobSiteId },
      include: {
        areas: {
          include: {
            tasks: true,
          },
        },
      },
      orderBy: { floorNumber: 'asc' },
    });

    return floors.map((floor) => ({
      ...floor,
      areaCount: floor.areas.length,
      taskCount: floor.areas.reduce((sum, area) => sum + area.tasks.length, 0),
    }));
  }

  /**
   * Get a single floor by ID with areas
   */
  static async getFloorById(
    id: string,
    userId?: string,
    userRole?: UserRole
  ): Promise<FloorWithAreas> {
    const floor = await prisma.floor.findUnique({
      where: { id },
      include: {
        areas: {
          include: {
            tasks: true,
            subAreas: true,
          },
        },
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
      throw new UnauthorizedError('Employees cannot view floor details');
    }

    if (userRole === 'SUPERVISOR' && floor.jobSite.supervisorId !== userId) {
      throw new UnauthorizedError('You can only view floors for sites you supervise');
    }

    return {
      ...floor,
      areaCount: floor.areas.length,
    };
  }

  /**
   * Create a single floor
   */
  static async createFloor(
    jobSiteId: string,
    data: CreateFloorDto,
    createdBy: string
  ) {
    // Check if site exists
    const site = await prisma.jobSite.findUnique({
      where: { id: jobSiteId },
    });

    if (!site) {
      throw new NotFoundError('Job site not found');
    }

    // Auto-increment floor number if not provided
    if (!data.floorNumber && data.floorNumber !== 0) {
      const maxFloor = await prisma.floor.findFirst({
        where: { jobSiteId },
        orderBy: { floorNumber: 'desc' },
      });

      data.floorNumber = maxFloor ? maxFloor.floorNumber + 1 : 1;
    }

    return prisma.floor.create({
      data: {
        ...data,
        jobSiteId,
      },
    });
  }

  /**
   * Create multiple floors at once
   */
  static async createFloorsBulk(
    jobSiteId: string,
    count: number,
    createdBy: string
  ) {
    // Check if site exists
    const site = await prisma.jobSite.findUnique({
      where: { id: jobSiteId },
    });

    if (!site) {
      throw new NotFoundError('Job site not found');
    }

    // Get the starting floor number
    const maxFloor = await prisma.floor.findFirst({
      where: { jobSiteId },
      orderBy: { floorNumber: 'desc' },
    });

    const startNumber = maxFloor ? maxFloor.floorNumber + 1 : 1;

    // Create array of floor data
    const floorsData = Array.from({ length: count }, (_, i) => ({
      name: `Floor ${startNumber + i}`,
      floorNumber: startNumber + i,
      jobSiteId,
      completionPercentage: 0,
    }));

    // Bulk create
    const result = await prisma.floor.createMany({
      data: floorsData,
    });

    // Return created floors
    const floors = await prisma.floor.findMany({
      where: {
        jobSiteId,
        floorNumber: {
          gte: startNumber,
          lt: startNumber + count,
        },
      },
      orderBy: { floorNumber: 'asc' },
    });

    return floors;
  }

  /**
   * Update a floor
   */
  static async updateFloor(
    id: string,
    data: UpdateFloorDto,
    userId: string,
    userRole: UserRole
  ) {
    const floor = await prisma.floor.findUnique({
      where: { id },
      include: {
        jobSite: true,
      },
    });

    if (!floor) {
      throw new NotFoundError('Floor not found');
    }

    // Check permissions
    if (userRole === 'EMPLOYEE') {
      throw new UnauthorizedError('Employees cannot update floors');
    }

    if (userRole === 'SUPERVISOR' && floor.jobSite.supervisorId !== userId) {
      throw new UnauthorizedError('You can only update floors for sites you supervise');
    }

    return prisma.floor.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a floor
   */
  static async deleteFloor(id: string, userId: string, userRole: UserRole) {
    const floor = await prisma.floor.findUnique({
      where: { id },
      include: {
        jobSite: true,
      },
    });

    if (!floor) {
      throw new NotFoundError('Floor not found');
    }

    // Check permissions
    if (userRole !== 'ADMIN') {
      throw new UnauthorizedError('Only administrators can delete floors');
    }

    // Check for active time entries on this floor
    const activeTimeEntries = await prisma.timeEntry.findMany({
      where: {
        floorId: id,
        clockOut: null, // Active time entries
      },
    });

    if (activeTimeEntries.length > 0) {
      throw new BadRequestError(
        'Cannot delete floor with active time entries. Please clock out all painters first.'
      );
    }

    // Delete floor (cascade will handle areas and tasks)
    await prisma.floor.delete({
      where: { id },
    });

    return { success: true, message: 'Floor deleted successfully' };
  }

  /**
   * Calculate and update floor progress
   */
  static async calculateFloorProgress(id: string): Promise<number> {
    const floor = await prisma.floor.findUnique({
      where: { id },
      include: {
        areas: true,
      },
    });

    if (!floor) {
      throw new NotFoundError('Floor not found');
    }

    if (floor.areas.length === 0) {
      // No areas, progress is 0
      await prisma.floor.update({
        where: { id },
        data: { completionPercentage: 0 },
      });
      return 0;
    }

    // Calculate average of all area completion percentages
    const totalProgress = floor.areas.reduce(
      (sum, area) => sum + area.completionPercentage,
      0
    );
    const averageProgress = Math.round(totalProgress / floor.areas.length);

    // Update floor progress
    await prisma.floor.update({
      where: { id },
      data: { completionPercentage: averageProgress },
    });

    return averageProgress;
  }
}
