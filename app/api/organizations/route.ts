import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth-cookies";
import { getOrganizations, createOrganization } from "@/lib/api";

export async function GET() {
  const token = await getAuthToken();
  const organizations = await getOrganizations(token);
  return NextResponse.json(organizations);
}

export async function POST(req: NextRequest) {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.document) {
    return NextResponse.json(
      { error: "Nome e documento são obrigatórios" },
      { status: 400 },
    );
  }
  try {
    const organization = await createOrganization(token, {
      name: body.name,
      legal_name: body.legal_name,
      document: body.document,
    });
    return NextResponse.json(organization);
  } catch {
    return NextResponse.json(
      { error: "Falha ao criar organização." },
      { status: 500 },
    );
  }
}
