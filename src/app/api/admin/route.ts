export const dynamic = 'force-dynamic';
/**
 * Admin Dashboard API — aggregate data for the admin overview screen
 * GET /api/admin
 *
 * Required role: manager+
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getZoneInsights } from '@/lib/ai-engine';
import { getStatus } from '@/lib/types';
import { requireFirebaseUser } from '@/lib/server/requireFirebaseUser';
import { getAdminDb } from '@/lib/firebase-admin';
import type { ZoneData } from '@/lib/types';

type AlertDoc = {
  id: string;
  type?: string;
  acknowledged?: boolean;
  created_at?: unknown;
  [key: string]: unknown;
};

export async function GET(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request, 'manager');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized — manager+ required' }, { status: 401 });
    }

    const adminDb = getAdminDb();
    const zonesSnap = await adminDb.collection('zones').get();
    const zones = zonesSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ZoneData, 'id'>) })) satisfies ZoneData[];

    const alertsSnap = await adminDb
      .collection('alerts')
      .where('acknowledged', '==', false)
      .orderBy('created_at', 'desc')
      .limit(50)
      .get();
    const alerts: AlertDoc[] = alertsSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Record<string, unknown>),
    }));
    const insights = getZoneInsights(zones);
    const memory   = process.memoryUsage();

    const totalCapacity   = zones.reduce((s, z) => s + z.capacity, 0);
    const totalOccupancy  = zones.reduce((s, z) => s + z.count, 0);
    const criticalZones   = zones.filter((z) => getStatus(z.percentage) === 'critical');
    const warningZones   = zones.filter((z) => getStatus(z.percentage) === 'high');

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      dashboard: {
        overview: {
          totalCapacity,
          totalOccupancy,
          occupancyRate: Math.round((totalOccupancy / totalCapacity) * 100),
          criticalZones:  criticalZones.length,
          warningZones:   warningZones.length,
          activeAlerts:   alerts.filter((a) => a.type === 'critical' || a.type === 'high').length,
        },
        zones: {
          data:     zones,
          count:    zones.length,
          critical: criticalZones,
          warning:  warningZones,
        },
        alerts: {
          list:  alerts,
          count: alerts.length,
          bySeverity: {
            critical: alerts.filter((a) => a.type === 'critical').length,
            high:     alerts.filter((a) => a.type === 'high').length,
            medium:   0,
            low:      0,
          },
        },
        insights,
        system: {
          uptime:    Math.round(process.uptime()),
          memory_mb: Math.round(memory.heapUsed / 1024 / 1024),
          env:       process.env.NODE_ENV,
        },
      },
    });
  } catch (error) {
    console.error('[/api/admin GET]', error);
    return NextResponse.json({ success: false, error: 'Admin request failed' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Admin API — use GET for dashboard data',
  });
}
