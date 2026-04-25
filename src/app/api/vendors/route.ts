/**
 * Vendor Management API
 * GET  /api/vendors           — list vendors
 * POST /api/vendors           — create / update / deactivate
 *
 * Firestore collection: vendors
 * Fields: id, name, type, contact, phone, email, status, zones, rating, createdAt
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';
import { requireFirebaseUser } from '@/lib/server/requireFirebaseUser';

// ── Seed demo vendors if collection empty ─────────────────────────────────────

const DEMO_VENDORS = [
  { name: 'CrowdSafe Solutions',  type: 'security',    contact: 'James Okafor',  phone: '+1-555-0101', email: 'j.okafor@crowdsafe.io',   status: 'active', zones: ['North Gate', 'Main Entry'], rating: 4.8 },
  { name: 'FoodCo Catering',      type: 'catering',    contact: 'Sarah Chen',    phone: '+1-555-0102', email: 's.chen@foodco.net',         status: 'active', zones: ['Concourse A', 'Concourse B'], rating: 4.5 },
  { name: 'TechServe AV',         type: 'av',          contact: 'Mike Torres',   phone: '+1-555-0103', email: 'm.torres@techserveav.com',  status: 'active', zones: ['Stage', 'Broadcast Hub'], rating: 4.7 },
  { name: 'CleanSweep Pro',       type: 'cleaning',    contact: 'Priya Nair',    phone: '+1-555-0104', email: 'p.nair@cleansweep.biz',     status: 'active', zones: ['All Zones'], rating: 4.3 },
  { name: 'MedFirst Response',    type: 'medical',     contact: 'Dr. Kim Walsh', phone: '+1-555-0105', email: 'd.walsh@medfirst.health',   status: 'active', zones: ['Medical Bay', 'East Wing'], rating: 4.9 },
  { name: 'ParkEase Logistics',   type: 'parking',     contact: 'Carlos Diaz',   phone: '+1-555-0106', email: 'c.diaz@parkease.co',        status: 'inactive', zones: ['Parking Lot A'], rating: 3.9 },
];

let vendorsSeeded = false;

async function seedVendors() {
  if (vendorsSeeded) return;
  vendorsSeeded = true;
  const adminDb = getAdminDb();
  const snap = await adminDb.collection('vendors').limit(1).get();
  if (!snap.empty) return;
  for (const v of DEMO_VENDORS) {
    await adminDb.collection('vendors').add({
      ...v,
      createdAt: Date.now(),
      created_at: FieldValue.serverTimestamp(),
    });
  }
}

// ── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const user = await requireFirebaseUser(request, 'viewer');
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await seedVendors();

    const { searchParams } = new URL(request.url);
    const type   = searchParams.get('type');
    const status = searchParams.get('status');

    const adminDb = getAdminDb();
    let q: FirebaseFirestore.Query = adminDb.collection('vendors').orderBy('name');
    if (type) q = q.where('type', '==', type);
    if (status) q = q.where('status', '==', status);

    const snap = await q.get();
    const vendors = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      count: vendors.length,
      vendors,
    });
  } catch (error) {
    console.error('[/api/vendors GET]', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch vendors' }, { status: 500 });
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

      await seedVendors();

      const adminDb = getAdminDb();
      const ref = await adminDb.collection('vendors').add({
        name:      body.name,
        type:      body.type || 'general',
        contact:   body.contact || '',
        phone:     body.phone || '',
        email:     body.email || '',
        status:    'active',
        zones:     body.zones || [],
        rating:    body.rating || 0,
        createdBy: user.uid,
        createdAt: Date.now(),
        created_at: FieldValue.serverTimestamp(),
      });

      return NextResponse.json({ success: true, id: ref.id });
    }

    if (action === 'update') {
      const user = await requireFirebaseUser(request, 'manager');
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const { id, updates } = body;
      const adminDb = getAdminDb();
      const ref = adminDb.collection('vendors').doc(id);
      const snap = await ref.get();
      if (!snap.exists) {
        return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
      }

      await ref.set({ ...updates, updatedBy: user.uid, updated_at: FieldValue.serverTimestamp() }, { merge: true });
      return NextResponse.json({ success: true });
    }

    if (action === 'deactivate') {
      const user = await requireFirebaseUser(request, 'manager');
      if (!user) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const adminDb = getAdminDb();
      await adminDb.collection('vendors').doc(body.id).set({
        status: 'inactive',
        updatedBy: user.uid,
        updated_at: FieldValue.serverTimestamp(),
      }, { merge: true });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[/api/vendors POST]', error);
    return NextResponse.json({ success: false, error: 'Vendor action failed' }, { status: 500 });
  }
}
