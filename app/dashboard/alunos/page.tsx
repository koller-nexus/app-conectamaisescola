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

const students = [
  {
    id: "ALU-001",
    name: "Ana Clara Souza",
    turma: "3º Ano A",
    responsavel: "Maria Souza",
    status: "Ativo",
  },
  {
    id: "ALU-002",
    name: "Bruno Lima",
    turma: "5º Ano B",
    responsavel: "Carlos Lima",
    status: "Ativo",
  },
  {
    id: "ALU-003",
    name: "Carla Mendes",
    turma: "1º Ano A",
    responsavel: "Joana Mendes",
    status: "Ativo",
  },
  {
    id: "ALU-004",
    name: "Diego Santos",
    turma: "2º Ano B",
    responsavel: "Paulo Santos",
    status: "Inativo",
  },
  {
    id: "ALU-005",
    name: "Elisa Rocha",
    turma: "4º Ano A",
    responsavel: "Teresa Rocha",
    status: "Ativo",
  },
  {
    id: "ALU-006",
    name: "Felipe Almeida",
    turma: "6º Ano A",
    responsavel: "Rita Almeida",
    status: "Ativo",
  },
];

export default function AlunosPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Alunos"
        description="Gestão do corpo discente matriculado na instituição."
      />

      <StatCards
        items={[
          {
            label: "Alunos matriculados",
            value: "1.248",
            delta: "+3,2%",
            positive: true,
            icon: i("M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21a7 7 0 0 1 14 0"),
          },
          {
            label: "Turmas ativas",
            value: "32",
            delta: "+2",
            positive: true,
            icon: i("M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7ZM16 5v14"),
          },
          {
            label: "Taxa de frequência",
            value: "94,2%",
            delta: "+1,1%",
            positive: true,
            icon: i("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 3"),
          },
          {
            label: "Alunos ativos",
            value: "1.210",
            delta: "97%",
            positive: true,
            icon: i("M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z"),
          },
        ]}
      />

      <MockList
        title="Alunos matriculados"
        icon={i("M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21a7 7 0 0 1 14 0")}
        searchable
        searchKeys={["id", "name", "turma", "responsavel"]}
        searchPlaceholder="Buscar por nome, matrícula ou turma…"
        columns={[
          {
            key: "id",
            label: "Matrícula",
            cellClassName: "font-mono text-brand-accent",
          },
          { key: "name", label: "Nome", cellClassName: "text-white font-medium" },
          { key: "turma", label: "Turma" },
          { key: "responsavel", label: "Responsável" },
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
                      ativo ? "bg-emerald-400" : "bg-zinc-500"
                    }`}
                    aria-hidden="true"
                  />
                  <span className={ativo ? "text-emerald-400" : "text-zinc-400"}>
                    {status}
                  </span>
                </span>
              );
            },
          },
        ]}
        rows={students}
      />
    </div>
  );
}