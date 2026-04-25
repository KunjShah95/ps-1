export const dynamic = 'force-dynamic';
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
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireFirebaseUser } from '@/lib/server/requireFirebaseUser';

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
    const user = await requireFirebaseUser(request, 'viewer');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'venue'; // venue | user

    const adminDb = getAdminDb();

    if (scope === 'user') {
      const ref = adminDb.doc(`settings/users/${user.uid}/prefs`);
      const snap = await ref.get();
      return NextResponse.json({
        success: true,
        settings: snap.exists ? snap.data() : {},
      });
    }

    // Venue-level settings (all authenticated users can read)
    const ref = adminDb.doc('settings/venue');
    const snap = await ref.get();
    const settings = snap.exists ? snap.data() : DEFAULT_VENUE_SETTINGS;

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('[/api/settings GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// ── POST ─────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request, 'viewer');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const scope = body.scope || 'venue';

    const adminDb = getAdminDb();

    if (scope === 'user') {
      // Any user can update their own preferences
      const ref = adminDb.doc(`settings/users/${user.uid}/prefs`);
      await ref.set({ ...body.settings, updated_at: FieldValue.serverTimestamp() }, { merge: true });
      return NextResponse.json({ success: true });
    }

    // Venue settings — manager+ only
    if (!['manager', 'admin'].includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
    }

    const ref = adminDb.doc('settings/venue');
    await ref.set(
      { ...body.settings, updatedBy: user.uid, updated_at: FieldValue.serverTimestamp() },
      { merge: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[/api/settings POST]', error);
    return NextResponse.json({ success: false, error: 'Settings update failed' }, { status: 500 });
  }
}

