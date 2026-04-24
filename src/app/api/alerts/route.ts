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
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { authManager } from '@/lib/auth/manager';

// ── helpers ─────────────────────────────────────────────────────────────────

async function requireAuth(request: NextRequest, minRole: 'viewer' | 'staff' | 'security' | 'manager' | 'admin' = 'viewer') {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const token = header.replace(/^Bearer\s+/i, '');
  const session = await authManager.verifyToken(token);
  if (!session) return null;
  if (!authManager.hasPermission(session.role, [minRole])) return null;
  return session;
}

// ── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request, 'viewer');
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const zone      = searchParams.get('zone');
    const severity  = searchParams.get('severity');
    const unackOnly = searchParams.get('unacknowledged') === 'true';
    const pageSize  = Math.min(Number(searchParams.get('limit') || 50), 200);

    let q = query(
      collection(db, 'alerts'),
      orderBy('created_at', 'desc'),
      limit(pageSize),
    );

    if (zone) q = query(q, where('zone', '==', zone));
    if (severity) q = query(q, where('severity', '==', severity));
    if (unackOnly) q = query(q, where('acknowledged', '==', false));

    const snap = await getDocs(q);
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
    const session = await requireAuth(request, 'security');
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'acknowledge') {
      // Acknowledge one or many alerts
      const ids: string[] = Array.isArray(body.ids) ? body.ids : [body.id];
      await Promise.all(
        ids.map((id) =>
          updateDoc(doc(db, 'alerts', id), {
            acknowledged: true,
            acknowledgedBy: session.userId,
            acknowledgedAt: serverTimestamp(),
          }),
        ),
      );
      return NextResponse.json({ success: true, acknowledged: ids.length });
    }

    if (action === 'create') {
      // Manual alert creation (security / admin only)
      if (!authManager.hasPermission(session.role, ['security'])) {
        return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
      }

      const ref = await addDoc(collection(db, 'alerts'), {
        type: body.type || 'manual',
        zone: body.zone || 'system',
        message: body.message,
        severity: body.severity || 'medium',
        acknowledged: false,
        createdBy: session.userId,
        created_at: serverTimestamp(),
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
    const session = await requireAuth(request, 'admin');
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });

    await deleteDoc(doc(db, 'alerts', id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[/api/alerts DELETE]', error);
    return NextResponse.json({ success: false, error: 'Failed to delete alert' }, { status: 500 });
  }
}
