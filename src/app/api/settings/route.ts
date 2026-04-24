/**
 * Settings API
 * GET  /api/settings          — get current settings for venue or user
 * POST /api/settings          — update settings
 *
 * Firestore:
 *   settings/venue            — global venue settings (admin/manager only)
 *   settings/users/{uid}      — per-user preferences (owner only)
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

async function requireAuth(request: NextRequest) {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const token = header.replace(/^Bearer\s+/i, '');
  return authManager.verifyToken(token);
}

const DEFAULT_VENUE_SETTINGS = {
  venueName: 'SmartFlow Venue',
  maxCapacity: 5000,
  alertThresholds: {
    warning: 70,
    critical: 90,
  },
  alertSound: true,
  autoRefreshInterval: 10,
  timezone: 'UTC',
  notificationsEmail: '',
  simulationEnabled: true,
  aiInsightsEnabled: true,
  crisisProtocols: {
    overcrowding: true,
    fire: true,
    medical: true,
    security: true,
  },
};

// ── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'venue'; // venue | user

    if (scope === 'user') {
      const ref = doc(db, 'settings', 'users', session.userId, 'prefs');
      const snap = await getDoc(ref);
      return NextResponse.json({
        success: true,
        settings: snap.exists() ? snap.data() : {},
      });
    }

    // Venue-level settings (all authenticated users can read)
    const ref = doc(db, 'settings', 'venue');
    const snap = await getDoc(ref);
    const settings = snap.exists() ? snap.data() : DEFAULT_VENUE_SETTINGS;

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('[/api/settings GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// ── POST ─────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const scope = body.scope || 'venue';

    if (scope === 'user') {
      // Any user can update their own preferences
      const ref = doc(db, 'settings', 'users', session.userId, 'prefs');
      await setDoc(ref, { ...body.settings, updated_at: serverTimestamp() }, { merge: true });
      return NextResponse.json({ success: true });
    }

    // Venue settings — manager+ only
    if (!authManager.hasPermission(session.role, ['manager'])) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const ref = doc(db, 'settings', 'venue');
    await setDoc(
      ref,
      { ...body.settings, updatedBy: session.userId, updated_at: serverTimestamp() },
      { merge: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[/api/settings POST]', error);
    return NextResponse.json({ success: false, error: 'Settings update failed' }, { status: 500 });
  }
}
