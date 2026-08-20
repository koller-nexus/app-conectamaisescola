import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth-cookies";
import { getCurrentUser } from "@/lib/api";

export async function GET() {
  const token = await getAuthToken();
  const user = await getCurrentUser(token);
  return NextResponse.json(user);
}
