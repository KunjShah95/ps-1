import type { NextRequest } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export type AppRole = "admin" | "manager" | "security" | "staff" | "viewer";

export interface AppUserProfile {
  uid: string;
  email: string | null;
  name: string | null;
  role: AppRole;
  active: boolean;
  createdAt: number;
  updatedAt?: number;
}

export interface RequireUserResult {
  uid: string;
  email: string | null;
  name: string | null;
  role: AppRole;
  profileRefPath: string;
}

function roleRank(role: AppRole): number {
  switch (role) {
    case "admin":
      return 5;
    case "manager":
      return 4;
    case "security":
      return 3;
    case "staff":
      return 2;
    case "viewer":
    default:
      return 1;
  }
}

export function hasAtLeastRole(actual: AppRole, required: AppRole): boolean {
  return roleRank(actual) >= roleRank(required);
}

function getBearerToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const token = header.replace(/^Bearer\\s+/i, "").trim();
  return token ? token : null;
}

async function getOrCreateUserProfile(uid: string, email: string | null, name: string | null) {
  const adminDb = getAdminDb();
  const ref = adminDb.collection("users").doc(uid);
  const snap = await ref.get();

  if (!snap.exists) {
    const profile: AppUserProfile = {
      uid,
      email,
      name,
      role: "viewer",
      active: true,
      createdAt: Date.now(),
    };
    await ref.set({
      ...profile,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });
    return { ref, data: profile };
  }

  const data = snap.data() as Partial<AppUserProfile> | undefined;
  const role = (data?.role as AppRole) || "viewer";
  const active = data?.active !== false;

  // Backfill missing identity fields for convenience.
  const updates: Record<string, unknown> = {};
  if (email && !data?.email) updates.email = email;
  if (name && !data?.name) updates.name = name;
  if (Object.keys(updates).length) {
    updates.updated_at = FieldValue.serverTimestamp();
    await ref.set(updates, { merge: true });
  }

  return {
    ref,
    data: {
      uid,
      email: (data?.email as string | null) ?? email,
      name: (data?.name as string | null) ?? name,
      role,
      active,
      createdAt: typeof data?.createdAt === "number" ? data.createdAt : Date.now(),
    } satisfies AppUserProfile,
  };
}

/**
 * Verify Firebase ID token and return app user context.
 * Also ensures a `users/{uid}` profile exists (default role: viewer).
 */
export async function requireFirebaseUser(
  request: NextRequest,
  minRole: AppRole = "viewer",
): Promise<RequireUserResult | null> {
  const token = getBearerToken(request);
  if (!token) return null;

  const adminAuth = getAdminAuth();
  const decoded = await adminAuth.verifyIdToken(token);

  const uid = decoded.uid;
  const email = decoded.email ?? null;
  const name = (decoded.name as string | undefined) ?? null;

  const { ref, data } = await getOrCreateUserProfile(uid, email, name);
  if (!data.active) return null;
  if (!hasAtLeastRole(data.role, minRole)) return null;

  return {
    uid,
    email: data.email ?? email,
    name: data.name ?? name,
    role: data.role,
    profileRefPath: ref.path,
  };
}

