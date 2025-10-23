import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { FloorService } from '@/services/floorService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate } from '@/lib/api/validation';
import { bulkCreateFloorsSchema } from '@/lib/validations/floor';

/**
 * POST /api/floors
 * Create multiple floors at once (bulk create)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = validate(bulkCreateFloorsSchema, body);

    const floors = await FloorService.createFloorsBulk(
      data.jobSiteId,
      data.count,
      session.user.id
    );

    return successResponse(floors, `Successfully created ${floors.length} floors`, 201);
  } catch (error) {
    return errorHandler(error);
  }
}
