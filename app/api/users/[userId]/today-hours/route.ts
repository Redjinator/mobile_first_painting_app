import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { TimeEntryService } from '@/services/timeEntryService';
import { errorHandler, successResponse } from '@/lib/api/utils';

/**
 * GET /api/users/[userId]/today-hours
 * Get total hours worked today for a user
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Employees can only see their own hours
    if (session.user.role === 'EMPLOYEE' && userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const todayHours = await TimeEntryService.getTodayHours(userId);

    return successResponse(todayHours);
  } catch (error) {
    return errorHandler(error);
  }
}
