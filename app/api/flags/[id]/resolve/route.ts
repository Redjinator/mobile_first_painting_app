import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { FlagService } from '@/services/flagService';
import { errorHandler, successResponse } from '@/lib/api/utils';

/**
 * POST /api/flags/[id]/resolve
 * Resolve a flag
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const flag = await FlagService.resolveFlag(id, session.user.id);

    return successResponse(flag, 'Flag resolved successfully');
  } catch (error) {
    return errorHandler(error);
  }
}
