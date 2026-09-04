import { cookies } from "next/headers";

const AUTH_COOKIE = "access-token";
const REFRESH_COOKIE = "refresh-token";
const CSRF_COOKIE = "csrf-token";
const MAX_AGE = 60 * 60 * 8;

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE)?.value ?? null;
}

export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE)?.value ?? null;
}

export async function setSessionTokens(tokens: SessionTokens): Promise<void> {
  const cookieStore = await cookies();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  } as const;
  cookieStore.set(AUTH_COOKIE, tokens.accessToken, options);
  cookieStore.set(REFRESH_COOKIE, tokens.refreshToken, options);
  cookieStore.set(CSRF_COOKIE, tokens.csrfToken, options);
}

export async function clearSessionTokens(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
  cookieStore.delete(REFRESH_COOKIE);
  cookieStore.delete(CSRF_COOKIE);
}
