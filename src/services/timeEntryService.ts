import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { NotFoundError, UnauthorizedError, BadRequestError } from '@/lib/api/errors';
import {
  ClockInDto,
  ClockOutDto,
  TimeEntryWithDetails,
  ActiveWorker,
  TodayHoursResponse,
} from '@/types/timeEntry';
import { jobSiteService } from './jobSiteService';

export class TimeEntryService {
  /**
   * Clock in a painter
   */
  static async clockIn(userId: string, data: ClockInDto): Promise<TimeEntryWithDetails> {
    // Check if user exists and is a painter
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.role !== 'EMPLOYEE') {
      throw new BadRequestError('Only employees can clock in');
    }

    if (!user.isActive) {
      throw new BadRequestError('Cannot clock in as inactive user');
    }

    // Check if already clocked in
    const existingEntry = await prisma.timeEntry.findFirst({
      where: {
        userId,
        clockOut: null, // Still clocked in
      },
    });

    if (existingEntry) {
      throw new BadRequestError('You are already clocked in. Please clock out first.');
    }

    // Validate job site exists
    const site = await prisma.jobSite.findUnique({
      where: { id: data.jobSiteId },
    });

    if (!site) {
      throw new NotFoundError('Job site not found');
    }

    // Note: Employees can clock in to any job site without requiring an assignment
    // Assignments are used for task organization but not for time tracking restrictions

    // Validate floor if provided
    if (data.floorId) {
      const floor = await prisma.floor.findUnique({
        where: { id: data.floorId },
      });

      if (!floor || floor.jobSiteId !== data.jobSiteId) {
        throw new BadRequestError('Invalid floor for this job site');
      }
    }

    // Validate area if provided
    if (data.areaId) {
      const area = await prisma.area.findUnique({
        where: { id: data.areaId },
        include: { floor: true },
      });

      if (!area) {
        throw new NotFoundError('Area not found');
      }

      if (area.floor.jobSiteId !== data.jobSiteId) {
        throw new BadRequestError('Invalid area for this job site');
      }

      if (data.floorId && area.floorId !== data.floorId) {
        throw new BadRequestError('Invalid area for this floor');
      }
    }

    // Create time entry
    const timeEntry = await prisma.timeEntry.create({
      data: {
        userId,
        jobSiteId: data.jobSiteId,
        floorId: data.floorId || null,
        areaId: data.areaId || null,
        clockIn: new Date(),
        notes: data.notes,
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
    });

    // Update job site active status (set to active since someone just clocked in)
    await jobSiteService.updateActiveStatus(data.jobSiteId);

    return timeEntry;
  }

  /**
   * Clock out a painter
   */
  static async clockOut(userId: string, data?: ClockOutDto): Promise<TimeEntryWithDetails> {
    // Find active time entry
    const timeEntry = await prisma.timeEntry.findFirst({
      where: {
        userId,
        clockOut: null,
      },
    });

    if (!timeEntry) {
      throw new BadRequestError('You are not currently clocked in');
    }

    const clockOut = new Date();
    const clockIn = new Date(timeEntry.clockIn);
    const totalHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);

    // Update time entry
    const updated = await prisma.timeEntry.update({
      where: { id: timeEntry.id },
      data: {
        clockOut,
        totalHours: Math.round(totalHours * 100) / 100, // Round to 2 decimals
        notes: data?.notes ? `${timeEntry.notes || ''}\n${data.notes}`.trim() : timeEntry.notes,
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
    });

    // Update job site active status (check if any other painters are still clocked in)
    await jobSiteService.updateActiveStatus(timeEntry.jobSiteId);

    return updated;
  }

  /**
   * Get current active time entry for a user
   */
  static async getCurrentTimeEntry(userId: string): Promise<TimeEntryWithDetails | null> {
    const timeEntry = await prisma.timeEntry.findFirst({
      where: {
        userId,
        clockOut: null,
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
    });

    return timeEntry;
  }

  /**
   * Get time entries for a user within a date range
   */
  static async getTimeEntriesForUser(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<TimeEntryWithDetails[]> {
    // Default to current week if no dates provided
    const start = startDate || this.getStartOfWeek();
    const end = endDate || new Date();

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        userId,
        clockIn: {
          gte: start,
          lte: end,
        },
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
      orderBy: { clockIn: 'desc' },
    });

    return timeEntries;
  }

