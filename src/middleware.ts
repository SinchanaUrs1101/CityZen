import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './lib/session';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // Public pages that should be accessible without authentication
  const publicPaths = ['/', '/report-issue', '/issues'];

  if (isAuthPage) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Allow public paths (exact or prefix match) without a session
  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  if (!session) {
    // Let the root page handle the initial redirect to avoid loops
    if (pathname === '/') {
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
