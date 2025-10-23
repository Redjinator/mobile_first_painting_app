import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { NotFoundError } from '@/lib/api/errors';

/**
 * GET /api/floors/[id]/areas
 * Get all areas for a floor
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

    // Check if floor exists
    const floor = await prisma.floor.findUnique({
      where: { id },
    });

    if (!floor) {
      throw new NotFoundError('Floor not found');
    }

    // Get all areas for the floor
    const areas = await prisma.area.findMany({
      where: { floorId: id },
      include: {
        tasks: true,
        subAreas: true,
        assignments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return successResponse(areas);
  } catch (error) {
    return errorHandler(error);
  }
}
