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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { authManager } from '@/lib/auth/manager';
import crypto from 'crypto';

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
    const role      = searchParams.get('role');
    const activeOnly = searchParams.get('active') !== 'false';
    const venueId   = searchParams.get('venue');

    let q = query(collection(db, 'users'), orderBy('name'));
    if (role) q = query(q, where('role', '==', role));
    if (activeOnly) q = query(q, where('active', '==', true));
    if (venueId) q = query(q, where('venueIds', 'array-contains', venueId));

    const snap = await getDocs(q);
    const staff = snap.docs.map((d) => {
      const data = d.data();
      // Never expose passwordHash
      const { passwordHash, ...safe } = data as any;
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
      const session = await requireAuth(request, 'manager');
      if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      // Check duplicate email
      const existing = await getDocs(
        query(collection(db, 'users'), where('email', '==', body.email)),
      );
      if (!existing.empty) {
        return NextResponse.json(
          { success: false, error: 'Email already registered' },
          { status: 400 },
        );
      }

      const uid = crypto.randomUUID();
      const tempPassword = body.password || crypto.randomBytes(6).toString('hex');

      await addDoc(collection(db, 'users'), {
        id:           uid,
        email:        body.email,
        name:         body.name,
        role:         body.role || 'staff',
        venueIds:     body.venueIds || [],
        active:       true,
        passwordHash: crypto.createHash('sha256').update(tempPassword + 'smartflow_salt').digest('hex'),
        createdBy:    session.userId,
        createdAt:    Date.now(),
        created_at:   serverTimestamp(),
      });

      return NextResponse.json({
        success: true,
        id: uid,
        // Return temp password only on creation so admin can share
        tempPassword: body.password ? undefined : tempPassword,
      });
    }

    if (action === 'update') {
      const session = await requireAuth(request, 'manager');
      if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const { id, updates } = body;
      // Never allow changing email/passwordHash via this route
      const { email: _e, passwordHash: _p, ...safeUpdates } = updates || {};

      const ref = doc(db, 'users', id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
      }

      await updateDoc(ref, { ...safeUpdates, updated_at: serverTimestamp() });
      return NextResponse.json({ success: true });
    }

    if (action === 'deactivate') {
      const session = await requireAuth(request, 'admin');
      if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const ref = doc(db, 'users', body.id);
      await updateDoc(ref, { active: false, updated_at: serverTimestamp() });
      return NextResponse.json({ success: true });
    }

    if (action === 'change-role') {
      const session = await requireAuth(request, 'admin');
      if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const ref = doc(db, 'users', body.id);
      await updateDoc(ref, { role: body.role, updated_at: serverTimestamp() });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[/api/staff POST]', error);
    return NextResponse.json({ success: false, error: 'Staff action failed' }, { status: 500 });
  }
}
