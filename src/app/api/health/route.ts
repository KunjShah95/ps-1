export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

/**
 * GET /api/health
 * Returns system health status. No auth required.
 */
export async function GET() {
  const memory = process.memoryUsage();

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    memory: {
      used_mb: Math.round(memory.heapUsed / 1024 / 1024),
      total_mb: Math.round(memory.heapTotal / 1024 / 1024),
    },
    services: {
      firebase: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      simulation: true,
    },
  });
}

