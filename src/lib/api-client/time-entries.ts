import { get } from './client';
import type { TimeEntryWithDetails as TimeEntryWithDetailsType } from '@/types/timeEntry';

/**
 * Time Entries API Client
 */

export type TimeEntryWithDetails = TimeEntryWithDetailsType;

/**
 * Get time entries for a user within a date range
 */
export async function getTimeEntriesForUser(
  userId: string,
  startDate?: string,
  endDate?: string
): Promise<TimeEntryWithDetails[]> {
  const params = new URLSearchParams();
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const query = params.toString();
  return get<TimeEntryWithDetails[]>(
    `/api/time-entries${query ? `?${query}` : ''}`
  );
}

/**
 * Get time entries for a job site
 */
export async function getTimeEntriesForSite(
  siteId: string,
  date?: string
): Promise<TimeEntryWithDetails[]> {
  const params = new URLSearchParams();
  if (date) params.append('date', date);

  const query = params.toString();
  return get<TimeEntryWithDetails[]>(
    `/api/job-sites/${siteId}/time-entries${query ? `?${query}` : ''}`
  );
}

/**
 * Get active workers (currently clocked in)
 */
export async function getActiveWorkers(siteId?: string): Promise<any[]> {
  const params = new URLSearchParams();
  if (siteId) params.append('siteId', siteId);

  const query = params.toString();
  return get<any[]>(
    `/api/time-entries/active-workers${query ? `?${query}` : ''}`
  );
}
