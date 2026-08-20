import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth-cookies";
import { updatePermission, deletePermission } from "@/lib/api";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getAuthToken();
  if (!token) {
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
    const permission = await updatePermission(token, id, {
      name: body.name,
      resource: body.resource,
      action: body.action,
      description: body.description,
    });
    return NextResponse.json(permission);
  } catch {
    return NextResponse.json(
      { error: "Falha ao atualizar permissão." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deletePermission(token, id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Falha ao excluir permissão." },
      { status: 500 },
    );
  }
}
