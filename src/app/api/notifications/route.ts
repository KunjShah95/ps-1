export const dynamic = 'force-dynamic';
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
    const unreadOnly = searchParams.get('unread') === 'true';
    const pageSize   = Math.min(Number(searchParams.get('limit') || 30), 100);

    const adminDb = getAdminDb();
    let q: FirebaseFirestore.Query = adminDb
      .collection('notifications')
      .where('userId', 'in', [user.uid, 'broadcast'])
      .orderBy('created_at', 'desc')
      .limit(pageSize);
    if (unreadOnly) q = q.where('read', '==', false);

    const snap = await q.get();
    const notifications = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const unreadCount = notifications.filter((n) => !(n as { read?: boolean }).read).length;

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
    const user = await requireFirebaseUser(request, 'viewer');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    const adminDb = getAdminDb();

    if (action === 'mark-read') {
      const ids: string[] = Array.isArray(body.ids) ? body.ids : [body.id];
      const batch = adminDb.batch();
      ids.forEach((id) => batch.set(adminDb.collection('notifications').doc(id), { read: true }, { merge: true }));
      await batch.commit();
      return NextResponse.json({ success: true, updated: ids.length });
    }

    if (action === 'mark-all-read') {
      const snap = await adminDb
        .collection('notifications')
        .where('userId', 'in', [user.uid, 'broadcast'])
        .where('read', '==', false)
        .get();
      const batch = adminDb.batch();
      snap.docs.forEach((d) => batch.set(d.ref, { read: true }, { merge: true }));
      await batch.commit();
      return NextResponse.json({ success: true, updated: snap.size });
    }

    if (action === 'create') {
      // Admin/manager can broadcast; others can only notify self
      const targetUserId = body.userId || user.uid;
      if (
        targetUserId !== user.uid &&
        !['manager', 'admin'].includes(user.role)
      ) {
        return NextResponse.json({ success: false, error: 'Insufficient permissions' }, { status: 403 });
      }

      const ref = await adminDb.collection('notifications').add({
        userId:     targetUserId,
        title:      body.title,
        message:    body.message,
        type:       body.type || 'info',   // info | warning | success | error
        read:       false,
        createdBy:  user.uid,
        created_at: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true, id: ref.id });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[/api/notifications POST]', error);
    return NextResponse.json({ success: false, error: 'Notification action failed' }, { status: 500 });
  }
}

