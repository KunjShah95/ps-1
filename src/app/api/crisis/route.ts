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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { authManager } from '@/lib/auth/manager';

async function requireAuth(
  request: NextRequest,
  minRole: 'viewer' | 'staff' | 'security' | 'manager' | 'admin' = 'security',
) {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const token = header.replace(/^Bearer\s+/i, '');
  const session = await authManager.verifyToken(token);
  if (!session || !authManager.hasPermission(session.role, [minRole])) return null;
  return session;
}

// ── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request, 'security');
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id     = searchParams.get('id');
    const status = searchParams.get('status'); // active | resolved | all
    const pageSize = Math.min(Number(searchParams.get('limit') || 20), 100);

    // Single incident
    if (id) {
      const snap = await getDoc(doc(db, 'crisis_incidents', id));
      if (!snap.exists()) {
        return NextResponse.json({ success: false, error: 'Incident not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, incident: { id: snap.id, ...snap.data() } });
    }

    // List with optional status filter
    let q = query(
      collection(db, 'crisis_incidents'),
      orderBy('created_at', 'desc'),
      limit(pageSize),
    );

    if (status && status !== 'all') {
      q = query(q, where('status', '==', status));
    } else if (!status) {
      q = query(q, where('status', '==', 'active'));
    }

    const snap = await getDocs(q);
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

    if (action === 'create') {
      const session = await requireAuth(request, 'manager');
      if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const ref = await addDoc(collection(db, 'crisis_incidents'), {
        title:       body.title,
        description: body.description || '',
        type:        body.type || 'general',       // overcrowding | stampede | fire | medical | security | general
        severity:    body.severity || 'high',       // critical | high | medium | low
        status:      'active',
        affectedZones: body.affectedZones || [],
        assignedTo:  body.assignedTo || [],
        createdBy:   session.userId,
        created_at:  serverTimestamp(),
        updated_at:  serverTimestamp(),
        timeline: [
          {
            timestamp: Date.now(),
            actor: session.userId,
            action: 'created',
            note: 'Incident created',
          },
        ],
      });

      return NextResponse.json({ success: true, id: ref.id });
    }

    if (action === 'update') {
      const session = await requireAuth(request, 'security');
      if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const ref = doc(db, 'crisis_incidents', body.id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      }

      const existingTimeline: unknown[] = (snap.data().timeline as unknown[]) || [];

      await updateDoc(ref, {
        ...body.updates,
        updated_at: serverTimestamp(),
        timeline: [
          ...existingTimeline,
          {
            timestamp: Date.now(),
            actor: session.userId,
            action: 'updated',
            note: body.note || 'Incident updated',
          },
        ],
      });

      return NextResponse.json({ success: true });
    }

    if (action === 'resolve') {
      const session = await requireAuth(request, 'manager');
      if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const ref = doc(db, 'crisis_incidents', body.id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
      }

      const existingTimeline: unknown[] = (snap.data().timeline as unknown[]) || [];

      await updateDoc(ref, {
        status:      'resolved',
        resolvedBy:  session.userId,
        resolved_at: serverTimestamp(),
        updated_at:  serverTimestamp(),
        resolution:  body.resolution || '',
        timeline: [
          ...existingTimeline,
          {
            timestamp: Date.now(),
            actor: session.userId,
            action: 'resolved',
            note: body.resolution || 'Incident resolved',
          },
        ],
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[/api/crisis POST]', error);
    return NextResponse.json({ success: false, error: 'Crisis action failed' }, { status: 500 });
  }
}
