import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/sign-up'];

  // Check if the current path is a public path
  const isPublicPath = publicPaths.some(path =>
    request.nextUrl.pathname === path ||
    request.nextUrl.pathname.startsWith(path + '/')
  );

  // If it's a public path, allow access without redirect
  if (isPublicPath) {
    return NextResponse.next();
  }

  // For API auth routes, allow them to pass through without redirect
  if (request.nextUrl.pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // For all other paths, allow them to continue
  // (authentication will be handled client-side in the components)
  return NextResponse.next();
}

// Configure which paths the middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};