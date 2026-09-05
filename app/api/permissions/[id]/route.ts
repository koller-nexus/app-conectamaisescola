import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getCsrfToken } from "@/lib/auth-cookies";
import { ApiError, deletePermission, getPermission, updatePermission } from "@/lib/api";

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
    const permission = await getPermission(token, id);
    return NextResponse.json(permission);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao carregar permissão." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const [token, csrf] = await Promise.all([getAuthToken(), getCsrfToken()]);
  if (!token || !csrf) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.resource || !body?.action) {
    return NextResponse.json(
      { error: "Nome, recurso e ação são obrigatórios" },
      { status: 400 },
    );
  }
  try {
    await updatePermission(token, csrf, id, {
      name: body.name,
      resource: body.resource,
      action: body.action,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao atualizar permissão." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const [token, csrf] = await Promise.all([getAuthToken(), getCsrfToken()]);
  if (!token || !csrf) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deletePermission(token, csrf, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao excluir permissão." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}