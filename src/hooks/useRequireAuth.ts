'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from './useCurrentUser';
import { UserRole } from '@prisma/client';

interface UseRequireAuthOptions {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

/**
 * Hook to protect pages and redirect if not authenticated or not authorized
 * @param options - Configuration options
 * @param options.requiredRole - Role(s) required to access the page
 * @param options.redirectTo - Path to redirect to if not authorized (default: '/login')
 */
export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { requiredRole, redirectTo = '/login' } = options;
  const router = useRouter();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (isLoading) return;

    // Not authenticated
    if (!user) {
      router.push(redirectTo);
      return;
    }

    // Check role requirement
    if (requiredRole) {
      const allowedRoles = Array.isArray(requiredRole)
        ? requiredRole
        : [requiredRole];

      if (!allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [user, isLoading, requiredRole, redirectTo, router]);

  return { user, isLoading };
}
