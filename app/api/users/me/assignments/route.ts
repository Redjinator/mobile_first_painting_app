import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AssignmentService } from '@/services/assignmentService';
import { handleApiError } from '@/lib/api/errors';
import { successResponse } from '@/lib/api/utils';

/**
 * GET /api/users/me/assignments
 * Get assignments for the currently logged-in user
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignments = await AssignmentService.getAssignmentsForUser(session.user.id);

    return successResponse(assignments, 'Assignments retrieved successfully');
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}
