import { z } from 'zod';

export const clockInSchema = z.object({
  jobSiteId: z.string().uuid('Invalid job site ID'),
  floorId: z.string().uuid('Invalid floor ID').optional().nullable(),
  areaId: z.string().uuid('Invalid area ID').optional().nullable(),
  notes: z.string().max(500).optional(),
});

export const clockOutSchema = z.object({
  notes: z.string().max(500).optional(),
});

export const timeEntryFiltersSchema = z.object({
  userId: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  siteId: z.string().uuid().optional(),
});
