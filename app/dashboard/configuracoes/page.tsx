import ScreenHeader from "../_components/screen-header";

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

const settings = [
  {
    chave: "Idioma",
    valor: "Português (Brasil)",
    tipo: "info",
    icon: i("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9S14.5 18.5 12 21c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z"),
  },
  {
    chave: "Fuso horário",
    valor: "America/Sao_Paulo",
    tipo: "mono",
    icon: i("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 3"),
  },
  {
    chave: "Tema da interface",
    valor: "Escuro",
    tipo: "info",
    icon: i("M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"),
  },
  {
    chave: "Notificações por e-mail",
    valor: "Ativadas",
    tipo: "on",
    icon: i("M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6ZM10 20a2 2 0 0 0 4 0"),
  },
  {
    chave: "Notificações push",
    valor: "Ativadas",
    tipo: "on",
    icon: i("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5M9 4v.01M15 4v.01"),
  },
  {
    chave: "Relatórios automáticos",
    valor: "Mensal",
    tipo: "info",
    icon: i("M4 4v16h16M8 15l3-3 3 3 5-6"),
  },
];

export default function ConfiguracoesPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Configurações"
        description="Preferências gerais da plataforma."
      />

      <div className="card card-accent overflow-hidden animate-rise">
        <div className="flex items-center gap-3 border-b border-brand-border bg-black/20 px-5 py-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-border bg-gradient-to-b from-brand-accent/15 to-transparent text-brand-accent">
            {i("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z")}
          </span>
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse-dot"
            />
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
              Preferências
            </h2>
          </div>
        </div>

        <ul className="flex flex-col divide-y divide-brand-border/60">
          {settings.map((setting) => (
            <li
              key={setting.chave}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-brand-primary/[0.04]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-border bg-black/40 text-brand-accent">
                {setting.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">
                  {setting.chave}
                </p>
              </div>
              {setting.tipo === "on" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] text-emerald-400">
                  <span
                    className="h-1 w-1 rounded-full bg-emerald-400"
                    aria-hidden="true"
                  />
                  {setting.valor}
                </span>
              ) : (
                <span
                  className={`rounded-full border border-brand-border bg-black/40 px-2.5 py-1 text-xs ${
                    setting.tipo === "mono"
                      ? "font-mono text-brand-text-secondary"
                      : "text-brand-text-secondary"
                  }`}
                >
                  {setting.valor}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}