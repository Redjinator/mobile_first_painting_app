import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { TimeEntryService } from '@/services/timeEntryService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate } from '@/lib/api/validation';
import { clockOutSchema } from '@/lib/validations/timeEntry';

/**
 * POST /api/time-entries/clock-out
 * Clock out a painter
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = validate(clockOutSchema, body);

    const timeEntry = await TimeEntryService.clockOut(session.user.id, data);

    return successResponse(timeEntry, 'Clocked out successfully');
  } catch (error) {
    return errorHandler(error);
  }
}
