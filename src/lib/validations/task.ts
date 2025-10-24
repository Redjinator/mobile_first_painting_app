import { z } from 'zod';

// Validation: percentage must be 0-100 in increments of 5
const percentageSchema = z
  .number()
  .min(0, 'Percentage must be at least 0')
  .max(100, 'Percentage must be at most 100')
  .refine((val) => val % 5 === 0, {
    message: 'Percentage must be in increments of 5 (0, 5, 10, ..., 95, 100)',
  });

export const updateTaskProgressSchema = z.object({
  percentage: percentageSchema,
  notes: z.string().optional(),
});

export const updateTaskSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100).optional(),
  notes: z.string().max(500).optional(),
  taskOrder: z.number().int().positive().optional(),
});

export const createCustomTaskSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  taskOrder: z.number().int().positive(),
  notes: z.string().max(500).optional(),
});
