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

const teachers = [
  {
    id: "PROF-01",
    name: "Roberta Alves",
    disciplina: "Matemática",
    email: "roberta@escola.com",
    status: "Ativo",
  },
  {
    id: "PROF-02",
    name: "José Ferreira",
    disciplina: "História",
    email: "jose@escola.com",
    status: "Ativo",
  },
  {
    id: "PROF-03",
    name: "Paula Rocha",
    disciplina: "Ciências",
    email: "paula@escola.com",
    status: "Ativo",
  },
  {
    id: "PROF-04",
    name: "Marcos Teixeira",
    disciplina: "Português",
    email: "marcos@escola.com",
    status: "Inativo",
  },
];

export default function ProfessoresPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Professores"
        description="Corpo docente e disciplinas lecionadas."
      />

      <StatCards
        items={[
          {
            label: "Professores",
            value: "84",
            delta: "+4",
            positive: true,
            icon: i("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0"),
          },
          {
            label: "Disciplinas",
            value: "14",
            delta: "+1",
            positive: true,
            icon: i("M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2V5ZM4 21h16"),
          },
          {
            label: "Carga média",
            value: "22h",
            delta: "semana",
            positive: true,
            icon: i("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 3"),
          },
          {
            label: "Pós-graduação",
            value: "36%",
            delta: "31 profs",
            positive: true,
            icon: i("M12 4l10 5-10 5L2 9l10-5ZM6 13v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"),
          },
        ]}
      />

      <MockList
        title="Professores"
        icon={i("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0")}
        searchable
        searchKeys={["id", "name", "disciplina", "email"]}
        searchPlaceholder="Buscar por nome, disciplina ou email…"
        columns={[
          {
            key: "id",
            label: "Código",
            cellClassName: "font-mono text-brand-accent",
          },
          { key: "name", label: "Nome", cellClassName: "text-white font-medium" },
          {
            key: "disciplina",
            label: "Disciplina",
            render: (row) => (
              <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-brand-accent">
                {String(row.disciplina)}
              </span>
            ),
          },
          { key: "email", label: "Email" },
          {
            key: "status",
            label: "Status",
            render: (row) => {
              const ativo = String(row.status) === "Ativo";
              return (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      ativo ? "bg-emerald-400" : "bg-zinc-500"
                    }`}
                    aria-hidden="true"
                  />
                  <span className={ativo ? "text-emerald-400" : "text-zinc-400"}>
                    {String(row.status)}
                  </span>
                </span>
              );
            },
          },
        ]}
        rows={teachers}
      />
    </div>
  );
}