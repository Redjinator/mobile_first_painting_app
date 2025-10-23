import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { FloorService } from '@/services/floorService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate } from '@/lib/api/validation';
import { updateFloorSchema } from '@/lib/validations/floor';

/**
 * GET /api/floors/[id]
 * Get a single floor with areas
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

    const floor = await FloorService.getFloorById(
      id,
      session.user.id,
      session.user.role
    );

    return successResponse(floor);
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * PATCH /api/floors/[id]
 * Update a floor
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
    const data = validate(updateFloorSchema, body);

    const floor = await FloorService.updateFloor(
      id,
      data,
      session.user.id,
      session.user.role
    );

    return successResponse(floor, 'Floor updated successfully');
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * DELETE /api/floors/[id]
 * Delete a floor
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

    const result = await FloorService.deleteFloor(id, session.user.id, session.user.role);

    return successResponse(result, result.message);
  } catch (error) {
    return errorHandler(error);
  }
}
