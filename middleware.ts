import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Allow access to auth routes and public routes
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/unauthorized') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isAdminRoute = pathname.startsWith('/admin');
  const isEmployeeRoute = pathname.startsWith('/employee');
  const isProtectedRoute = isAdminRoute || isEmployeeRoute;

  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check role-based access
  if (session?.user) {
    const userRole = session.user.role;

    // Admin routes: only ADMIN and SUPERVISOR can access
    if (isAdminRoute && !['ADMIN', 'SUPERVISOR'].includes(userRole)) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    // Employee routes: EMPLOYEE can only access employee routes
    if (userRole === 'EMPLOYEE' && isAdminRoute) {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
