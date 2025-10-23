import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AreaService } from '@/services/areaService';
import { prisma } from '@/lib/prisma';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate } from '@/lib/api/validation';
import { createSubAreaSchema } from '@/lib/validations/area';
import { NotFoundError } from '@/lib/api/errors';

/**
 * GET /api/areas/[id]/sub-areas
 * Get all sub-areas (closets) for an area
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

    // Check if area exists
    const area = await prisma.area.findUnique({
      where: { id },
    });

    if (!area) {
      throw new NotFoundError('Area not found');
    }

    // Get all sub-areas
    const subAreas = await prisma.area.findMany({
      where: { parentAreaId: id },
      include: {
        tasks: {
          orderBy: { taskOrder: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(subAreas);
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * POST /api/areas/[id]/sub-areas
 * Create a sub-area (closet) under this area
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

    const body = await req.json();
    const data = validate(createSubAreaSchema, body);

    const subArea = await AreaService.createSubArea(id, data, session.user.id);

    return successResponse(subArea, 'Closet created successfully with default tasks', 201);
  } catch (error) {
    return errorHandler(error);
  }
}
