import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AssignmentService } from '@/services/assignmentService';
import { errorHandler, successResponse } from '@/lib/api/utils';

/**
 * GET /api/users/[userId]/assignments
 * Get all assignments for a user (painter's view)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Employees can only see their own assignments
    if (session.user.role === 'EMPLOYEE' && session.user.id !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const assignments = await AssignmentService.getAssignmentsForUser(userId);

    return successResponse(assignments);
  } catch (error) {
    return errorHandler(error);
  }
}
