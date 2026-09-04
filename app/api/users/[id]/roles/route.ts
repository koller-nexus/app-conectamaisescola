import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getCsrfToken } from "@/lib/auth-cookies";
import { ApiError, assignUserRoles, getUserRoles } from "@/lib/api";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const roles = await getUserRoles(token, id);
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao carregar papéis." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const [token, csrf] = await Promise.all([getAuthToken(), getCsrfToken()]);
  if (!token || !csrf) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!Array.isArray(body?.role_ids)) {
    return NextResponse.json(
      { error: "role_ids é obrigatório" },
      { status: 400 },
    );
  }
  try {
    await assignUserRoles(token, csrf, id, body.role_ids);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao atribuir papéis." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}