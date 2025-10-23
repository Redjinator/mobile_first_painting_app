import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ActivityLogService } from '@/services/activityLogService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validateQuery } from '@/lib/api/validation';
import { activityLogFiltersSchema } from '@/lib/validations/activityLog';

/**
 * GET /api/activity-logs
 * Get activity logs with filters
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filters = validateQuery(activityLogFiltersSchema, {
      entityType: searchParams.get('entityType'),
      entityId: searchParams.get('entityId'),
      userId: searchParams.get('userId'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      limit: searchParams.get('limit'),
    });

    // Convert date strings to Date objects
    const parsedFilters = {
      ...filters,
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
    };

    const logs = await ActivityLogService.getActivityLogs(
      parsedFilters,
      session.user.id,
      session.user.role
    );

    return successResponse(logs);
  } catch (error) {
    return errorHandler(error);
  }
}
