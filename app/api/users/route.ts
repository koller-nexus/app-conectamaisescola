import { NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth-cookies";
import { getUsers } from "@/lib/api";

export async function GET() {
  const token = await getAuthToken();
  const users = await getUsers(token);
  return NextResponse.json(users);
}
