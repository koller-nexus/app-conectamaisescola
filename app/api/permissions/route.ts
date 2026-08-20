import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth-cookies";
import { getPermissions, createPermission } from "@/lib/api";

export async function GET() {
  const token = await getAuthToken();
  const permissions = await getPermissions(token);
  return NextResponse.json(permissions);
}

export async function POST(req: NextRequest) {
  const token = await getAuthToken();
  if (!token) {
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
    const permission = await createPermission(token, {
      name: body.name,
      resource: body.resource,
      action: body.action,
      description: body.description,
    });
    return NextResponse.json(permission);
  } catch {
    return NextResponse.json(
      { error: "Falha ao criar permissão." },
      { status: 500 },
    );
  }
}
