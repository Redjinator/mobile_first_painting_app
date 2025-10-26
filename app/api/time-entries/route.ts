import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { TimeEntryService } from '@/services/timeEntryService';
import { errorHandler, successResponse } from '@/lib/api/utils';

/**
 * GET /api/time-entries
 * Get time entries with optional filters (userId, siteId, startDate, endDate)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const siteId = searchParams.get('siteId');
    const startDate = searchParams.get('startDate')
      ? new Date(searchParams.get('startDate')!)
      : undefined;
    const endDate = searchParams.get('endDate')
      ? new Date(searchParams.get('endDate')!)
      : undefined;

    // Employees can only see their own entries
    if (session.user.role === 'EMPLOYEE' && userId && userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // If employee and no userId specified, default to their own
    const effectiveUserId = session.user.role === 'EMPLOYEE' ? session.user.id : (userId || undefined);

    const timeEntries = await TimeEntryService.getTimeEntries({
      userId: effectiveUserId,
      siteId: siteId || undefined,
      startDate,
      endDate,
    });

    return successResponse(timeEntries);
  } catch (error) {
    return errorHandler(error);
  }
}
