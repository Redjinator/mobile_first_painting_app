import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { FloorService } from '@/services/floorService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate } from '@/lib/api/validation';
import { createFloorSchema } from '@/lib/validations/floor';

/**
 * GET /api/job-sites/[id]/floors
 * Get all floors for a job site
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

    const floors = await FloorService.getAllFloors(
      id,
      session.user.id,
      session.user.role
    );

    return successResponse(floors);
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * POST /api/job-sites/[id]/floors
 * Create a new floor for a job site
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
    const data = validate(createFloorSchema, body);

    const floor = await FloorService.createFloor(id, data, session.user.id);

    return successResponse(floor, 'Floor created successfully', 201);
  } catch (error) {
    return errorHandler(error);
  }
}
