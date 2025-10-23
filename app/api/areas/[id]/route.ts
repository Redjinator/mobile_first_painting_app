import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AreaService } from '@/services/areaService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate } from '@/lib/api/validation';
import { updateAreaSchema } from '@/lib/validations/area';

/**
 * GET /api/areas/[id]
 * Get area details with tasks
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

    const area = await AreaService.getAreaById(
      id,
      session.user.id,
      session.user.role
    );

    return successResponse(area);
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * PATCH /api/areas/[id]
 * Update an area
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
    const data = validate(updateAreaSchema, body);

    const area = await AreaService.updateArea(
      id,
      data,
      session.user.id,
      session.user.role
    );

    return successResponse(area, 'Area updated successfully');
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * DELETE /api/areas/[id]
 * Delete an area
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

    const result = await AreaService.deleteArea(id, session.user.id, session.user.role);

    return successResponse(result, result.message);
  } catch (error) {
    return errorHandler(error);
  }
}
