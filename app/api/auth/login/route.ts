import { NextRequest, NextResponse } from "next/server";
import { ApiError, backendLogin } from "@/lib/api";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { error: "Email e senha são obrigatórios" },
      { status: 400 },
    );
  }
  try {
    const session = await backendLogin(body.email, body.password);
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof ApiError ? error.message : "Falha na autenticação.",
        code: error instanceof ApiError ? error.code : undefined,
      },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}