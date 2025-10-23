import { z } from 'zod';

/**
 * Validation schema for creating a job site
 */
export const createJobSiteSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  address: z.string().min(1, 'Address is required').max(500, 'Address must be less than 500 characters'),
  supervisorId: z.string().cuid('Invalid supervisor ID'),
  startDate: z.coerce.date().optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
});

/**
 * Validation schema for updating a job site
 */
export const updateJobSiteSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters').optional(),
  address: z.string().min(1, 'Address is required').max(500, 'Address must be less than 500 characters').optional(),
  supervisorId: z.string().cuid('Invalid supervisor ID').optional(),
  startDate: z.coerce.date().optional(),
  completionPercentage: z.number().int().min(0).max(100).optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional().nullable(),
  isActive: z.boolean().optional(),
});

/**
 * Validation schema for job site query filters
 */
export const jobSiteFiltersSchema = z.object({
  search: z.string().optional(),
  supervisorId: z.string().cuid().optional(),
  isActive: z.coerce.boolean().optional(),
  startDateFrom: z.coerce.date().optional(),
  startDateTo: z.coerce.date().optional(),
  minCompletion: z.coerce.number().int().min(0).max(100).optional(),
  maxCompletion: z.coerce.number().int().min(0).max(100).optional(),
});

/**
 * Type exports
 */
export type CreateJobSiteInput = z.infer<typeof createJobSiteSchema>;
export type UpdateJobSiteInput = z.infer<typeof updateJobSiteSchema>;
export type JobSiteFiltersInput = z.infer<typeof jobSiteFiltersSchema>;
