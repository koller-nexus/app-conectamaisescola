import { NextResponse } from "next/server";
import { ApiError, validateInvite } from "@/lib/api";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  try {
    const invite = await validateInvite(token);
    return NextResponse.json(invite);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Convite inválido." },
      { status: error instanceof ApiError ? error.status : 404 },
    );
  }
}