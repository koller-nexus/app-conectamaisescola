"use server";

import { setAuthToken, clearAuthToken } from "@/lib/auth-cookies";

export async function persistSession(token: string): Promise<void> {
  if (!token) return;
  await setAuthToken(token);
}

export async function destroySession(): Promise<void> {
  await clearAuthToken();
}
