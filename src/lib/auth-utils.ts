import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { User } from '@prisma/client';

/**
 * Verify a password against a bcrypt hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await compare(password, hash);
}

/**
 * Get a user from the database by email
 */
export async function getUserFromEmail(
  email: string
): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return user;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}

/**
 * Create session data from a user object
 */
export function createSession(user: User) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
}

/**
 * Authenticate a user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const user = await getUserFromEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.passwordHash);

  if (!isValid) {
    return null;
  }

  return user;
}
