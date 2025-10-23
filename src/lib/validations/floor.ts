import { z } from 'zod';

export const createFloorSchema = z.object({
  name: z.string().min(1, 'Floor name is required').max(100),
  floorNumber: z.number().int().min(0, 'Floor number must be 0 or greater'),
  notes: z.string().max(500).optional(),
});

export const updateFloorSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  floorNumber: z.number().int().min(0).optional(),
  notes: z.string().max(500).optional(),
  completionPercentage: z.number().min(0).max(100).optional(),
});

export const bulkCreateFloorsSchema = z.object({
  jobSiteId: z.string().uuid('Invalid job site ID'),
  count: z.number().int().min(1, 'Count must be at least 1').max(50, 'Cannot create more than 50 floors at once'),
});
