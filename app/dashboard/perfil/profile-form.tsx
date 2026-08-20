"use client";

import ScreenHeader from "../_components/screen-header";

interface PerfilProps {
  me: {
    user: { email: string; emailVerified: boolean; status: string };
    roles: { name: string }[];
  };
}

export default function ProfileForm({ me }: PerfilProps) {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Meu perfil"
        description="Dados da sua conta e informações institucionais."
      />
      <div className="rounded-lg border border-brand-border bg-brand-surface p-6">
        <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Email
            </dt>
            <dd className="mt-1 text-sm text-white">{me.user.email}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Papéis
            </dt>
            <dd className="mt-1 text-sm text-white">
              {me.roles.map((r) => r.name).join(", ")}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Status
            </dt>
            <dd className="mt-1 text-sm text-white">{me.user.status}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Email verificado
            </dt>
            <dd className="mt-1 text-sm text-white">
              {me.user.emailVerified ? "Sim" : "Não"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
