import { NextRequest } from 'next/server';
import { jobSiteService } from '@/services/jobSiteService';
import { handleApiError } from '@/lib/api/errors';
import { successResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth';

/**
 * GET /api/job-sites/[id]/hierarchy
 * Get complete job site hierarchy with all nested data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const hierarchy = await jobSiteService.getJobSiteHierarchy(
      id,
      user.id,
      user.role
    );

    return successResponse(hierarchy);
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}
