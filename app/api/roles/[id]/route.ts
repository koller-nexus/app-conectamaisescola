import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth-cookies";
import { updateRole, deleteRole } from "@/lib/api";

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
  if (!body?.code || !body?.name) {
    return NextResponse.json(
      { error: "Código e nome são obrigatórios" },
      { status: 400 },
    );
  }
  try {
    const role = await updateRole(token, id, {
      code: body.code,
      name: body.name,
      description: body.description,
      permissions: body.permissions,
    });
    return NextResponse.json(role);
  } catch {
    return NextResponse.json(
      { error: "Falha ao atualizar papel." },
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
    await deleteRole(token, id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Falha ao excluir papel." },
      { status: 500 },
    );
  }
}
