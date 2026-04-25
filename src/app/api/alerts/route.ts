export const dynamic = 'force-dynamic';
/**
 * GET  /api/alerts           — list alerts (with filters)
 * POST /api/alerts           — acknowledge / create alert
 * DELETE /api/alerts?id=xxx  — delete alert
 *
 * Firestore collection: alerts
 * Fields: id, type, zone, message, severity, acknowledged, created_at
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireFirebaseUser } from '@/lib/server/requireFirebaseUser';

// ── helpers ─────────────────────────────────────────────────────────────────

// ── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request, 'viewer');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const zone      = searchParams.get('zone');
    const severity  = searchParams.get('severity');
    const unackOnly = searchParams.get('unacknowledged') === 'true';
    const pageSize  = Math.min(Number(searchParams.get('limit') || 50), 200);

    const adminDb = getAdminDb();
    let q: FirebaseFirestore.Query = adminDb
      .collection('alerts')
      .orderBy('created_at', 'desc')
      .limit(pageSize);
    if (zone) q = q.where('zone', '==', zone);
    if (severity) q = q.where('severity', '==', severity);
    if (unackOnly) q = q.where('acknowledged', '==', false);

    const snap = await q.get();
    const alerts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    console.error('[/api/alerts GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch alerts' }, { status: 500 });
  }
}

// ── POST ─────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request, 'staff');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    const adminDb = getAdminDb();

    if (action === 'acknowledge') {
      // Acknowledge one or many alerts
      const ids: string[] = Array.isArray(body.ids) ? body.ids : [body.id];
      await Promise.all(
        ids.map((id) =>
          adminDb.collection('alerts').doc(id).set(
            {
              acknowledged: true,
              acknowledgedBy: user.uid,
              acknowledgedAt: FieldValue.serverTimestamp(),
              updated_at: FieldValue.serverTimestamp(),
            },
            { merge: true },
          ),
        ),
      );
      return NextResponse.json({ success: true, acknowledged: ids.length });
    }

    if (action === 'create') {
      // Manual alert creation (security / admin only)
      const ref = await adminDb.collection('alerts').add({
        type: body.type || 'manual',
        zone: body.zone || 'system',
        message: body.message,
        severity: body.severity || 'medium',
        acknowledged: false,
        createdBy: user.uid,
        created_at: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true, id: ref.id });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[/api/alerts POST]', error);
    return NextResponse.json({ success: false, error: 'Alert action failed' }, { status: 500 });
  }
}

// ── DELETE ───────────────────────────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request, 'admin');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });

    const adminDb = getAdminDb();
    await adminDb.collection('alerts').doc(id).delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[/api/alerts DELETE]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete alert' }, { status: 500 });
  }
}

