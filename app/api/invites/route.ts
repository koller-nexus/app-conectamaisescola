import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getCsrfToken } from "@/lib/auth-cookies";
import { ApiError, createInvite, getInvites } from "@/lib/api";

export async function GET(req: NextRequest) {
  const token = await getAuthToken();
  const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
  const pageSize = Number(req.nextUrl.searchParams.get("page_size") ?? 20);
  try {
    const invites = await getInvites(token, page, pageSize);
    return NextResponse.json(invites);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao carregar convites." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const [token, csrf] = await Promise.all([getAuthToken(), getCsrfToken()]);
  if (!token || !csrf) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.role_id) {
    return NextResponse.json(
      { error: "Email e papel são obrigatórios" },
      { status: 400 },
    );
  }
  try {
    const invite = await createInvite(token, csrf, {
      email: body.email,
      role_id: body.role_id,
    });
    return NextResponse.json(invite, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao criar convite." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}