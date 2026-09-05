import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth-cookies";
import { getCurrentUser, isAdmin } from "@/lib/api";
import ScreenHeader from "../../_components/screen-header";
import BackLink from "../../_components/back-link";
import PermissionForm from "../permission-form";

export default async function NovaPermissaoPage() {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  const me = await getCurrentUser(token);
  if (!isAdmin(me)) redirect("/dashboard");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ScreenHeader
          title="Nova permissão"
          description="Registre uma permissão reconhecida pela plataforma."
        />
        <BackLink href="/dashboard/permissoes" label="Voltar para permissões" />
      </div>

      <PermissionForm mode="create" />
    </div>
  );
}