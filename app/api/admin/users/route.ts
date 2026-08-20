import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth-cookies";
import { createAdminUser } from "@/lib/api";

export async function POST(req: NextRequest) {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password || !body?.registrationType) {
    return NextResponse.json(
      { error: "Email, senha e tipo de cadastro são obrigatórios" },
      { status: 400 },
    );
  }
  try {
    const result = await createAdminUser(token, {
      email: body.email,
      password: body.password,
      registrationType: body.registrationType,
      reason: body.reason,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Falha ao criar usuário administrador." },
      { status: 500 },
    );
  }
}