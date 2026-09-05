"use server";

import {
  clearSessionTokens,
  getAuthToken,
  getCsrfToken,
  getRefreshToken,
  setSessionTokens,
} from "@/lib/auth-cookies";
import type { LoginResponse } from "@/lib/auth";
import { revokeSession } from "@/lib/api";

export async function persistSession(session: LoginResponse): Promise<void> {
  if (!session?.access_token || !session?.refresh_token || !session?.csrf_token)
    return;
  await setSessionTokens({
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    csrfToken: session.csrf_token,
  });
}

export async function destroySession(): Promise<void> {
  const [accessToken, refreshToken, csrfToken] = await Promise.all([
    getAuthToken(),
    getRefreshToken(),
    getCsrfToken(),
  ]);
  if (accessToken && refreshToken && csrfToken) {
    try {
      await revokeSession(accessToken, refreshToken, csrfToken);
    } catch {
      // refresh token may already be revoked (e.g. logout-all)
    }
  }
  await clearSessionTokens();
}
