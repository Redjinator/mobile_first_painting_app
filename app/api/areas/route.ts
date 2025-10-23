import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { AreaService } from '@/services/areaService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate } from '@/lib/api/validation';
import { bulkCreateAreasSchema } from '@/lib/validations/area';

/**
 * POST /api/areas
 * Bulk create multiple areas at once
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = validate(bulkCreateAreasSchema, body);

    const areas = await AreaService.createAreasBulk(
      data.floorId,
      data.areas,
      session.user.id
    );

    return successResponse(
      areas,
      `Successfully created ${areas.length} areas with default tasks`,
      201
    );
  } catch (error) {
    return errorHandler(error);
  }
}
