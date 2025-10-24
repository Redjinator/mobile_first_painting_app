import { get, post } from './client';

/**
 * Employee API Client
 */

export interface Assignment {
  id: string;
  userId: string;
  assignableType: 'JOB_SITE' | 'FLOOR' | 'AREA';
  assignableId: string;
  createdAt: Date;
  jobSite?: {
    id: string;
    name: string;
    address: string;
    completionPercentage: number;
  };
  floor?: {
    id: string;
    name: string;
    completionPercentage: number;
  };
  area?: {
    id: string;
    name: string;
    completionPercentage: number;
  };
}

export interface TimeEntry {
  id: string;
  userId: string;
  jobSiteId: string;
  floorId: string | null;
  areaId: string | null;
  clockIn: Date;
  clockOut: Date | null;
  hoursWorked: number | null;
  jobSite: {
    id: string;
    name: string;
  };
  floor?: {
    id: string;
    name: string;
  } | null;
  area?: {
    id: string;
    name: string;
  } | null;
}

export interface ClockInDto {
  jobSiteId: string;
  floorId?: string;
  areaId?: string;
}

export interface TodayHours {
  userId: string;
  date: string;
  totalHours: number;
  completedEntries: number;
  isCurrentlyClockedIn: boolean;
}

/**
 * Get user's assignments
 */
export async function getUserAssignments(userId: string): Promise<Assignment[]> {
  return get<Assignment[]>(`/api/users/${userId}/assignments`);
}

/**
 * Get current active time entry
 */
export async function getCurrentTimeEntry(): Promise<TimeEntry | null> {
  return get<TimeEntry | null>('/api/time-entries/current');
}

/**
 * Clock in
 */
export async function clockIn(data: ClockInDto): Promise<TimeEntry> {
  return post<TimeEntry>('/api/time-entries/clock-in', data);
}

/**
 * Clock out
 */
export async function clockOut(): Promise<TimeEntry> {
  return post<TimeEntry>('/api/time-entries/clock-out');
}

/**
 * Get today's hours for user
 */
export async function getTodayHours(userId: string): Promise<TodayHours> {
  return get<TodayHours>(`/api/users/${userId}/today-hours`);
}
