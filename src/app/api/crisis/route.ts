export const dynamic = 'force-dynamic';
/**
 * Crisis Management API
 * GET  /api/crisis              — list active crisis incidents
 * POST /api/crisis              — create / update / resolve incident
 * GET  /api/crisis?id=<id>      — get single incident detail
 *
 * Firestore collection: crisis_incidents
 * Required role: manager+ to create, security+ to view
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireFirebaseUser } from '@/lib/server/requireFirebaseUser';

// ── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request, 'viewer');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id     = searchParams.get('id');
    const status = searchParams.get('status'); // active | resolved | all
    const pageSize = Math.min(Number(searchParams.get('limit') || 20), 100);

    const adminDb = getAdminDb();

    // Single incident
    if (id) {
      const snap = await adminDb.collection('crisis_incidents').doc(id).get();
      if (!snap.exists) {
        return NextResponse.json({ success: false, error: 'Incident not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, incident: { id: snap.id, ...snap.data() } });
    }

    // List with optional status filter
    let q: FirebaseFirestore.Query = adminDb
      .collection('crisis_incidents')
      .orderBy('created_at', 'desc')
      .limit(pageSize);

    if (status && status !== 'all') q = q.where('status', '==', status);
    else if (!status) q = q.where('status', '==', 'active');

    const snap = await q.get();
    const incidents = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: incidents.length,
      incidents,
    });
  } catch (error) {
    console.error('[/api/crisis GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch incidents' }, { status: 500 });
  }
}

// ── POST ─────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    const adminDb = getAdminDb();

    if (action === 'create') {
      const user = await requireFirebaseUser(request, 'manager');
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const ref = await adminDb.collection('crisis_incidents').add({
        title:       body.title,
        description: body.description || '',
        type:        body.type || 'general',       // overcrowding | stampede | fire | medical | security | general
        severity:    body.severity || 'high',       // critical | high | medium | low
        status:      'active',
        affectedZones: body.affectedZones || [],
        assignedTo:  body.assignedTo || [],
        createdBy:   user.uid,
        created_at:  FieldValue.serverTimestamp(),
        updated_at:  FieldValue.serverTimestamp(),
        timeline: [
          {
            timestamp: Date.now(),
            actor: user.uid,
            action: 'created',
            note: 'Incident created',
          },
        ],
      });

      return NextResponse.json({ success: true, id: ref.id });
    }

    if (action === 'update') {
      const user = await requireFirebaseUser(request, 'security');
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const ref = adminDb.collection('crisis_incidents').doc(body.id);
      const snap = await ref.get();
      if (!snap.exists) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      }

      const data = snap.data() ?? {};
      const existingTimeline: unknown[] = Array.isArray((data as { timeline?: unknown }).timeline)
        ? (((data as { timeline?: unknown }).timeline) as unknown[])
        : [];

      await ref.set({
        ...body.updates,
        updated_at: FieldValue.serverTimestamp(),
        timeline: [
          ...existingTimeline,
          {
            timestamp: Date.now(),
            actor: user.uid,
            action: 'updated',
            note: body.note || 'Incident updated',
          },
        ],
      }, { merge: true });

      return NextResponse.json({ success: true });
    }

    if (action === 'resolve') {
      const user = await requireFirebaseUser(request, 'manager');
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const ref = adminDb.collection('crisis_incidents').doc(body.id);
      const snap = await ref.get();
      if (!snap.exists) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      }

      const data = snap.data() ?? {};
      const existingTimeline: unknown[] = Array.isArray((data as { timeline?: unknown }).timeline)
        ? (((data as { timeline?: unknown }).timeline) as unknown[])
        : [];

      await ref.set({
        status:      'resolved',
        resolvedBy:  user.uid,
        resolved_at: FieldValue.serverTimestamp(),
        updated_at:  FieldValue.serverTimestamp(),
        resolution:  body.resolution || '',
        timeline: [
          ...existingTimeline,
          {
            timestamp: Date.now(),
            actor: user.uid,
            action: 'resolved',
            note: body.resolution || 'Incident resolved',
          },
        ],
      }, { merge: true });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[/api/crisis POST]', error);
    return NextResponse.json({ success: false, error: 'Crisis action failed' }, { status: 500 });
  }
}

