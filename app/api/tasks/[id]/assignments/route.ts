import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AssignmentService } from '@/services/assignmentService';
import { errorHandler, successResponse } from '@/lib/api/utils';

/**
 * POST /api/tasks/[id]/assignments
 * Assign a painter to a specific task
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: taskId } = await params;
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role === 'EMPLOYEE') {
      return NextResponse.json(
        { error: 'Only admins and supervisors can assign painters' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const assignment = await AssignmentService.assignPainterToTask(
      userId,
      taskId,
      session.user.id
    );

    return successResponse(assignment, 'Painter assigned to task successfully', 201);
  } catch (error) {
    return errorHandler(error);
  }
}
