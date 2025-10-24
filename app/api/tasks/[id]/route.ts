import { NextRequest } from 'next/server';
import { TaskService } from '@/services/taskService';
import { requireAuth } from '@/lib/api/auth';
import { successResponse } from '@/lib/api/utils';
import { handleApiError } from '@/lib/api/errors';
import { validate } from '@/lib/api/validation';
import { updateTaskSchema } from '@/lib/validations/task';

/**
 * GET /api/tasks/[id]
 * Get task details with history
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const task = await TaskService.getTaskById(
      id,
      user.id,
      user.role
    );

    return successResponse(task);
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}

/**
 * PATCH /api/tasks/[id]
 * Update task details (name, notes, taskOrder)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const data = validate(updateTaskSchema, body);

    const task = await TaskService.updateTask(
      id,
      data,
      user.id,
      user.role
    );

    return successResponse(task, 'Task updated successfully');
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}

/**
 * DELETE /api/tasks/[id]
 * Delete task (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const result = await TaskService.deleteTask(
      id,
      user.id,
      user.role
    );

    return successResponse(result, 'Task deleted successfully');
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}
