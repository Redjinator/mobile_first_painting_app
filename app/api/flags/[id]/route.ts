import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { FlagService } from '@/services/flagService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate } from '@/lib/api/validation';
import { updateFlagSchema } from '@/lib/validations/flag';

/**
 * GET /api/flags/[id]
 * Get a single flag
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const flag = await FlagService.getFlagById(id);

    return successResponse(flag);
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * PATCH /api/flags/[id]
 * Update a flag
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = validate(updateFlagSchema, body);

    const flag = await FlagService.updateFlag(
      id,
      data,
      session.user.id,
      session.user.role
    );

    return successResponse(flag, 'Flag updated successfully');
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * DELETE /api/flags/[id]
 * Delete a flag (admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await FlagService.deleteFlag(id, session.user.id, session.user.role);

    return successResponse(null, 'Flag deleted successfully');
  } catch (error) {
    return errorHandler(error);
  }
}
