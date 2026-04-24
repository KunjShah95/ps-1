/**
 * GET  /api/analytics  — aggregate crowd analytics from Firestore history
 * Query params:
 *   zone=<id>           — filter by zone
 *   period=hour|day|week — time window (default: hour)
 *   limit=<n>           — max data points (default: 60)
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  collectionGroup,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { authManager } from '@/lib/auth/manager';
import { getZoneData } from '@/lib/data-engine';
import { generateAlerts, getZoneInsights } from '@/lib/ai-engine';

async function requireAuth(request: NextRequest) {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const token = header.replace(/^Bearer\s+/i, '');
  return authManager.verifyToken(token);
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const zoneFilter = searchParams.get('zone');
    const period     = searchParams.get('period') || 'hour';
    const pageSize   = Math.min(Number(searchParams.get('limit') || 60), 500);

    // Time window
    const windowMs: Record<string, number> = {
      hour: 60 * 60 * 1000,
      day:  24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
    };
    const since = new Date(Date.now() - (windowMs[period] ?? windowMs.hour));
    const sinceTs = Timestamp.fromDate(since);

    // --- Zone summary (current) ---
    const zones = getZoneData();
    const filteredZones = zoneFilter ? zones.filter((z) => z.id === zoneFilter) : zones;

    // --- Zone history from Firestore ---
    let historyData: { zoneId: string; count: number; percentage: number; timestamp: number }[] = [];
    try {
      // collectionGroup query across all zones/{id}/history subcollections
      let hq = query(
        collectionGroup(db, 'history'),
        where('timestamp', '>=', sinceTs),
        orderBy('timestamp', 'desc'),
        limit(pageSize),
      );

      const histSnap = await getDocs(hq);
      historyData = histSnap.docs.map((d) => {
        const data = d.data();
        // parent path: zones/{zoneId}/history/{docId}
        const zoneId = d.ref.parent.parent?.id ?? 'unknown';
        const ts: Timestamp = data.timestamp;
        return {
          zoneId,
          count:      data.count,
          percentage: data.percentage,
          timestamp:  ts?.toMillis?.() ?? Date.now(),
        };
      });
    } catch {
      // history may not exist yet
    }

    // --- Aggregate stats ---
    const totalCapacity  = filteredZones.reduce((s, z) => s + z.capacity, 0);
    const totalOccupancy = filteredZones.reduce((s, z) => s + z.count, 0);
    const avgPercentage  = filteredZones.length
      ? Math.round(filteredZones.reduce((s, z) => s + z.percentage, 0) / filteredZones.length)
      : 0;

    const alerts   = generateAlerts(zones);
    const insights = getZoneInsights(zones);

    // --- Alert distribution ---
    const alertsBySeverity = {
      critical: alerts.filter((a) => a.type === 'critical').length,
      high:     alerts.filter((a) => a.type === 'high').length,
      medium:   0,
      low:      0,
    };

    return NextResponse.json({
      success:   true,
      timestamp: new Date().toISOString(),
      period,
      analytics: {
        summary: {
          totalZones:    filteredZones.length,
          totalCapacity,
          totalOccupancy,
          avgOccupancy:  avgPercentage,
          activeAlerts:  alerts.length,
        },
        zones:     filteredZones,
        history:   historyData,
        alerts:    { distribution: alertsBySeverity, recent: alerts.slice(0, 10) },
        insights,
        peakZone:  filteredZones.sort((a, b) => b.percentage - a.percentage)[0] ?? null,
      },
    });
  } catch (error) {
    console.error('[/api/analytics GET]', error);
    return NextResponse.json({ success: false, error: 'Analytics request failed' }, { status: 500 });
  }
}
