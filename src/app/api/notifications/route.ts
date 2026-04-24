/**
 * Notifications API
 * GET  /api/notifications            — list notifications for current user
 * POST /api/notifications            — mark read / create notification
 *
 * Firestore collection: notifications
 * Fields: id, userId, title, message, type, read, created_at
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  writeBatch,
  query,
  where,
  orderBy,
  limit,
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

// ── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get('unread') === 'true';
    const pageSize   = Math.min(Number(searchParams.get('limit') || 30), 100);

    let q = query(
      collection(db, 'notifications'),
      where('userId', 'in', [session.userId, 'broadcast']),
      orderBy('created_at', 'desc'),
      limit(pageSize),
    );

    if (unreadOnly) {
      q = query(q, where('read', '==', false));
    }

    const snap = await getDocs(q);
    const notifications = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const unreadCount   = notifications.filter((n: any) => !n.read).length;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error('[/api/notifications GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
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
    const { action } = body;

    if (action === 'mark-read') {
      const ids: string[] = Array.isArray(body.ids) ? body.ids : [body.id];
      const batch = writeBatch(db);
      ids.forEach((id) => batch.update(doc(db, 'notifications', id), { read: true }));
      await batch.commit();
      return NextResponse.json({ success: true, updated: ids.length });
    }

    if (action === 'mark-all-read') {
      const q = query(
        collection(db, 'notifications'),
        where('userId', 'in', [session.userId, 'broadcast']),
        where('read', '==', false),
      );
      const snap = await getDocs(q);
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
      await batch.commit();
      return NextResponse.json({ success: true, updated: snap.size });
    }

    if (action === 'create') {
      // Admin/manager can broadcast; others can only notify self
      const targetUserId = body.userId || session.userId;
      if (
        targetUserId !== session.userId &&
        !authManager.hasPermission(session.role, ['manager'])
      ) {
        return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
      }

      const ref = await addDoc(collection(db, 'notifications'), {
        userId:     targetUserId,
        title:      body.title,
        message:    body.message,
        type:       body.type || 'info',   // info | warning | success | error
        read:       false,
        createdBy:  session.userId,
        created_at: serverTimestamp(),
      });

      return NextResponse.json({ success: true, id: ref.id });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[/api/notifications POST]', error);
    return NextResponse.json({ success: false, error: 'Notification action failed' }, { status: 500 });
  }
}
