import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getCsrfToken } from "@/lib/auth-cookies";
import { ApiError, createPermission, getPermissions } from "@/lib/api";

export async function GET(req: NextRequest) {
  const token = await getAuthToken();
  const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
  const pageSize = Number(req.nextUrl.searchParams.get("page_size") ?? 20);
  try {
    const permissions = await getPermissions(token, page, pageSize);
    return NextResponse.json(permissions);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao carregar permissões." },
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
  if (!body?.name || !body?.resource || !body?.action) {
    return NextResponse.json(
      { error: "Nome, recurso e ação são obrigatórios" },
      { status: 400 },
    );
  }
  try {
    const permission = await createPermission(token, csrf, {
      name: body.name,
      resource: body.resource,
      action: body.action,
    });
    return NextResponse.json(permission, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao criar permissão." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}