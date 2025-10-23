import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AssignmentService } from '@/services/assignmentService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate } from '@/lib/api/validation';
import { bulkAssignSchema } from '@/lib/validations/assignment';

/**
 * POST /api/assignments/bulk
 * Bulk assign painters
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = validate(bulkAssignSchema, body);

    const assignments = await AssignmentService.bulkAssign(
      data.assignments,
      session.user.id
    );

    return successResponse(
      assignments,
      `Successfully created ${assignments.length} assignments`,
      201
    );
  } catch (error) {
    return errorHandler(error);
  }
}
