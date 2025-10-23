import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AssignmentService } from '@/services/assignmentService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate } from '@/lib/api/validation';
import { assignToFloorSchema } from '@/lib/validations/assignment';

/**
 * POST /api/floors/[id]/assignments
 * Assign painter to specific floor
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: floorId } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = validate(assignToFloorSchema, body);

    const assignment = await AssignmentService.assignPainterToFloor(
      data.userId,
      floorId,
      session.user.id
    );

    return successResponse(assignment, 'Painter assigned to floor successfully', 201);
  } catch (error) {
    return errorHandler(error);
  }
}
