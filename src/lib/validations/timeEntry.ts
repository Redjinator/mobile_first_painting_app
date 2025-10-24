import { z } from 'zod';

export const clockInSchema = z.object({
  jobSiteId: z.string().cuid('Invalid job site ID'),
  floorId: z.string().cuid('Invalid floor ID').optional().nullable(),
  areaId: z.string().cuid('Invalid area ID').optional().nullable(),
  notes: z.string().max(500).optional(),
});

export const clockOutSchema = z.object({
  notes: z.string().max(500).optional(),
});

export const timeEntryFiltersSchema = z.object({
  userId: z.string().cuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  siteId: z.string().cuid().optional(),
});
