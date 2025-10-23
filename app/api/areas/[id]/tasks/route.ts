import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { NotFoundError } from '@/lib/api/errors';

/**
 * GET /api/areas/[id]/tasks
 * Get all tasks for an area
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

    // Get all tasks for the area
    const tasks = await prisma.task.findMany({
      where: { areaId: id },
      orderBy: { taskOrder: 'asc' },
    });

    return successResponse(tasks);
  } catch (error) {
    return errorHandler(error);
  }
}
