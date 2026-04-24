/**
 * Firebase Admin SDK — server-side only (Next.js Route Handlers)
 * Initializes once using environment variables or Application Default Credentials.
 *
 * Required env vars (add to .env.local):
 *   FIREBASE_ADMIN_CLIENT_EMAIL
 *   FIREBASE_ADMIN_PRIVATE_KEY   (with literal \n for newlines)
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID (already set for client SDK)
 *
 * On Cloud Run / GCP: use Application Default Credentials (no env vars needed).
 */

import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let _app: App | undefined;

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!;

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey  = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (clientEmail && privateKey) {
    _app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  } else {
    // Application Default Credentials (works on GCP, or locally with `gcloud auth application-default login`)
    _app = initializeApp({ projectId });
  }

  return _app;
}

/** Firestore instance (Admin SDK) — for server-only use */
export function getAdminDb() {
  return getFirestore(getAdminApp());
}

/** Auth instance (Admin SDK) — for server-only use */
export function getAdminAuth() {
  return getAuth(getAdminApp());
}
