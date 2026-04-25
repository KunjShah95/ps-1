/**
 * Staff Management API
 * GET  /api/staff            — list staff members
 * POST /api/staff            — create / update / deactivate staff
 *
 * Backed by the `users` Firestore collection (role-filtered).
 * Required role: manager+ to write, security+ to read
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminDb } from '@/lib/firebase-admin';
import { requireFirebaseUser } from '@/lib/server/requireFirebaseUser';
import crypto from 'crypto';

// ── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request, 'viewer');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const role      = searchParams.get('role');
    const activeOnly = searchParams.get('active') !== 'false';
    const venueId   = searchParams.get('venue');

    const adminDb = getAdminDb();
    let q: FirebaseFirestore.Query = adminDb.collection('users').orderBy('name');
    if (role) q = q.where('role', '==', role);
    if (activeOnly) q = q.where('active', '==', true);
    if (venueId) q = q.where('venueIds', 'array-contains', venueId);

    const snap = await q.get();
    const staff = snap.docs.map((d) => {
      const data = d.data() as Record<string, unknown>;
      const safe: Record<string, unknown> = { ...data };
      delete safe.passwordHash;
      return { id: d.id, ...safe };
    });

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: staff.length,
      staff,
    });
  } catch (error) {
    console.error('[/api/staff GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch staff' }, { status: 500 });
  }
}

// ── POST ─────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const user = await requireFirebaseUser(request, 'manager');
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const adminDb = getAdminDb();
      const adminAuth = getAdminAuth();

      // Check duplicate email
      const existing = await adminDb.collection('users').where('email', '==', body.email).limit(1).get();
      if (!existing.empty) {
        return NextResponse.json(
          { success: false, error: 'Email already registered' },
          { status: 400 },
        );
      }

      const uid = crypto.randomUUID();
      const tempPassword = body.password || crypto.randomBytes(6).toString('hex');

      // Create Firebase Auth user (so they can actually sign in).
      await adminAuth.createUser({
        uid,
        email: body.email,
        displayName: body.name,
        password: tempPassword,
        disabled: false,
      });

      await adminDb.collection('users').doc(uid).set({
        uid,
        email:        body.email,
        name:         body.name,
        role:         body.role || 'staff',
        venueIds:     body.venueIds || [],
        active:       true,
        createdBy:    user.uid,
        createdAt:    Date.now(),
        created_at:   FieldValue.serverTimestamp(),
      });

      return NextResponse.json({
        success: true,
        id: uid,
        // Return temp password only on creation so admin can share
        tempPassword: body.password ? undefined : tempPassword,
      });
    }

    if (action === 'update') {
      const user = await requireFirebaseUser(request, 'manager');
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const { id, updates } = body;
      // Never allow changing email/password via this route
      const { email: _e, passwordHash: _p, password: _pw, ...safeUpdates } = updates || {};

      const adminDb = getAdminDb();
      const ref = adminDb.collection('users').doc(id);
      const snap = await ref.get();
      if (!snap.exists) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      await ref.set({ ...safeUpdates, updatedBy: user.uid, updated_at: FieldValue.serverTimestamp() }, { merge: true });
      return NextResponse.json({ success: true });
    }

    if (action === 'deactivate') {
      const user = await requireFirebaseUser(request, 'admin');
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const adminDb = getAdminDb();
      const adminAuth = getAdminAuth();
      await adminAuth.updateUser(body.id, { disabled: true });
      await adminDb.collection('users').doc(body.id).set(
        { active: false, updatedBy: user.uid, updated_at: FieldValue.serverTimestamp() },
        { merge: true },
      );
      return NextResponse.json({ success: true });
    }

    if (action === 'change-role') {
      const user = await requireFirebaseUser(request, 'admin');
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const adminDb = getAdminDb();
      await adminDb.collection('users').doc(body.id).set(
        { role: body.role, updatedBy: user.uid, updated_at: FieldValue.serverTimestamp() },
        { merge: true },
      );
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[/api/staff POST]', error);
    return NextResponse.json({ success: false, error: 'Staff action failed' }, { status: 500 });
  }
}
