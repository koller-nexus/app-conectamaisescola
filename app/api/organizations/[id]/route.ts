import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth-cookies";
import {
  getOrganization,
  updateOrganization,
  deleteOrganization,
} from "@/lib/api";

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
    const organization = await getOrganization(token, id);
    return NextResponse.json(organization);
  } catch {
    return NextResponse.json(
      { error: "Falha ao carregar organização." },
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
    return NextResponse.json(
      { error: "Corpo inválido" },
      { status: 400 },
    );
  }
  try {
    const organization = await updateOrganization(token, id, {
      name: body.name,
      legal_name: body.legal_name,
      document: body.document,
      status: body.status,
    });
    return NextResponse.json(organization);
  } catch {
    return NextResponse.json(
      { error: "Falha ao atualizar organização." },
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
    await deleteOrganization(token, id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Falha ao excluir organização." },
      { status: 500 },
    );
  }
}