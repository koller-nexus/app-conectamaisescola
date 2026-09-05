import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getCsrfToken } from "@/lib/auth-cookies";
import { ApiError, deleteRole, getRole, updateRole } from "@/lib/api";

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
    const role = await getRole(token, id);
    return NextResponse.json(role);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao carregar papel." },
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
  if (!body?.name) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }
  try {
    await updateRole(token, csrf, id, {
      name: body.name,
      description: body.description,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao atualizar papel." },
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
    await deleteRole(token, csrf, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao excluir papel." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}