import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { TimeEntryService } from '@/services/timeEntryService';
import { errorHandler, successResponse } from '@/lib/api/utils';

/**
 * GET /api/time-entries/current
 * Get current active time entry for logged-in user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const timeEntry = await TimeEntryService.getCurrentTimeEntry(session.user.id);

    return successResponse(timeEntry);
  } catch (error) {
    return errorHandler(error);
  }
}
