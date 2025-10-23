import { z } from 'zod';
import { FlagType, FlagStatus, FlaggableType } from '@prisma/client';

/**
 * Schema for creating a flag
 */
export const createFlagSchema = z.object({
  flaggableType: z.nativeEnum(FlaggableType),
  flaggableId: z.string().min(1, 'Flaggable ID is required'),
  type: z.nativeEnum(FlagType),
  description: z.string().min(1, 'Description is required').max(1000),
});

/**
 * Schema for updating a flag
 */
export const updateFlagSchema = z.object({
  type: z.nativeEnum(FlagType).optional(),
  description: z.string().min(1).max(1000).optional(),
  status: z.nativeEnum(FlagStatus).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

/**
 * Schema for flag filters
 */
export const flagFiltersSchema = z.object({
  flaggableType: z.nativeEnum(FlaggableType).optional(),
  flaggableId: z.string().optional(),
  type: z.nativeEnum(FlagType).optional(),
  status: z.nativeEnum(FlagStatus).optional(),
  createdBy: z.string().optional(),
});
