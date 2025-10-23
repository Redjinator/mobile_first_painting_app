import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ActivityLogService } from '@/services/activityLogService';
import { errorHandler, successResponse } from '@/lib/api/utils';

/**
 * GET /api/job-sites/[id]/activity
 * Get recent activity for a job site
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: siteId } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    const logs = await ActivityLogService.getRecentActivity(
      siteId,
      limit,
      session.user.id,
      session.user.role
    );

    return successResponse(logs);
  } catch (error) {
    return errorHandler(error);
  }
}
