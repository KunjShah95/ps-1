import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireFirebaseUser } from '@/lib/server/requireFirebaseUser';
import { getAdminDb } from '@/lib/firebase-admin';
import { getZoneInsights } from '@/lib/ai-engine';
import type { ZoneData } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request, 'viewer');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const adminDb = getAdminDb();
    const zonesSnap = await adminDb.collection('zones').get();
    const zones = zonesSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ZoneData, 'id'>) })) satisfies ZoneData[];

    const alertsSnap = await adminDb
      .collection('alerts')
      .where('acknowledged', '==', false)
      .orderBy('created_at', 'desc')
      .limit(20)
      .get();
    const alerts = alertsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));

    const insights = getZoneInsights(zones);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: zones,
      alerts,
      insights,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch zone data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request, 'manager');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // For MVP, POST returns current Firestore snapshot as an authenticated refresh call.
    // Mutations are handled by the simulation service + dedicated endpoints.
    const adminDb = getAdminDb();
    const zonesSnap = await adminDb.collection('zones').get();
    const zones = zonesSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ZoneData, 'id'>) })) satisfies ZoneData[];

    const alertsSnap = await adminDb
      .collection('alerts')
      .where('acknowledged', '==', false)
      .orderBy('created_at', 'desc')
      .limit(20)
      .get();
    const alerts = alertsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));

    const insights = getZoneInsights(zones);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: zones,
      alerts,
      insights,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to refresh zone data' },
      { status: 500 }
    );
  }
}