import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth-cookies";
import { getCurrentUser, isAdmin } from "@/lib/api";
import ScreenHeader from "../../_components/screen-header";
import BackLink from "../../_components/back-link";
import RoleForm from "../role-form";

export default async function NovoPapelPage() {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  const me = await getCurrentUser(token);
  if (!isAdmin(me)) redirect("/dashboard");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ScreenHeader
          title="Novo papel"
          description="Crie um papel de acesso para a plataforma."
        />
        <BackLink href="/dashboard/papeis" label="Voltar para papéis" />
      </div>

      <RoleForm mode="create" />
    </div>
  );
}