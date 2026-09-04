"use client";

import ScreenHeader from "../_components/screen-header";
import MockList from "../_components/mock-list";
import StatCards from "../_components/stat-cards";

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

const schools = [
  {
    id: "ESC-01",
    code: "EMEF-01",
    name: "Colégio Conecta Mais",
    type: "Matriz",
    principal: "Fernanda Costa",
    alunos: "890",
    status: "Ativo",
  },
  {
    id: "ESC-02",
    code: "EMEI-02",
    name: "Escola Infantil Alegria",
    type: "Unidade 2",
    principal: "Ricardo Dias",
    alunos: "358",
    status: "Ativo",
  },
  {
    id: "ESC-03",
    code: "EMEF-03",
    name: "Núcleo Conecta Mais Oeste",
    type: "Unidade 3",
    principal: "Sandra Lopes",
    alunos: "420",
    status: "Em configuração",
  },
];

export default function EscolasPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Escolas"
        description="Unidades escolares da rede."
      />

      <StatCards
        items={[
          {
            label: "Unidades",
            value: "3",
            delta: "+1",
            positive: true,
            icon: i("M3 21h18M5 21V9l7-4 7 4v12M9 21v-6h6v6"),
          },
          {
            label: "Alunos na rede",
            value: "1.668",
            delta: "+5,4%",
            positive: true,
            icon: i("M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21a7 7 0 0 1 14 0"),
          },
          {
            label: "Colaboradores",
            value: "96",
            delta: "+7",
            positive: true,
            icon: i("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0"),
          },
          {
            label: "Ocupação média",
            value: "87%",
            delta: "+2,3%",
            positive: true,
            icon: i("M4 20V10M10 20V4M16 20v-7M22 20H2"),
          },
        ]}
      />

      <MockList
        title="Unidades escolares"
        icon={i("M3 21h18M5 21V9l7-4 7 4v12M9 21v-6h6v6")}
        searchable
        searchKeys={["code", "name", "type", "principal"]}
        searchPlaceholder="Buscar por nome, código ou diretor(a)…"
        columns={[
          {
            key: "code",
            label: "Código",
            cellClassName: "font-mono text-brand-accent",
          },
          { key: "name", label: "Nome", cellClassName: "text-white font-medium" },
          {
            key: "type",
            label: "Tipo",
            render: (row) => (
              <span className="rounded-full border border-brand-border bg-black/40 px-2.5 py-0.5 font-mono text-[11px] text-brand-text-secondary">
                {String(row.type)}
              </span>
            ),
          },
          { key: "principal", label: "Diretor(a)" },
          {
            key: "alunos",
            label: "Alunos",
            cellClassName: "font-mono",
          },
          {
            key: "status",
            label: "Status",
            render: (row) => {
              const status = String(row.status);
              const ativo = status === "Ativo";
              return (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      ativo
                        ? "bg-emerald-400"
                        : status === "Em configuração"
                          ? "bg-amber-400"
                          : "bg-zinc-500"
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={
                      ativo
                        ? "text-emerald-400"
                        : status === "Em configuração"
                          ? "text-amber-400"
                          : "text-zinc-400"
                    }
                  >
                    {status}
                  </span>
                </span>
              );
            },
          },
        ]}
        rows={schools}
      />
    </div>
  );
}