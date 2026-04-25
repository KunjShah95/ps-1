import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js 16 Proxy / Middleware
 * 
 * In Next.js 16, this file should be named 'proxy.ts' and export a function named 'proxy'.
 * It handles cross-cutting concerns like authentication header validation and token forwarding.
 */

const PUBLIC_API_PREFIXES = [
  '/api/auth',
  '/api/health',
  '/api/docs',
];

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Non-API paths → pass through (handled by Next.js routing)
  if (!path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Public API endpoints
  if (PUBLIC_API_PREFIXES.some((p) => path.startsWith(p))) {
    return NextResponse.next();
  }

  // All other /api/* routes require an Authorization header
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace(/^Bearer\s+/i, '');

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Authorization required' },
      { status: 401 },
    );
  }

  // Forward the token via a custom header so route handlers can re-use it
  const response = NextResponse.next();
  response.headers.set('X-Auth-Token', token);
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
