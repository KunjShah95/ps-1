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

async function requireAuth(
  request: NextRequest,
  minRole: 'viewer' | 'staff' | 'security' | 'manager' | 'admin' = 'staff',
) {
  const header = request.headers.get('authorization');
  if (!header) return null;
  const token = header.replace(/^Bearer\s+/i, '');
  const session = await authManager.verifyToken(token);
  if (!session || !authManager.hasPermission(session.role, [minRole])) return null;
  return session;
}

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
  const snap = await getDocs(collection(db, 'vendors'));
  if (!snap.empty) return;
  for (const v of DEMO_VENDORS) {
    await addDoc(collection(db, 'vendors'), {
      ...v,
      createdAt: Date.now(),
      created_at: serverTimestamp(),
    });
  }
}

// ── GET ──────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(request, 'staff');
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await seedVendors();

    const { searchParams } = new URL(request.url);
    const type   = searchParams.get('type');
    const status = searchParams.get('status');

    let q = query(collection(db, 'vendors'), orderBy('name'));
    if (type)   q = query(q, where('type', '==', type));
    if (status) q = query(q, where('status', '==', status));

    const snap = await getDocs(q);
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
      const session = await requireAuth(request, 'manager');
      if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      await seedVendors();

      const ref = await addDoc(collection(db, 'vendors'), {
        name:      body.name,
        type:      body.type || 'general',
        contact:   body.contact || '',
        phone:     body.phone || '',
        email:     body.email || '',
        status:    'active',
        zones:     body.zones || [],
        rating:    body.rating || 0,
        createdBy: session.userId,
        createdAt: Date.now(),
        created_at: serverTimestamp(),
      });

      return NextResponse.json({ success: true, id: ref.id });
    }

    if (action === 'update') {
      const session = await requireAuth(request, 'manager');
      if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      const { id, updates } = body;
      const ref = doc(db, 'vendors', id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        return NextResponse.json({ success: false, error: 'Vendor not found' }, { status: 404 });
      }

      await updateDoc(ref, { ...updates, updated_at: serverTimestamp() });
      return NextResponse.json({ success: true });
    }

    if (action === 'deactivate') {
      const session = await requireAuth(request, 'manager');
      if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }

      await updateDoc(doc(db, 'vendors', body.id), {
        status: 'inactive',
        updated_at: serverTimestamp(),
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('[/api/vendors POST]', error);
    return NextResponse.json({ success: false, error: 'Vendor action failed' }, { status: 500 });
  }
}
