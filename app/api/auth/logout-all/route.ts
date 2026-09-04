import { NextResponse } from "next/server";
import { getAuthToken, getCsrfToken } from "@/lib/auth-cookies";
import { ApiError, revokeAllSessions } from "@/lib/api";

export async function POST() {
  const [token, csrf] = await Promise.all([getAuthToken(), getCsrfToken()]);
  if (!token || !csrf) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  try {
    await revokeAllSessions(token, csrf);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao encerrar sessões." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}