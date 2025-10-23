import { Flag, FlagType, FlagStatus, FlaggableType } from '@prisma/client';

/**
 * Flag with user details
 */
export interface FlagWithDetails extends Flag {
  createdByUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  resolvedByUser?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

/**
 * DTO for creating a flag
 */
export interface CreateFlagDto {
  flaggableType: FlaggableType;
  flaggableId: string;
  type: FlagType;
  description: string;
}

/**
 * DTO for updating a flag
 */
export interface UpdateFlagDto {
  type?: FlagType;
  description?: string;
  status?: FlagStatus;
}

/**
 * Filters for querying flags
 */
export interface FlagFilters {
  flaggableType?: FlaggableType;
  flaggableId?: string;
  type?: FlagType;
  status?: FlagStatus;
  createdBy?: string;
}