  /**
   * Get time entries for a job site
   */
  static async getTimeEntriesForSite(
    siteId: string,
    date?: Date,
    userId?: string,
    userRole?: UserRole
  ): Promise<TimeEntryWithDetails[]> {
    // Check permissions
    if (userRole === 'EMPLOYEE') {
      throw new UnauthorizedError('Employees cannot view site time entries');
    }

    if (userRole === 'SUPERVISOR') {
      const site = await prisma.jobSite.findUnique({
        where: { id: siteId },
      });

      if (!site) {
        throw new NotFoundError('Job site not found');
      }

      if (site.supervisorId !== userId) {
        throw new UnauthorizedError('You can only view time entries for sites you supervise');
      }
    }

    // Default to today if no date provided
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        jobSiteId: siteId,
        clockIn: {
          gte: startOfDay,
          lte: endOfDay,
        },
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
      orderBy: { clockIn: 'desc' },
    });

    return timeEntries;
  }

  /**
   * Get total hours worked today for a user
   */
  static async getTodayHours(userId: string): Promise<TodayHoursResponse> {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const timeEntries = await prisma.timeEntry.findMany({
      where: {
        userId,
        clockIn: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        jobSite: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const completedEntries = timeEntries.filter((e) => e.clockOut !== null);
    const activeEntry = timeEntries.find((e) => e.clockOut === null);

    let totalHours = 0;

    // Sum completed entries
    for (const entry of completedEntries) {
      totalHours += entry.totalHours || 0;
    }

    // Add current ongoing hours if clocked in
    if (activeEntry) {
      const now = new Date();
      const clockIn = new Date(activeEntry.clockIn);
      const currentHours = (now.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
      totalHours += currentHours;
    }

    return {
      userId,
      date: startOfDay.toISOString().split('T')[0],
      totalHours: Math.round(totalHours * 100) / 100,
      completedEntries: completedEntries.length,
      isCurrentlyClockedIn: !!activeEntry,
      activeEntry: activeEntry
        ? {
            id: activeEntry.id,
            clockIn: activeEntry.clockIn,
            currentHours:
              Math.round(
                ((new Date().getTime() - new Date(activeEntry.clockIn).getTime()) /
                  (1000 * 60 * 60)) *
                  100
              ) / 100,
            jobSite: activeEntry.jobSite,
          }
        : null,
    };
  }

  /**
   * Get all currently clocked-in workers
   */
  static async getActiveWorkers(siteId?: string): Promise<ActiveWorker[]> {
    const activeEntries = await prisma.timeEntry.findMany({
      where: {
        clockOut: null,
        ...(siteId && { jobSiteId: siteId }),
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
        jobSite: {
          select: {
            id: true,
            name: true,
          },
        },
        floor: {
          select: {
            id: true,
            name: true,
          },
        },
        area: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { clockIn: 'desc' },
    });

    return activeEntries.map((entry) => {
      const now = new Date();
      const clockIn = new Date(entry.clockIn);
      const currentHours = (now.getTime() - clockIn.getTime()) / (1000 * 60 * 60);

      return {
        timeEntryId: entry.id,
        userId: entry.user.id,
        firstName: entry.user.firstName,
        lastName: entry.user.lastName,
        email: entry.user.email,
        jobSiteId: entry.jobSite.id,
        jobSiteName: entry.jobSite.name,
        floorId: entry.floorId,
        floorName: entry.floor?.name || null,
        areaId: entry.areaId,
        areaName: entry.area?.name || null,
        clockIn: entry.clockIn,
        currentHours: Math.round(currentHours * 100) / 100,
      };
    });
  }

  /**
   * Get time entries with flexible filtering
   * Supports filtering by userId, siteId, and date range
   */
  static async getTimeEntries(filters: {
    userId?: string;
    siteId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<TimeEntryWithDetails[]> {
    const { userId, siteId, startDate, endDate } = filters;

    // Build where clause dynamically
    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (siteId) {
      where.jobSiteId = siteId;
    }

    if (startDate || endDate) {
      where.clockIn = {};
      if (startDate) {
        where.clockIn.gte = startDate;
      }
      if (endDate) {
        where.clockIn.lte = endDate;
      }
    }

    const timeEntries = await prisma.timeEntry.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
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
      orderBy: { clockIn: 'desc' },
    });

    return timeEntries;
  }

  /**
   * Helper: Get start of current week (Monday)
   */
  private static getStartOfWeek(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }
}
