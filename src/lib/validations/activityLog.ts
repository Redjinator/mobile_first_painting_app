import { z } from 'zod';
import { EntityType, Action } from '@prisma/client';

/**
 * Schema for creating an activity log
 */
export const createActivityLogSchema = z.object({
  entityType: z.nativeEnum(EntityType),
  entityId: z.string().min(1, 'Entity ID is required'),
  action: z.nativeEnum(Action),
  changes: z.record(z.string(), z.any()).optional(),
});

/**
 * Schema for activity log filters
 */
export const activityLogFiltersSchema = z.object({
  entityType: z.nativeEnum(EntityType).optional(),
  entityId: z.string().optional(),
  userId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});
