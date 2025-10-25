import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { handleApiError } from '@/lib/api/errors';
import { successResponse } from '@/lib/api/utils';

/**
 * GET /api/users
 * Get all users (admin only)
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: [{ role: 'asc' }, { firstName: 'asc' }],
    });

    return successResponse(users, 'Users retrieved successfully');
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}

/**
 * POST /api/users
 * Create a new user (admin only)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { email, firstName, lastName, password, role } = body;

    // Validate required fields
    if (!email || !firstName || !lastName || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        passwordHash: hashedPassword,
        role,
        isActive: true,
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

    return successResponse(user, 'User created successfully', 201);
  } catch (error) {
    const { statusCode, body } = handleApiError(error);
    return Response.json(body, { status: statusCode });
  }
}
