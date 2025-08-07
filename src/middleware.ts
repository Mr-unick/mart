
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the login page itself)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).+)',
    '/'
  ],
};

export async function middleware(req: NextRequest) {
  const { user } = await verifyAuth();
  const { pathname } = req.nextUrl;

  // If user is authenticated and is trying to access the login page, redirect them
  if (user && pathname === '/') {
    const redirectTo = user.role.name === 'Super Admin' ? '/super-admin/tenants' : '/products';
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  // If user is not authenticated and is trying to access a protected page, redirect to login
  if (!user && pathname !== '/') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}
