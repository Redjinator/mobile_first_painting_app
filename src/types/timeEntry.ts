import { TimeEntry, User, JobSite, Floor, Area } from '@prisma/client';

// DTOs for clock in/out
export interface ClockInDto {
  jobSiteId: string;
  floorId?: string | null;
  areaId?: string | null;
  notes?: string;
}

export interface ClockOutDto {
  notes?: string;
}

// Extended types for API responses
export interface TimeEntryWithDetails extends TimeEntry {
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  jobSite: Pick<JobSite, 'id' | 'name' | 'address'>;
  floor?: Pick<Floor, 'id' | 'name' | 'floorNumber'> | null;
  area?: Pick<Area, 'id' | 'name' | 'areaType'> | null;
}

export interface ActiveWorker {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  jobSiteId: string;
  jobSiteName: string;
  floorId?: string | null;
  floorName?: string | null;
  areaId?: string | null;
  areaName?: string | null;
  clockIn: Date;
  currentHours: number;
}

export interface TodayHoursResponse {
  userId: string;
  date: string;
  totalHours: number;
  completedEntries: number;
  isCurrentlyClockedIn: boolean;
  activeEntry?: {
    id: string;
    clockIn: Date;
    currentHours: number;
    jobSite: {
      id: string;
      name: string;
    };
  } | null;
}
