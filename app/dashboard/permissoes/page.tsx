import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth-cookies";
import { getCurrentUser, isAdmin } from "@/lib/api";
import PermissionsClient from "./permissions-client";

export default async function PermissoesPage() {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  const me = await getCurrentUser(token);
  if (!isAdmin(me)) redirect("/dashboard");

  return <PermissionsClient />;
}
