import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AssignmentService } from '@/services/assignmentService';
import { errorHandler, successResponse } from '@/lib/api/utils';

/**
 * DELETE /api/assignments/[id]
 * Remove an assignment
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await AssignmentService.removeAssignment(
      id,
      session.user.id,
      session.user.role
    );

    return successResponse(result, result.message);
  } catch (error) {
    return errorHandler(error);
  }
}
