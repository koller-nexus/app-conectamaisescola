import { NextRequest, NextResponse } from "next/server";
import { ApiError, backendResetPassword } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.token || !body?.password) {
    return NextResponse.json(
      { error: "Token e senha são obrigatórios" },
      { status: 400 },
    );
  }
  if (body.password.length < 8) {
    return NextResponse.json(
      { error: "A senha deve ter pelo menos 8 caracteres" },
      { status: 400 },
    );
  }
  try {
    await backendResetPassword(body.token, body.password);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao redefinir senha." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}