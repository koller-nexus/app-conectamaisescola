import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth-cookies";
import {
  getCurrentUser,
  getPermissions,
  getRole,
  getRolePermissions,
  isAdmin,
  type Permission,
} from "@/lib/api";
import ScreenHeader from "../../_components/screen-header";
import BackLink from "../../_components/back-link";
import RoleForm from "../role-form";
import PermissionsManager from "../permissions-manager";

export default async function PapelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  const me = await getCurrentUser(token);
  if (!isAdmin(me)) redirect("/dashboard");

  const { id } = await params;

  let role;
  let rolePermissions: { id: string }[] = [];
  let allPermissions: Permission[] = [];
  try {
    role = await getRole(token, id);
    rolePermissions = await getRolePermissions(token, id);
    const permissionsPage = await getPermissions(token, 1, 100);
    allPermissions = permissionsPage.data;
  } catch {
    redirect("/dashboard/papeis");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ScreenHeader title="Papel" description={role.name} />
        <BackLink href="/dashboard/papeis" label="Voltar para papéis" />
      </div>

      <RoleForm mode="edit" initial={role} />

      <PermissionsManager
        roleId={role.id}
        roleName={role.name}
        allPermissions={allPermissions}
        initialPermissionIds={rolePermissions.map((p) => p.id)}
      />
    </div>
  );
}