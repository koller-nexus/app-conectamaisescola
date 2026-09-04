import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth-cookies";
import { ApiError, getCurrentUser } from "@/lib/api";

export async function GET() {
  const token = await getAuthToken();
  try {
    const user = await getCurrentUser(token);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao carregar usuário." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}