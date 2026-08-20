import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth-cookies";
import { getUser, updateUser, deleteUser } from "@/lib/api";

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
    const detail = await getUser(token, id);
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json(
      { error: "Falha ao carregar usuário." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Corpo inválido" }, { status: 400 });
  }
  try {
    const user = await updateUser(token, id, {
      email: body.email,
      password: body.password,
      status: body.status,
      reason: body.reason,
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Falha ao atualizar usuário." },
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
    await deleteUser(token, id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Falha ao excluir usuário." },
      { status: 500 },
    );
  }
}