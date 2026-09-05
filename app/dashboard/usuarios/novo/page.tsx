import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/auth-cookies";
import { getCurrentUser, isAdmin } from "@/lib/api";
import ScreenHeader from "../../_components/screen-header";
import BackLink from "../../_components/back-link";
import UserForm from "../user-form";

export default async function NovoUsuarioPage() {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  const me = await getCurrentUser(token);
  if (!isAdmin(me)) redirect("/dashboard");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ScreenHeader
          title="Novo usuário"
          description="Crie uma conta de acesso para a plataforma."
        />
        <BackLink href="/dashboard/usuarios" label="Voltar para usuários" />
      </div>

      <UserForm mode="create" />
    </div>
  );
}