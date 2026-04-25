import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware — API route protection
 *
 * Public routes (no token required):
 *   /api/auth     — login / register
 *   /api/health   — uptime check
 *   /api/docs     — OpenAPI docs (future)
 *
 * Protected routes require Authorization: Bearer <token>
 *
 * NOTE: Middleware runs in the Edge runtime, so it MUST NOT use the Firebase Admin SDK.
 * Token verification + role checks happen inside each route handler via `requireFirebaseUser()`.
 * Middleware only ensures the header is present to reduce accidental unauthenticated calls.
 */

const PUBLIC_API_PREFIXES = [
  '/api/auth',
  '/api/health',
  '/api/docs',
];

export function middleware(request: NextRequest) {
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

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};