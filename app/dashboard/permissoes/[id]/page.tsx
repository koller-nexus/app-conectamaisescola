import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth-cookies";
import { getCurrentUser, getPermission, isAdmin } from "@/lib/api";
import ScreenHeader from "../../_components/screen-header";
import BackLink from "../../_components/back-link";
import PermissionForm from "../permission-form";

export default async function PermissaoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  const me = await getCurrentUser(token);
  if (!isAdmin(me)) redirect("/dashboard");

  const { id } = await params;

  let permission;
  try {
    permission = await getPermission(token, id);
  } catch {
    redirect("/dashboard/permissoes");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ScreenHeader title="Permissão" description={permission.name} />
        <BackLink href="/dashboard/permissoes" label="Voltar para permissões" />
      </div>

      <PermissionForm mode="edit" initial={permission} />
    </div>
  );
}