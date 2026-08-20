import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth-cookies";
import { getRoles, createRole } from "@/lib/api";

export async function GET() {
  const token = await getAuthToken();
  const roles = await getRoles(token);
  return NextResponse.json(roles);
}

export async function POST(req: NextRequest) {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.code || !body?.name) {
    return NextResponse.json(
      { error: "Código e nome são obrigatórios" },
      { status: 400 },
    );
  }
  try {
    const role = await createRole(token, {
      code: body.code,
      name: body.name,
      description: body.description,
      permissions: body.permissions,
    });
    return NextResponse.json(role);
  } catch {
    return NextResponse.json(
      { error: "Falha ao criar papel." },
      { status: 500 },
    );
  }
}
