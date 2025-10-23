import { z } from 'zod';
import { AreaType } from '@prisma/client';

export const createAreaSchema = z.object({
  name: z.string().min(1, 'Area name is required').max(100),
  areaType: z.nativeEnum(AreaType),
  notes: z.string().max(500).optional(),
});

export const updateAreaSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  notes: z.string().max(500).optional(),
  completionPercentage: z.number().min(0).max(100).optional(),
});

export const bulkCreateAreasSchema = z.object({
  floorId: z.string().uuid('Invalid floor ID'),
  areas: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
        areaType: z.nativeEnum(AreaType),
        notes: z.string().max(500).optional(),
      })
    )
    .min(1, 'At least one area is required')
    .max(50, 'Cannot create more than 50 areas at once'),
});

export const createSubAreaSchema = z.object({
  name: z.string().min(1, 'Sub-area name is required').max(100),
  notes: z.string().max(500).optional(),
});
