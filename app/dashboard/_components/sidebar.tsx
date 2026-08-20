"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

function icon(d: string) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4 shrink-0"
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

const ICONS = {
  users: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21a7 7 0 0 1 14 0",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
  school: "M3 21h18M5 21V9l7-4 7 4v12M9 21v-6h6v6",
  book: "M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2V5ZM4 21h16",
  grades: "M4 19V5a2 2 0 0 1 2-2h13v16M9 9h6M9 13h6M4 21h16",
  staff: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 21a7 7 0 0 1 14 0",
  apple: "M12 3c.5-1.5 2-2.5 3.5-2.5 0 2-1 3-2.5 3.5C12 4 11.5 3.5 12 3ZM8 8c0-1.5 1-2.5 2-3 1.5-1 3-1 4.5-1M12 5c-1-1.5-3-2-4.5-2-1 1-1.5 3-.5 4.5",
  finance: "M12 3v18M5 8h14M7 8c0-2 2-3 5-3s5 1 5 3c0 2-2 3-5 3S7 10 7 8ZM4 13h16M6 13c0 2 2 3 6 3s6-1 6-3",
  report: "M4 4v16h16M8 15l3-3 3 3 5-6",
  wall: "M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5ZM8 8h8M8 12h8M8 16h5",
  calendar: "M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7ZM16 3v4M8 3v4M4 11h16",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 21a7 7 0 0 1 14 0",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5h0a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z",
  shield: "M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z",
  dashboard:
    "M4 4h7v7H4V4ZM13 4h7v4h-7V4ZM13 10h7v10h-7V10ZM4 13h7v7H4v-7Z",
};

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sections: NavSection[] = [
    {
      title: "Principal",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: icon(ICONS.dashboard) },
        { label: "Mural social", href: "/dashboard/mural", icon: icon(ICONS.wall) },
        { label: "Agenda & calendário", href: "/dashboard/agenda", icon: icon(ICONS.calendar) },
      ],
    },
    {
      title: "Acadêmico",
      items: [
        { label: "Alunos", href: "/dashboard/alunos", icon: icon(ICONS.users) },
        { label: "Professores", href: "/dashboard/professores", icon: icon(ICONS.staff) },
        { label: "Escolas", href: "/dashboard/escolas", icon: icon(ICONS.school) },
        { label: "Notas & boletim", href: "/dashboard/notas", icon: icon(ICONS.grades) },
        { label: "Corpo docente", href: "/dashboard/corpo-docente", icon: icon(ICONS.book) },
      ],
    },
    {
      title: "Nutrição",
      items: [
        { label: "Cardápio & alergias", href: "/dashboard/cardapio", icon: icon(ICONS.apple) },
      ],
    },
    {
      title: "Gestão",
      items: [
        { label: "Financeiro & NF-e", href: "/dashboard/financeiro", icon: icon(ICONS.finance) },
        { label: "Relatórios", href: "/dashboard/relatorios", icon: icon(ICONS.report) },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: "Administração",
            items: [
              { label: "Papéis", href: "/dashboard/papeis", icon: icon(ICONS.shield) },
              { label: "Permissões", href: "/dashboard/permissões", icon: icon(ICONS.settings) },
              { label: "Usuários", href: "/dashboard/usuarios", icon: icon(ICONS.users) },
            ],
          } as NavSection,
        ]
      : []),
    {
      title: "Sistema",
      items: [
        { label: "Meu perfil", href: "/dashboard/perfil", icon: icon(ICONS.profile) },
        { label: "Configurações", href: "/dashboard/configuracoes", icon: icon(ICONS.settings) },
      ],
    },
  ];

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-brand-border bg-brand-surface lg:flex ${
        collapsed ? "w-16" : "w-64"
      } transition-[width] duration-200`}
    >
      <div className="flex h-16 items-center gap-2.5 border-b border-brand-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-border bg-black/40">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 text-brand-accent"
            aria-hidden="true"
          >
            <path
              d="M4 6.5c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8.5L4 21.5V6.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        {!collapsed && (
          <span className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
            Conecta<span className="text-brand-accent">Mais</span>Escola
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-5">
            {!collapsed && (
              <p className="mb-1.5 px-2 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                {section.title}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                        collapsed ? "justify-center" : ""
                      } ${
                        active
                          ? "bg-brand-primary/15 text-white"
                          : "text-brand-text-secondary hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.icon}
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-brand-border p-3">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-2.5 py-2 text-sm text-brand-text-secondary transition-colors hover:bg-white/5 hover:text-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
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
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </aside>
  );
}
