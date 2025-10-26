import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api/auth';
import { successResponse } from '@/lib/api/utils';
import { handleApiError } from '@/lib/api/errors';
import { ProgressService } from '@/services/progressService';
import { UserRole } from '@prisma/client';

/**
 * POST /api/admin/recalculate-progress
 * Recalculate all progress values across the entire system
 * Admin only
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();

    // Admin only
    if (user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Only administrators can recalculate progress' },
        { status: 403 }
      );
    }

    const result = await ProgressService.recalculateAllProgress();

    return successResponse(
      result,
      'Progress recalculated successfully for all job sites'
    );
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}
