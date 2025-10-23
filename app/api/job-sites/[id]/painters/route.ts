import { NextRequest } from 'next/server';
import { jobSiteService } from '@/services/jobSiteService';
import { handleApiError } from '@/lib/api/errors';
import { successResponse } from '@/lib/api/response';
import { requireAuth } from '@/lib/api/auth';

/**
 * GET /api/job-sites/[id]/painters
 * Get all painters currently assigned to this site
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const painters = await jobSiteService.getActivePainters(params.id);

    return successResponse(painters);
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}
