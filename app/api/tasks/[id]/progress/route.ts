import { NextRequest } from 'next/server';
import { TaskService } from '@/services/taskService';
import { requireAuth } from '@/lib/api/auth';
import { successResponse } from '@/lib/api/utils';
import { handleApiError } from '@/lib/api/errors';
import { validate } from '@/lib/api/validation';
import { updateTaskProgressSchema } from '@/lib/validations/task';

/**
 * PATCH /api/tasks/[id]/progress
 * Update task completion percentage
 * Main endpoint for painters to update their task progress
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await request.json();

    const data = validate(updateTaskProgressSchema, body);

    const result = await TaskService.updateTaskProgress(
      id,
      data,
      user.id,
      user.role
    );

    return successResponse(
      result,
      'Task progress updated successfully. All parent progress recalculated.'
    );
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}
