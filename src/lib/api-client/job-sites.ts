import { get, post, patch, del } from './client';
import type { JobSite } from '@prisma/client';

/**
 * Job Sites API Client
 */

export interface JobSiteWithProgress {
  id: string;
  name: string;
  address: string;
  notes: string | null;
  supervisorId: string | null;
  startDate: Date;
  completionPercentage: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  supervisor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  floorCount: number;
  activeWorkerCount: number;
}

export interface CreateJobSiteDto {
  name: string;
  address: string;
  supervisorId: string;
  startDate: string;
  estimatedEndDate?: string;
  notes?: string;
}

export interface UpdateJobSiteDto {
  name?: string;
  address?: string;
  supervisorId?: string;
  estimatedEndDate?: string;
  notes?: string;
  isActive?: boolean;
}

/**
 * Get all job sites
 */
export async function getAllJobSites(): Promise<JobSiteWithProgress[]> {
  return get<JobSiteWithProgress[]>('/api/job-sites');
}

/**
 * Get single job site by ID
 */
export async function getJobSiteById(id: string): Promise<JobSiteWithProgress> {
  return get<JobSiteWithProgress>(`/api/job-sites/${id}`);
}

/**
 * Create new job site
 */
export async function createJobSite(data: CreateJobSiteDto): Promise<JobSite> {
  return post<JobSite>('/api/job-sites', data);
}

/**
 * Update job site
 */
export async function updateJobSite(
  id: string,
  data: UpdateJobSiteDto
): Promise<JobSite> {
  return patch<JobSite>(`/api/job-sites/${id}`, data);
}

/**
 * Delete job site
 */
export async function deleteJobSite(id: string): Promise<{ success: boolean }> {
  return del<{ success: boolean }>(`/api/job-sites/${id}`);
}

export interface JobSiteWithHierarchy {
  id: string;
  name: string;
  address: string;
  completionPercentage: number;
  floors: {
    id: string;
    name: string;
    floorNumber: number;
    completionPercentage: number;
    areas: {
      id: string;
      name: string;
      areaType: string;
      completionPercentage: number;
      tasks: {
        id: string;
        description: string;
        taskType: string;
        completionPercentage: number;
      }[];
    }[];
  }[];
}

/**
 * Get job site hierarchy (with floors, areas, tasks)
 */
export async function getJobSiteHierarchy(id: string): Promise<JobSiteWithHierarchy> {
  return get<JobSiteWithHierarchy>(`/api/job-sites/${id}/hierarchy`);
}

/**
 * Get active painters at a job site
 */
export async function getActivePainters(id: string): Promise<any[]> {
  return get<any[]>(`/api/job-sites/${id}/painters`);
}
