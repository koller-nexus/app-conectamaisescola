import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getCsrfToken } from "@/lib/auth-cookies";
import { ApiError, createUser, getUsers } from "@/lib/api";

export async function GET(req: NextRequest) {
  const token = await getAuthToken();
  const page = Number(req.nextUrl.searchParams.get("page") ?? 1);
  const pageSize = Number(req.nextUrl.searchParams.get("page_size") ?? 20);
  try {
    const users = await getUsers(token, page, pageSize);
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao carregar usuários." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const [token, csrf] = await Promise.all([getAuthToken(), getCsrfToken()]);
  if (!token || !csrf) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.password) {
    return NextResponse.json(
      { error: "Nome, email e senha são obrigatórios" },
      { status: 400 },
    );
  }
  try {
    const user = await createUser(token, csrf, {
      name: body.name,
      last_name: body.last_name,
      email: body.email,
      password: body.password,
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof ApiError ? error.message : "Falha ao criar usuário." },
      { status: error instanceof ApiError ? error.status : 500 },
    );
  }
}