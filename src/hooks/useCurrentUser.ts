'use client';

import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';

interface UseCurrentUserReturn {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
  } | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSupervisor: boolean;
  isEmployee: boolean;
}

/**
 * Custom hook to get the current user from the session
 * Returns user data along with helper flags for role checking
 */
export function useCurrentUser(): UseCurrentUserReturn {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const user = session?.user || null;
  const role = user?.role;

  return {
    user,
    isLoading,
    isAdmin: role === 'ADMIN',
    isSupervisor: role === 'SUPERVISOR',
    isEmployee: role === 'EMPLOYEE',
  };
}
