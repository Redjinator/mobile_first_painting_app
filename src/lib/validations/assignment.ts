import { z } from 'zod';
import { AssignableType } from '@prisma/client';

export const createAssignmentSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  assignableType: z.nativeEnum(AssignableType),
  assignableId: z.string().uuid('Invalid assignable ID'),
});

export const assignToSiteSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export const assignToFloorSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export const assignToAreaSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export const bulkAssignSchema = z.object({
  assignments: z
    .array(createAssignmentSchema)
    .min(1, 'At least one assignment is required')
    .max(50, 'Cannot create more than 50 assignments at once'),
});
