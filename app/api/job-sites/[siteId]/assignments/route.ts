import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AssignmentService } from '@/services/assignmentService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate } from '@/lib/api/validation';
import { assignToSiteSchema } from '@/lib/validations/assignment';

/**
 * GET /api/job-sites/[siteId]/assignments
 * Get all assignments for a job site (hierarchical)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignments = await AssignmentService.getAssignmentsForSite(
      siteId,
      session.user.id,
      session.user.role
    );

    return successResponse(assignments);
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * POST /api/job-sites/[siteId]/assignments
 * Assign painter to entire job site
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = validate(assignToSiteSchema, body);

    const assignment = await AssignmentService.assignPainterToSite(
      data.userId,
      siteId,
      session.user.id
    );

    return successResponse(assignment, 'Painter assigned to site successfully', 201);
  } catch (error) {
    return errorHandler(error);
  }
}
