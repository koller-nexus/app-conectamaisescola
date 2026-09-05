import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth-cookies";
import {
  getCurrentUser,
  getRoles,
  getUser,
  getUserRoles,
  isAdmin,
  type Role,
} from "@/lib/api";
import ScreenHeader from "../../_components/screen-header";
import BackLink from "../../_components/back-link";
import UserForm from "../user-form";
import RolesManager from "../roles-manager";

export default async function UsuarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  const me = await getCurrentUser(token);
  if (!isAdmin(me)) redirect("/dashboard");

  const { id } = await params;

  let user;
  let userRoles: { id: string }[] = [];
  let allRoles: Role[] = [];
  try {
    user = await getUser(token, id);
    userRoles = await getUserRoles(token, id);
    const rolesPage = await getRoles(token, 1, 100);
    allRoles = rolesPage.data;
  } catch {
    redirect("/dashboard/usuarios");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ScreenHeader title="Usuário" description={user.email} />
        <BackLink href="/dashboard/usuarios" label="Voltar para usuários" />
      </div>

      <UserForm mode="edit" initial={user} />

      <RolesManager
        userId={user.id}
        userLabel={user.email}
        allRoles={allRoles}
        initialRoleIds={userRoles.map((r) => r.id)}
      />
    </div>
  );
}