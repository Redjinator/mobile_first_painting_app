import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { FlagService } from '@/services/flagService';
import { errorHandler, successResponse } from '@/lib/api/utils';
import { validate, validateQuery } from '@/lib/api/validation';
import { createFlagSchema, flagFiltersSchema } from '@/lib/validations/flag';

/**
 * GET /api/flags
 * Get flags with filters
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filters = validateQuery(flagFiltersSchema, {
      flaggableType: searchParams.get('flaggableType'),
      flaggableId: searchParams.get('flaggableId'),
      type: searchParams.get('type'),
      status: searchParams.get('status'),
      createdBy: searchParams.get('createdBy'),
    });

    const flags = await FlagService.getFlags(
      filters,
      session.user.id,
      session.user.role
    );

    return successResponse(flags);
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * POST /api/flags
 * Create a new flag
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = validate(createFlagSchema, body);

    const flag = await FlagService.createFlag(data, session.user.id);

    return successResponse(flag, 'Flag created successfully', 201);
  } catch (error) {
    return errorHandler(error);
  }
}
