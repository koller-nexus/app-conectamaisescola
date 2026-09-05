import { NextRequest, NextResponse } from "next/server";
import { ApiError, backendVerifyEmail } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.token) {
    return NextResponse.json({ error: "Token é obrigatório" }, { status: 400 });
  }
  try {
    await backendVerifyEmail(body.token);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao verificar email." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}