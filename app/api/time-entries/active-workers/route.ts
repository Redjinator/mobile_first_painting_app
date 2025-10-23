import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { TimeEntryService } from '@/services/timeEntryService';
import { errorHandler, successResponse } from '@/lib/api/utils';

/**
 * GET /api/time-entries/active-workers
 * Get all currently clocked-in painters
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get('siteId') || undefined;

    const activeWorkers = await TimeEntryService.getActiveWorkers(siteId);

    return successResponse(activeWorkers);
  } catch (error) {
    return errorHandler(error);
  }
}
