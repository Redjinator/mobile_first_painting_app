import { Assignment, AssignableType, User, JobSite, Floor, Area } from '@prisma/client';

// DTOs for creating assignments
export interface CreateAssignmentDto {
  userId: string;
  assignableType: AssignableType;
  assignableId: string;
}

export interface BulkAssignDto {
  assignments: CreateAssignmentDto[];
}

// Extended types for API responses
export interface AssignmentWithDetails extends Assignment {
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'email' | 'phone'>;
  jobSite?: Pick<JobSite, 'id' | 'name' | 'address'> | null;
  floor?: Pick<Floor, 'id' | 'name' | 'floorNumber'> | null;
  area?: Pick<Area, 'id' | 'name' | 'areaType'> | null;
}

export interface AssignmentHierarchy {
  site: {
    id: string;
    name: string;
    address: string;
  };
  floors: {
    id: string;
    name: string;
    floorNumber: number;
    areas: {
      id: string;
      name: string;
      areaType: string;
      painters: {
        assignmentId: string;
        id: string;
        firstName: string;
        lastName: string;
      }[];
      tasks: {
        id: string;
        name: string;
        taskOrder: number;
        painters: {
          assignmentId: string;
          id: string;
          firstName: string;
          lastName: string;
        }[];
      }[];
    }[];
    painters: {
      assignmentId: string;
      id: string;
      firstName: string;
      lastName: string;
    }[];
  }[];
  sitePainters: {
    assignmentId: string;
    id: string;
    firstName: string;
    lastName: string;
  }[];
}
