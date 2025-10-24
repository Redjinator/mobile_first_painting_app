import { Task, Area, ActivityLog } from '@prisma/client';

// Task with related data
export interface TaskWithArea extends Task {
  area: Area;
}

export interface TaskWithHistory extends Task {
  area: {
    id: string;
    name: string;
    floor: {
      id: string;
      name: string;
      jobSite: {
        id: string;
        name: string;
      };
    };
  };
  activityLogs: ActivityLog[];
}

// DTOs for task operations
export interface UpdateTaskProgressDto {
  percentage: number;
  notes?: string;
}

export interface UpdateTaskDto {
  name?: string;
  notes?: string;
  taskOrder?: number;
}

export interface CreateCustomTaskDto {
  name: string;
  taskOrder: number;
  notes?: string;
}

// Response types
export interface TaskProgressUpdateResult {
  task: Task;
  areaProgress: number;
  floorProgress: number;
  siteProgress: number;
}
