import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { FlagService } from '@/services/flagService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { FlagStatus, FlagType } from '@prisma/client';

/**
 * GET /api/job-sites/[id]/flags
 * Get flags for a job site
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
    const status = searchParams.get('status') as FlagStatus | null;
    const type = searchParams.get('type') as FlagType | null;

    const flags = await FlagService.getFlagsForSite(
      siteId,
      status || undefined,
      type || undefined,
      session.user.id,
      session.user.role
    );

    return successResponse(flags);
  } catch (error) {
    return errorHandler(error);
  }
}
