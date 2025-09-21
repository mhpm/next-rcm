import { NextRequest, NextResponse } from 'next/server';
import { getChurchSlugFromHost, isValidChurchSlug } from '@/lib/database';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || 'localhost:3000';
  
  // Get church slug from the host
  const churchSlug = getChurchSlugFromHost(host);
  
  // Skip middleware for certain paths
  const skipPaths = [
    '/_next',
    '/api/health',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.json',
  ];
  
  if (skipPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // For localhost development, we'll use a default church or path-based routing
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) {
    // Check if there's a church parameter in the URL
    const url = new URL(request.url);
    const churchParam = url.searchParams.get('church');
    
    if (churchParam && isValidChurchSlug(churchParam)) {
      // Add church slug to headers for API routes to use
      const response = NextResponse.next();
      response.headers.set('x-church-slug', churchParam);
      return response;
    }
    
    // Default to 'demo' church for localhost
    const response = NextResponse.next();
    response.headers.set('x-church-slug', 'demo');
    return response;
  }
  
  // Validate church slug
  if (!isValidChurchSlug(churchSlug)) {
    // Redirect to error page or main landing page
    return NextResponse.redirect(new URL('/error?code=invalid-church', request.url));
  }
  
  // Add church slug to headers for API routes and pages to use
  const response = NextResponse.next();
  response.headers.set('x-church-slug', churchSlug);
  
  // Optional: Add church slug to cookies for client-side access
  response.cookies.set('church-slug', churchSlug, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};