import Link from "next/link";

interface Indicator {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
}

const indicators: Indicator[] = [
  { label: "Alunos matriculados", value: "1.248", delta: "+3,2%", positive: true },
  { label: "Faturamento mensal", value: "R$ 482,5k", delta: "+8,1%", positive: true },
  { label: "Inadimplência", value: "4,6%", delta: "-0,4%", positive: true },
  { label: "Média pedagógica", value: "7,8", delta: "+0,3", positive: true },
];

const quickActions = [
  { label: "Exportar relatório geral", href: "/dashboard/relatorios" },
  { label: "Financeiro & NF-e", href: "/dashboard/financeiro" },
  { label: "Papéis", href: "/dashboard/papeis" },
  { label: "Permissões", href: "/dashboard/permissoes" },
];

const events = [
  {
    day: "14",
    month: "mai",
    title: "Semana de leitura",
    description: "Todas as turmas · Pátio central",
  },
  {
    day: "09",
    month: "mai",
    title: "Apresentação dia das mães",
    description: "Educação infantil e Fund I",
  },
];

const announcements = [
  {
    title: "Reunião geral",
    description: "Pais e responsáveis · Auditório principal",
    pushEmail: true,
  },
  {
    title: "Feira de ciências 2026",
    description: "Inscrições abertas para todas as turmas",
    pushEmail: false,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-white">
          Visão geral
        </h1>
        <p className="mt-1 text-sm text-brand-text-secondary">
          Acompanhe os indicadores e a rotina da sua instituição.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {indicators.map((ind) => (
          <div
            key={ind.label}
            className="rounded-lg border border-brand-border bg-brand-surface p-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-wide text-brand-text-secondary">
              {ind.label}
            </p>
            <div className="mt-2 flex items-end justify-between gap-2">
              <p className="text-3xl font-medium text-white">{ind.value}</p>
              {ind.delta && (
                <span
                  className={`rounded-md px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                    ind.positive
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {ind.delta}
                </span>
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
              Ações rápidas
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center justify-between rounded-lg border border-brand-border bg-black/40 px-4 py-3 text-sm text-brand-text-secondary transition-colors hover:border-brand-accent/50 hover:text-white"
                >
                  {action.label}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M9 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
                Últimos comunicados
              </h2>
              <Link
                href="/dashboard/mural"
                className="rounded text-sm font-medium text-brand-accent transition-colors hover:text-white"
              >
                Acessar mural completo
              </Link>
            </div>
            <ul className="mt-4 flex flex-col divide-y divide-brand-border">
              {announcements.map((ann) => (
                <li key={ann.title} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {ann.title}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-brand-text-secondary">
                      {ann.description}
                    </p>
                  </div>
                  {ann.pushEmail && (
                    <span className="shrink-0 rounded-md border border-brand-border bg-black/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
                      Push + e-mail
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
              Alergias e nutrição ativa
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              <div className="rounded-lg border border-brand-border bg-black/40 p-4">
                <p className="font-mono text-[11px] uppercase tracking-wide text-brand-text-secondary">
                  Almoço hoje
                </p>
                <p className="mt-1 text-2xl font-medium text-white">19/08</p>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="font-mono text-[11px] uppercase tracking-wide text-amber-400">
                  Atenção nutricional crítica
                </p>
                <p className="mt-1 text-sm text-white">
                  3 alunos com restrições no cardápio de hoje.
                </p>
              </div>
              <Link
                href="/dashboard/cardapio"
                className="flex h-10 items-center justify-center rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover"
              >
                Gerenciar cardápio
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-brand-border bg-brand-surface p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
                Próximos eventos
              </h2>
              <Link
                href="/dashboard/agenda"
                className="rounded text-sm font-medium text-brand-accent transition-colors hover:text-white"
              >
                Ver calendário
              </Link>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {events.map((ev) => (
                <li
                  key={ev.title}
                  className="flex items-center gap-3 rounded-lg border border-brand-border bg-black/40 p-3"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-brand-border bg-brand-surface">
                    <span className="text-lg font-semibold leading-none text-white">
                      {ev.day}
                    </span>
                    <span className="mt-0.5 font-mono text-[10px] uppercase text-brand-accent">
                      {ev.month}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {ev.title}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-brand-text-secondary">
                      {ev.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
