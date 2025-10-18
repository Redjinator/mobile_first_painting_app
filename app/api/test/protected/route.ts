import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/api/response';
import { handleApiError } from '@/lib/api/errors';
import { requireAuth } from '@/lib/api/auth';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth();

    return successResponse({
      message: 'This is a protected endpoint',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return new Response(JSON.stringify(body), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
