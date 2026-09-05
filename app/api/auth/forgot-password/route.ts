import { NextRequest, NextResponse } from "next/server";
import { ApiError, backendForgotPassword } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email) {
    return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
  }
  try {
    await backendForgotPassword(body.email);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao enviar email." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}