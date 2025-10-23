import { Floor, Area } from '@prisma/client';

// DTOs for creating and updating floors
export interface CreateFloorDto {
  name: string;
  floorNumber: number;
  notes?: string;
}

export interface UpdateFloorDto {
  name?: string;
  floorNumber?: number;
  notes?: string;
  completionPercentage?: number;
}

export interface BulkCreateFloorsDto {
  jobSiteId: string;
  count: number;
}

// Extended types for API responses
export interface FloorWithAreas extends Floor {
  areas: Area[];
  areaCount: number;
}

export interface FloorSummary extends Floor {
  areaCount: number;
  taskCount: number;
}
