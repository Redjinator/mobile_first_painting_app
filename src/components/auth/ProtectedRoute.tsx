'use client';

import { ReactNode } from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { UserRole } from '@prisma/client';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

/**
 * Component wrapper for protected content
 * Shows loading state while checking auth
 * Redirects if not authorized
 */
export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo,
  loadingComponent,
}: ProtectedRouteProps) {
  const { isLoading } = useRequireAuth({ requiredRole, redirectTo });

  if (isLoading) {
    return (
      <>
        {loadingComponent || (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
              <p className="mt-4 text-sm text-gray-600">Loading...</p>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
