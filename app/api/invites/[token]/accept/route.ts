import { NextRequest, NextResponse } from "next/server";
import { acceptInvite, ApiError } from "@/lib/api";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.password) {
    return NextResponse.json(
      { error: "Defina uma senha para concluir o cadastro" },
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
    const result = await acceptInvite(token, body.password);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao aceitar convite." },
      { status: error instanceof ApiError ? error.status : 400 },
    );
  }
}