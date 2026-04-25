"use client";

type ApiFetchOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

async function getIdToken(): Promise<string> {
  const { auth } = await import("@/lib/firebase");
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  return await user.getIdToken();
}

export async function apiFetch<T = unknown>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const token = await getIdToken();

  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  const data: unknown = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const maybeObj = (data && typeof data === "object") ? (data as Record<string, unknown>) : {};
    const msg =
      (typeof maybeObj.error === "string" && maybeObj.error) ||
      (typeof maybeObj.message === "string" && maybeObj.message) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return data as T;
}

