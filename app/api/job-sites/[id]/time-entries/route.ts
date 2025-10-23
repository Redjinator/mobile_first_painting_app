import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { TimeEntryService } from '@/services/timeEntryService';
import { errorHandler, successResponse } from '@/lib/api/utils';

/**
 * GET /api/job-sites/[id]/time-entries
 * Get time entries for a job site
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
    const date = searchParams.get('date') ? new Date(searchParams.get('date')!) : undefined;

    const timeEntries = await TimeEntryService.getTimeEntriesForSite(
      siteId,
      date,
      session.user.id,
      session.user.role
    );

    return successResponse(timeEntries);
  } catch (error) {
    return errorHandler(error);
  }
}
