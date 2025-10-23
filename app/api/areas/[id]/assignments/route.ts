import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AssignmentService } from '@/services/assignmentService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate } from '@/lib/api/validation';
import { assignToAreaSchema } from '@/lib/validations/assignment';

/**
 * POST /api/areas/[id]/assignments
 * Assign painter to specific area
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: areaId } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = validate(assignToAreaSchema, body);

    const assignment = await AssignmentService.assignPainterToArea(
      data.userId,
      areaId,
      session.user.id
    );

    return successResponse(assignment, 'Painter assigned to area successfully', 201);
  } catch (error) {
    return errorHandler(error);
  }
}
