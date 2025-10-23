import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AreaService } from '@/services/areaService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate } from '@/lib/api/validation';
import { createAreaSchema } from '@/lib/validations/area';

/**
 * GET /api/floors/[floorId]/areas
 * Get all areas for a floor (hierarchical structure)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ floorId: string }> }
) {
  try {
    const { floorId } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const areas = await AreaService.getAllAreas(
      floorId,
      session.user.id,
      session.user.role
    );

    return successResponse(areas);
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * POST /api/floors/[floorId]/areas
 * Create a new area for a floor (auto-creates default tasks)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ floorId: string }> }
) {
  try {
    const { floorId } = await params;
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = validate(createAreaSchema, body);

    const area = await AreaService.createArea(floorId, data, session.user.id);

    return successResponse(area, 'Area created successfully with default tasks', 201);
  } catch (error) {
    return errorHandler(error);
  }
}
