import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api/errors';
import { successResponse } from '@/lib/api/utils';

/**
 * PATCH /api/users/[userId]
 * Update user (admin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = await params;
    const body = await req.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.role && { role: body.role }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return successResponse(user, 'User updated successfully');
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}
