import { JobSite, Floor, User } from '@prisma/client';

/**
 * DTO for creating a new job site
 */
export interface CreateJobSiteDto {
  name: string;
  address: string;
  supervisorId: string;
  startDate?: Date;
  notes?: string;
}

/**
 * DTO for updating an existing job site
 */
export interface UpdateJobSiteDto {
  name?: string;
  address?: string;
  supervisorId?: string;
  startDate?: Date;
  completionPercentage?: number;
  notes?: string;
  isActive?: boolean;
}

/**
 * Filters for querying job sites
 */
export interface JobSiteFilters {
  supervisorId?: string;
  isActive?: boolean;
  search?: string; // Search in name or address
  startDateFrom?: Date;
  startDateTo?: Date;
  minCompletion?: number;
  maxCompletion?: number;
}

/**
 * Job site with related data
 */
export interface JobSiteWithRelations extends JobSite {
  supervisor: User;
  floors: Floor[];
}

/**
 * Job site with progress information
 */
export interface JobSiteWithProgress extends JobSite {
  supervisor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  floorCount: number;
  activeWorkerCount: number;
}

/**
 * Area data within floor hierarchy
 */
export interface AreaHierarchy {
  id: string;
  name: string;
  notes: string | null;
  areaType: string;
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
  tasks: TaskHierarchy[];
  assignedWorkerCount: number;
  flagCount: number;
}

/**
 * Task data within area hierarchy
 */
export interface TaskHierarchy {
  id: string;
  name: string;
  taskOrder: number;
  notes: string | null;
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Floor data within site hierarchy
 */
export interface FloorHierarchy {
  id: string;
  name: string;
  floorNumber: number;
  notes: string | null;
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
  areas: AreaHierarchy[];
  assignedWorkerCount: number;
  flagCount: number;
}

/**
 * Complete job site hierarchy structure
 */
export interface JobSiteHierarchy extends JobSite {
  supervisor: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  floors: FloorHierarchy[];
  totalWorkerCount: number;
  totalFlagCount: number;
}

/**
 * Active painter information
 */
export interface ActivePainter {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  currentFloor: string | null;
  currentArea: string | null;
  clockedInAt: Date;
  hoursWorkedToday: number;
}

/**
 * Job site progress calculation result
 */
export interface SiteProgressResult {
  siteId: string;
  completionPercentage: number;
  lastUpdated: Date;
}
