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
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { authManager } from '@/lib/auth/manager';
import { getZoneData, refreshZoneData } from '@/lib/data-engine';
import { generateAlerts, getZoneInsights } from '@/lib/ai-engine';

async function requireAuth(request: NextRequest, minRole: 'manager' | 'admin' = 'manager') {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const token = header.replace(/^Bearer\s+/i, '');
  const session = await authManager.verifyToken(token);
  if (!session || !authManager.hasPermission(session.role, [minRole])) return null;
  return session;
}

export async function GET(request: NextRequest) {
  try {
    const header = request.headers.get('authorization');
    if (!header) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const token = header.replace(/^Bearer\s+/i, '');
    const session = await authManager.verifyToken(token);
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const snap = await getDoc(doc(db, 'system', 'simulation_state'));
    const state = snap.exists() ? snap.data() : { running: false };

    const zones    = getZoneData();
    const alerts   = generateAlerts(zones);
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
    const session = await requireAuth(request, 'manager');
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized — manager+ required' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    const stateRef = doc(db, 'system', 'simulation_state');

    switch (action) {
      case 'start': {
        await setDoc(stateRef, {
          running: true,
          startedAt: serverTimestamp(),
          startedBy: session.userId,
          intervalMs: body.intervalMs || 10000,
        }, { merge: true });
        return NextResponse.json({ success: true, message: 'Simulation started' });
      }

      case 'stop': {
        await setDoc(stateRef, {
          running: false,
          stoppedAt: serverTimestamp(),
          stoppedBy: session.userId,
        }, { merge: true });
        return NextResponse.json({ success: true, message: 'Simulation stopped' });
      }

      case 'reset': {
        if (!authManager.hasPermission(session.role, ['admin'])) {
          return NextResponse.json({ success: false, error: 'Admin only' }, { status: 403 });
        }
        await setDoc(stateRef, {
          running: false,
          resetAt: serverTimestamp(),
          resetBy: session.userId,
        });
        return NextResponse.json({ success: true, message: 'Simulation reset' });
      }

      case 'snapshot': {
        const zones    = refreshZoneData();
        const alerts   = generateAlerts(zones);
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
