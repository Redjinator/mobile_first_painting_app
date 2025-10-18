import { auth } from '@/lib/auth';
import { UnauthorizedError, ForbiddenError } from './errors';
import type { UserRole } from '@prisma/client';

// Get authenticated user from session
export async function getAuthenticatedUser() {
  const session = await auth();

  if (!session || !session.user) {
    throw new UnauthorizedError('You must be logged in to access this resource');
  }

  return {
    id: session.user.id,
    email: session.user.email,
    firstName: session.user.firstName,
    lastName: session.user.lastName,
    role: session.user.role as UserRole,
  };
}

// Require authentication (throws if not authenticated)
export async function requireAuth() {
  return await getAuthenticatedUser();
}

// Require specific role
export async function requireRole(allowedRoles: UserRole | UserRole[]) {
  const user = await getAuthenticatedUser();

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(user.role)) {
    throw new ForbiddenError(
      `This action requires one of the following roles: ${roles.join(', ')}`
    );
  }

  return user;
}

// Require admin role
export async function requireAdmin() {
  return await requireRole('ADMIN');
}

// Require supervisor or admin role
export async function requireSupervisorOrAdmin() {
  return await requireRole(['ADMIN', 'SUPERVISOR']);
}

// Check if user is admin
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getAuthenticatedUser();
    return user.role === 'ADMIN';
  } catch {
    return false;
  }
}

// Check if user is supervisor or admin
export async function isSupervisorOrAdmin(): Promise<boolean> {
  try {
    const user = await getAuthenticatedUser();
    return user.role === 'ADMIN' || user.role === 'SUPERVISOR';
  } catch {
    return false;
  }
}

// Check if user has permission to access resource
export async function hasPermission(
  resourceOwnerId: string,
  allowedRoles: UserRole[] = ['ADMIN']
): Promise<boolean> {
  try {
    const user = await getAuthenticatedUser();

    // User owns the resource
    if (user.id === resourceOwnerId) {
      return true;
    }

    // User has one of the allowed roles
    if (allowedRoles.includes(user.role)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
