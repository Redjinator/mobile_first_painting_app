import { ActivityLog, EntityType, Action } from '@prisma/client';

/**
 * Activity log entry with user details
 */
export interface ActivityLogEntry extends ActivityLog {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

/**
 * DTO for creating an activity log
 */
export interface CreateActivityLogDto {
  entityType: EntityType;
  entityId: string;
  action: Action;
  changes?: Record<string, any>;
}

/**
 * Filters for querying activity logs
 */
export interface ActivityLogFilters {
  entityType?: EntityType;
  entityId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}
