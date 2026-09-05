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

const staff = [
  { id: "DOC-01", name: "Roberta Alves", cargo: "Professor", unidade: "Matriz" },
  { id: "DOC-02", name: "Fernanda Costa", cargo: "Diretor", unidade: "Matriz" },
  { id: "DOC-03", name: "Luciana Pires", cargo: "Coordenador", unidade: "Unidade 2" },
  { id: "DOC-04", name: "Marcos Teixeira", cargo: "Professor", unidade: "Matriz" },
  { id: "DOC-05", name: "Paula Rocha", cargo: "Secretária", unidade: "Unidade 3" },
];

function cargoClass(cargo: string) {
  switch (cargo) {
    case "Diretor":
      return "border-brand-accent/50 bg-brand-primary/15 text-brand-accent";
    case "Coordenador":
      return "border-amber-500/40 bg-amber-500/10 text-amber-400";
    case "Professor":
      return "border-brand-primary/30 bg-brand-primary/10 text-brand-accent";
    default:
      return "border-brand-border bg-black/40 text-brand-text-secondary";
  }
}

export default function CorpoDocentePage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Corpo docente"
        description="Equipe pedagógica e administrativa das unidades."
      />

      <StatCards
        items={[
          {
            label: "Total na equipe",
            value: "42",
            delta: "+3",
            positive: true,
            icon: i("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0"),
          },
          {
            label: "Professores",
            value: "28",
            delta: "66%",
            positive: true,
            icon: i("M12 4l10 5-10 5L2 9l10-5ZM6 13v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"),
          },
          {
            label: "Administrativo",
            value: "9",
            delta: "21%",
            positive: true,
            icon: i("M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2H4V6ZM4 8v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8H4ZM16 13h.01"),
          },
          {
            label: "Direção & coordenação",
            value: "5",
            delta: "12%",
            positive: true,
            icon: i("M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z"),
          },
        ]}
      />

      <MockList
        title="Corpo docente"
        icon={i("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0")}
        searchable
        searchKeys={["id", "name", "cargo", "unidade"]}
        searchPlaceholder="Buscar por nome, cargo ou unidade…"
        columns={[
          {
            key: "id",
            label: "Código",
            cellClassName: "font-mono text-brand-accent",
          },
          { key: "name", label: "Nome", cellClassName: "text-white font-medium" },
          {
            key: "cargo",
            label: "Cargo",
            render: (row) => {
              const cargo = String(row.cargo);
              return (
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${cargoClass(cargo)}`}
                >
                  {cargo}
                </span>
              );
            },
          },
          {
            key: "unidade",
            label: "Unidade",
            cellClassName: "font-mono text-brand-text-secondary",
          },
        ]}
        rows={staff}
      />
    </div>
  );
}