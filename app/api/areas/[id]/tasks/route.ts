import { NextRequest } from 'next/server';
import { TaskService } from '@/services/taskService';
import { requireAuth } from '@/lib/api/auth';
import { successResponse } from '@/lib/api/utils';
import { handleApiError } from '@/lib/api/errors';
import { validate } from '@/lib/api/validation';
import { createCustomTaskSchema } from '@/lib/validations/task';

/**
 * GET /api/areas/[id]/tasks
 * Get all tasks for an area
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: areaId } = await params;

    const tasks = await TaskService.getAllTasks(
      areaId,
      user.id,
      user.role
    );

    return successResponse(tasks);
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}

/**
 * POST /api/areas/[id]/tasks
 * Create a custom task for an area
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id: areaId } = await params;
    const body = await request.json();

    const data = validate(createCustomTaskSchema, body);

    const task = await TaskService.createCustomTask(
      areaId,
      data,
      user.id,
      user.role
    );

    return successResponse(task, 'Custom task created successfully', 201);
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}
