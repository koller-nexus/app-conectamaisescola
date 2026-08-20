import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth-cookies";
import { getCurrentUser, isAdmin } from "@/lib/api";
import OrganizationsClient from "./organizations-client";

export default async function OrganizacoesPage() {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  const me = await getCurrentUser(token);
  if (!isAdmin(me)) redirect("/dashboard");

  return <OrganizationsClient />;
}