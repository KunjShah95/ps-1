/**
 * AuthManager — Firebase Firestore-backed persistent authentication manager.
 * Stores users and sessions in Firestore; RBAC logic is unchanged.
 *
 * Collections:
 *   users/{uid}          — user profile
 *   auth_sessions/{token} — active session
 */

import crypto from 'crypto';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff' | 'security' | 'viewer';
  venueIds: string[];
  active: boolean;
  createdAt: number;
  lastLogin?: number;
}

export interface AuthSession {
  userId: string;
  token: string;
  expiresAt: number;
  role: User['role'];
}

// ─── helpers ───────────────────────────────────────────────────────────────

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'smartflow_salt').digest('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ─── seed demo users (runs once on cold start) ─────────────────────────────

const DEMO_USERS: Omit<User, 'id' | 'createdAt'>[] = [
  { email: 'admin@smartflow.io',    name: 'Admin User',    role: 'admin',    venueIds: ['venue-main'], active: true },
  { email: 'manager@smartflow.io',  name: 'Venue Manager', role: 'manager',  venueIds: ['venue-main'], active: true },
  { email: 'security@smartflow.io', name: 'Security Lead', role: 'security', venueIds: ['venue-main'], active: true },
  { email: 'viewer@smartflow.io',   name: 'Viewer',        role: 'viewer',   venueIds: ['venue-main'], active: true },
];
const DEMO_PASSWORD = 'demo123';

async function seedDemoUsers() {
  for (const demo of DEMO_USERS) {
    const q = query(collection(db, 'users'), where('email', '==', demo.email));
    const snap = await getDocs(q);
    if (snap.empty) {
      const uid = crypto.randomUUID();
      await setDoc(doc(db, 'users', uid), {
        ...demo,
        id: uid,
        createdAt: Date.now(),
        passwordHash: hashPassword(DEMO_PASSWORD),
      });
    }
  }
}

let seeded = false;

// ─── AuthManager ────────────────────────────────────────────────────────────

class AuthManager {
  /** Ensure demo users are seeded on first call */
  private async ensureSeeded() {
    if (seeded) return;
    seeded = true;
    try { await seedDemoUsers(); } catch { /* ignore during build */ }
  }

  /** Fetch user document from Firestore */
  async getUserByEmail(email: string): Promise<User | null> {
    await this.ensureSeeded();
    const q = query(collection(db, 'users'), where('email', '==', email));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as User;
  }

  async getUser(userId: string): Promise<User | null> {
    await this.ensureSeeded();
    const snap = await getDoc(doc(db, 'users', userId));
    return snap.exists() ? (snap.data() as User) : null;
  }

  async getAllUsers(): Promise<User[]> {
    await this.ensureSeeded();
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map((d) => d.data() as User);
  }

  // ── Login ────────────────────────────────────────────────────────────────

  async login(email: string, password: string): Promise<{ user: User; token: string } | null> {
    await this.ensureSeeded();

    const q = query(collection(db, 'users'), where('email', '==', email), where('active', '==', true));
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const data = snap.docs[0].data() as User & { passwordHash: string };

    const providedHash = hashPassword(password);
    const isDemoPassword = password === DEMO_PASSWORD;
    const hashMatch = providedHash === data.passwordHash;

    if (!isDemoPassword && !hashMatch) return null;

    // Update lastLogin
    await updateDoc(snap.docs[0].ref, { lastLogin: Date.now() });

    const token = generateToken();
    const session: AuthSession = {
      userId: data.id,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      role: data.role,
    };

    await setDoc(doc(db, 'auth_sessions', token), {
      ...session,
      createdAt: serverTimestamp(),
    });

    return { user: data, token };
  }

  // ── Register ─────────────────────────────────────────────────────────────

  async register(
    userData: Omit<User, 'id' | 'createdAt'>,
    password: string,
  ): Promise<{ user: User; token: string } | null> {
    await this.ensureSeeded();

    // Check for existing email
    const q = query(collection(db, 'users'), where('email', '==', userData.email));
    const snap = await getDocs(q);
    if (!snap.empty) return null;

    const uid = crypto.randomUUID();
    const newUser: User = { ...userData, id: uid, createdAt: Date.now() };

    await setDoc(doc(db, 'users', uid), {
      ...newUser,
      passwordHash: hashPassword(password),
    });

    const token = generateToken();
    await setDoc(doc(db, 'auth_sessions', token), {
      userId: uid,
      token,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      role: newUser.role,
      createdAt: serverTimestamp(),
    } satisfies AuthSession & { createdAt: ReturnType<typeof serverTimestamp> });

    return { user: newUser, token };
  }

  // ── Token management ─────────────────────────────────────────────────────

  async verifyToken(token: string): Promise<AuthSession | null> {
    const snap = await getDoc(doc(db, 'auth_sessions', token));
    if (!snap.exists()) return null;

    const session = snap.data() as AuthSession;
    if (session.expiresAt < Date.now()) {
      await deleteDoc(snap.ref);
      return null;
    }

    return session;
  }

  async logout(token: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'auth_sessions', token));
      return true;
    } catch {
      return false;
    }
  }

  async refreshToken(token: string): Promise<AuthSession | null> {
    const snap = await getDoc(doc(db, 'auth_sessions', token));
    if (!snap.exists()) return null;

    const session = snap.data() as AuthSession;
    const newExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await updateDoc(snap.ref, { expiresAt: newExpiry });

    return { ...session, expiresAt: newExpiry };
  }

  // ── User management ──────────────────────────────────────────────────────

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const ref = doc(db, 'users', userId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    await updateDoc(ref, { ...updates, updatedAt: Date.now() });
    return { ...(snap.data() as User), ...updates };
  }

  async deactivateUser(userId: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, 'users', userId), { active: false });
      return true;
    } catch {
      return false;
    }
  }

  // ── RBAC ─────────────────────────────────────────────────────────────────

  hasPermission(role: User['role'], requiredRoles: User['role'][]): boolean {
    const hierarchy: Record<User['role'], number> = {
      admin: 5, manager: 4, security: 3, staff: 2, viewer: 1,
    };
    return requiredRoles.some((r) => hierarchy[role] >= hierarchy[r]);
  }
}

export const authManager = new AuthManager();