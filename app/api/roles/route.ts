import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getCsrfToken } from "@/lib/auth-cookies";
import { ApiError, createRole, getRoles } from "@/lib/api";

export async function GET(req: NextRequest) {
  const token = await getAuthToken();
  const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
  const pageSize = Number(req.nextUrl.searchParams.get("page_size") ?? 20);
  try {
    const roles = await getRoles(token, page, pageSize);
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao carregar papéis." },
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
  if (!body?.name) {
    return NextResponse.json(
      { error: "Nome é obrigatório" },
      { status: 400 },
    );
  }
  try {
    const role = await createRole(token, csrf, {
      name: body.name,
      description: body.description,
    });
    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao criar papel." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}