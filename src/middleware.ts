
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function middleware(req: NextRequest) {
  const { user } = await verifyAuth();
  const { pathname } = req.nextUrl;

  const isPublicPage = pathname === '/';

  if (isPublicPage && user) {
    const redirectTo = user.role.name === 'Super Admin' ? '/super-admin/tenants' : '/products';
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  if (!isPublicPage && !user) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
