import ScreenHeader from "../_components/screen-header";

interface PerfilProps {
  me: {
    user: {
      name: string;
      last_name: string;
      email: string;
      active: boolean;
      email_verified_at: string | null;
    };
    roles: { name: string }[];
  };
}

function initialsOf(email: string): string {
  const local = email.split("@")[0] ?? "";
  const parts = local.replace(/[._-]+/g, " ").trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function ProfileForm({ me }: PerfilProps) {
  const fullName = `${me.user.name}${me.user.last_name ? ` ${me.user.last_name}` : ""}`;

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Meu perfil"
        description="Dados da sua conta e informações institucionais."
      />

      <div className="card card-accent overflow-hidden animate-rise">
        <div className="flex flex-col gap-4 border-b border-brand-border bg-black/20 px-6 py-6 sm:flex-row sm:items-center sm:gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent text-xl font-semibold text-white shadow-glow">
            {initialsOf(me.user.email)}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold tracking-tight text-white">
              {fullName}
            </h2>
            <p className="mt-0.5 truncate text-sm text-brand-text-secondary">
              {me.user.email}
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {me.roles.length > 0 ? (
                me.roles.map((role) => (
                  <span
                    key={role.name}
                    className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-brand-accent"
                  >
                    {role.name}
                  </span>
                ))
              ) : (
                <span className="text-sm text-brand-text-secondary">—</span>
              )}
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-6 px-6 py-6 sm:grid-cols-2">
          <div className="rounded-lg border border-brand-border bg-black/40 p-4">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Nome completo
            </dt>
            <dd className="mt-1 text-sm text-white">{fullName}</dd>
          </div>
          <div className="rounded-lg border border-brand-border bg-black/40 p-4">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Email
            </dt>
            <dd className="mt-1 break-all text-sm text-white">
              {me.user.email}
            </dd>
          </div>
          <div className="rounded-lg border border-brand-border bg-black/40 p-4">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Papéis
            </dt>
            <dd className="mt-1 text-sm text-white">
              {me.roles.map((r) => r.name).join(", ") || "—"}
            </dd>
          </div>
          <div className="rounded-lg border border-brand-border bg-black/40 p-4">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Status da conta
            </dt>
            <dd className="mt-1 text-sm text-white">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    me.user.active ? "bg-emerald-400" : "bg-zinc-500"
                  }`}
                  aria-hidden="true"
                />
                {me.user.active ? "Ativo" : "Inativo"}
              </span>
            </dd>
          </div>
          <div className="rounded-lg border border-brand-border bg-black/40 p-4">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Email verificado
            </dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
                  me.user.email_verified_at
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                }`}
              >
                <span
                  className={`h-1 w-1 rounded-full ${
                    me.user.email_verified_at
                      ? "bg-emerald-400"
                      : "bg-amber-400 animate-pulse-dot"
                  }`}
                  aria-hidden="true"
                />
                {me.user.email_verified_at ? "Confirmado" : "Pendente"}
              </span>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}