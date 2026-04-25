/**
 * Simulation Control API
 * POST /api/simulation
 *   action: start | stop | reset | status
 *
 * Updates the simulation_state doc in Firestore so all clients
 * can react to start/stop events.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireFirebaseUser } from '@/lib/server/requireFirebaseUser';
import { generateAlerts, getZoneInsights } from '@/lib/ai-engine';
import type { ZoneData } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request, 'viewer');
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const adminDb = getAdminDb();
    const snap = await adminDb.doc('system/simulation_state').get();
    const state = snap.exists ? snap.data() : { running: false };

    const zonesSnap = await adminDb.collection('zones').get();
    const zones = zonesSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ZoneData, 'id'>) })) satisfies ZoneData[];

    const alertsSnap = await adminDb
      .collection('alerts')
      .where('acknowledged', '==', false)
      .orderBy('created_at', 'desc')
      .limit(20)
      .get();
    const storedAlerts = alertsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));

    const alerts = storedAlerts.length ? storedAlerts : generateAlerts(zones);
    const insights = getZoneInsights(zones);

    return NextResponse.json({
      success: true,
      simulation: state,
      zones,
      alerts,
      insights,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[/api/simulation GET]', error);
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request, 'manager');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized — manager+ required' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    const adminDb = getAdminDb();
    const stateRef = adminDb.doc('system/simulation_state');

    switch (action) {
      case 'start': {
        await stateRef.set({
          running: true,
          startedAt: FieldValue.serverTimestamp(),
          startedBy: user.uid,
          intervalMs: body.intervalMs || 10000,
        }, { merge: true });
        return NextResponse.json({ success: true, message: 'Simulation started' });
      }

      case 'stop': {
        await stateRef.set({
          running: false,
          stoppedAt: FieldValue.serverTimestamp(),
          stoppedBy: user.uid,
        }, { merge: true });
        return NextResponse.json({ success: true, message: 'Simulation stopped' });
      }

      case 'reset': {
        if (user.role !== 'admin') {
          return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
        }
        await stateRef.set({
          running: false,
          resetAt: FieldValue.serverTimestamp(),
          resetBy: user.uid,
        });
        return NextResponse.json({ success: true, message: 'Simulation reset' });
      }

      case 'snapshot': {
        const zonesSnap = await adminDb.collection('zones').get();
        const zones = zonesSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ZoneData, 'id'>) })) satisfies ZoneData[];
        const alertsSnap = await adminDb
          .collection('alerts')
          .where('acknowledged', '==', false)
          .orderBy('created_at', 'desc')
          .limit(20)
          .get();
        const storedAlerts = alertsSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }));
        const alerts = storedAlerts.length ? storedAlerts : generateAlerts(zones);
        const insights = getZoneInsights(zones);
        return NextResponse.json({
          success: true,
          timestamp: new Date().toISOString(),
          zones,
          alerts,
          insights,
        });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('[/api/simulation POST]', error);
    return NextResponse.json({ success: false, error: 'Simulation action failed' }, { status: 500 });
  }
}
