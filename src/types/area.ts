import { Area, Task, Assignment, AreaType } from '@prisma/client';

// DTOs for creating and updating areas
export interface CreateAreaDto {
  name: string;
  areaType: AreaType;
  notes?: string;
}

export interface UpdateAreaDto {
  name?: string;
  notes?: string;
  completionPercentage?: number;
}

export interface BulkCreateAreasDto {
  floorId: string;
  areas: {
    name: string;
    areaType: AreaType;
    notes?: string;
  }[];
}

// Extended types for API responses
export interface AreaWithTasks extends Area {
  tasks: Task[];
  subAreas: Area[];
  assignments: Assignment[];
}

export interface AreaHierarchy extends Area {
  tasks: Task[];
  subAreas: AreaHierarchy[];
  assignments: (Assignment & {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  })[];
}

export interface AreaSummary extends Area {
  taskCount: number;
  assignedPainterCount: number;
}
