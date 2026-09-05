import Link from "next/link";

interface Indicator {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  icon: React.ReactNode;
  spark: number[];
}

function i(d: string) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const indicators: Indicator[] = [
  {
    label: "Alunos matriculados",
    value: "1.248",
    delta: "+3,2%",
    positive: true,
    icon: i("M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21a7 7 0 0 1 14 0"),
    spark: [35, 42, 40, 48, 55, 52, 62, 70],
  },
  {
    label: "Faturamento mensal",
    value: "R$ 482,5k",
    delta: "+8,1%",
    positive: true,
    icon: i("M12 3v18M5 8h14M7 8c0-2 2-3 5-3s5 1 5 3c0 2-2 3-5 3S7 10 7 8ZM4 13h16M6 13c0 2 2 3 6 3s6-1 6-3"),
    spark: [45, 48, 44, 52, 58, 55, 66, 78],
  },
  {
    label: "Inadimplência",
    value: "4,6%",
    delta: "-0,4%",
    positive: true,
    icon: i("M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"),
    spark: [80, 74, 68, 70, 62, 58, 54, 50],
  },
  {
    label: "Média pedagógica",
    value: "7,8",
    delta: "+0,3",
    positive: true,
    icon: i("M4 19V5a2 2 0 0 1 2-2h13v16M9 8h6M9 12h6M6 21h16"),
    spark: [50, 55, 52, 60, 62, 66, 70, 74],
  },
];

const quickActions = [
  {
    label: "Exportar relatório geral",
    href: "/dashboard/relatorios",
    icon: i("M4 4v16h16M8 15l3-3 3 3 5-6"),
  },
  {
    label: "Financeiro & NF-e",
    href: "/dashboard/financeiro",
    icon: i("M12 3v18M5 8h14M7 8c0-2 2-3 5-3s5 1 5 3c0 2-2 3-5 3S7 10 7 8ZM4 13h16M6 13c0 2 2 3 6 3s6-1 6-3"),
  },
  {
    label: "Papéis",
    href: "/dashboard/papeis",
    icon: i("M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z"),
  },
  {
    label: "Permissões",
    href: "/dashboard/permissoes",
    icon: i("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"),
  },
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

function Sparkline({ values }: { values: number[] }) {
  return (
    <div className="mt-3 flex h-8 items-end gap-1" aria-hidden="true">
      {values.map((height, i) => (
        <span
          key={i}
          className={`w-full rounded-sm ${
            i === values.length - 1
              ? "bg-gradient-to-t from-brand-primary to-brand-accent"
              : "bg-brand-primary/25"
          }`}
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="animate-rise">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot"
          />
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-text-secondary">
            Painel institucional
          </p>
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          Visão geral
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-brand-text-secondary">
          Acompanhe os indicadores e a rotina da sua instituição.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {indicators.map((ind, index) => (
          <div
            key={ind.label}
            className="card card-accent card-hover p-5 animate-rise"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-mono text-[11px] uppercase tracking-wide text-brand-text-secondary">
                {ind.label}
              </p>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand-border bg-black/40 text-brand-accent">
                {ind.icon}
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-2">
              <p className="text-3xl font-semibold tracking-tight text-white">
                {ind.value}
              </p>
              {ind.delta && (
                <span
                  className={`mb-1 rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold ${
                    ind.positive
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {ind.delta}
                </span>
              )}
            </div>
            <Sparkline values={ind.spark} />
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="card card-accent p-5 animate-rise">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse-dot"
              />
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
                Ações rápidas
              </h2>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="group flex items-center gap-3 rounded-lg border border-brand-border bg-black/40 px-4 py-3 text-sm text-brand-text-secondary transition-all hover:border-brand-accent/50 hover:bg-brand-primary/5 hover:text-white"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand-border bg-brand-surface text-brand-accent transition-colors group-hover:border-brand-accent/40">
                    {action.icon}
                  </span>
                  <span className="flex-1 truncate font-medium">
                    {action.label}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-4 w-4 shrink-0 text-zinc-600 transition-all group-hover:translate-x-0.5 group-hover:text-brand-accent"
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

          <div className="card card-accent p-5 animate-rise">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse-dot"
                />
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
                  Últimos comunicados
                </h2>
              </div>
              <Link
                href="/dashboard/mural"
                className="rounded font-medium text-sm text-brand-accent transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                Acessar mural completo
              </Link>
            </div>
            <ul className="mt-4 flex flex-col divide-y divide-brand-border/60">
              {announcements.map((ann) => (
                <li
                  key={ann.title}
                  className="flex items-center justify-between gap-4 py-3.5 transition-colors hover:bg-brand-primary/[0.04]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {ann.title}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-brand-text-secondary">
                      {ann.description}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${
                      ann.pushEmail
                        ? "border border-brand-primary/30 bg-brand-primary/10 text-brand-accent"
                        : "border border-brand-border bg-black/40 text-brand-text-secondary"
                    }`}
                  >
                    {ann.pushEmail ? "Push + e-mail" : "Mural"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="card card-accent p-5 animate-rise">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse-dot"
              />
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
                Alergias e nutrição ativa
              </h2>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg border border-brand-border bg-black/40 p-4">
                <p className="font-mono text-[11px] uppercase tracking-wide text-brand-text-secondary">
                  Almoço hoje
                </p>
                <p className="text-2xl font-semibold tracking-tight text-white">
                  19/08
                </p>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse-dot"
                  />
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-wide text-amber-400">
                    Atenção nutricional crítica
                  </p>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-white">
                  3 alunos com restrições no cardápio de hoje.
                </p>
              </div>
              <Link
                href="/dashboard/cardapio"
                className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                Gerenciar cardápio
              </Link>
            </div>
          </div>

          <div className="card card-accent p-5 animate-rise">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse-dot"
                />
                <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
                  Próximos eventos
                </h2>
              </div>
              <Link
                href="/dashboard/agenda"
                className="rounded font-medium text-sm text-brand-accent transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                Ver calendário
              </Link>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {events.map((ev) => (
                <li
                  key={ev.title}
                  className="flex items-center gap-3 rounded-lg border border-brand-border bg-black/40 p-3 transition-colors hover:border-brand-accent/40 hover:bg-brand-primary/5"
                >
                  <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-brand-border bg-gradient-to-b from-brand-accent/15 to-transparent">
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