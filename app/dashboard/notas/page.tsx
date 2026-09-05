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

const grades = [
  { aluno: "Ana Clara Souza", disciplina: "Matemática", nota: 8.5, periodo: "2º Bimestre" },
  { aluno: "Bruno Lima", disciplina: "Português", nota: 7.0, periodo: "2º Bimestre" },
  { aluno: "Carla Mendes", disciplina: "Ciências", nota: 9.2, periodo: "2º Bimestre" },
  { aluno: "Diego Santos", disciplina: "História", nota: 6.8, periodo: "2º Bimestre" },
  { aluno: "Elisa Rocha", disciplina: "Matemática", nota: 5.4, periodo: "2º Bimestre" },
  { aluno: "Felipe Almeida", disciplina: "Geografia", nota: 8.1, periodo: "2º Bimestre" },
];

function notaClass(nota: number) {
  if (nota >= 7) return "text-emerald-400";
  if (nota >= 5) return "text-amber-400";
  return "text-red-400";
}

export default function NotasPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Notas & boletim"
        description="Lançamento e consulta de notas por período letivo."
      />

      <StatCards
        items={[
          {
            label: "Média geral",
            value: "7,8",
            delta: "+0,3",
            positive: true,
            icon: i("M12 4l10 5-10 5L2 9l10-5ZM6 13v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"),
          },
          {
            label: "Taxa de aprovação",
            value: "91%",
            delta: "+1,8%",
            positive: true,
            icon: i("M5 13l4 4L19 7"),
          },
          {
            label: "Turmas avaliadas",
            value: "28/32",
            delta: "2º bim",
            positive: true,
            icon: i("M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7ZM16 5v14"),
          },
          {
            label: "Provas no período",
            value: "12",
            delta: "+3",
            positive: true,
            icon: i("M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2V5ZM4 21h16"),
          },
        ]}
      />

      <MockList
        title="Notas do período"
        icon={i("M12 4l10 5-10 5L2 9l10-5ZM6 13v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5")}
        searchable
        searchKeys={["aluno", "disciplina", "periodo"]}
        searchPlaceholder="Buscar por aluno, disciplina ou período…"
        columns={[
          {
            key: "aluno",
            label: "Aluno",
            cellClassName: "text-white font-medium",
          },
          {
            key: "disciplina",
            label: "Disciplina",
            render: (row) => (
              <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-brand-accent">
                {String(row.disciplina)}
              </span>
            ),
          },
          {
            key: "nota",
            label: "Nota",
            headerClassName: "text-right",
            cellClassName: "text-right font-mono text-base font-semibold",
            render: (row) => {
              const nota = Number(row.nota);
              return <span className={notaClass(nota)}>{nota.toFixed(1)}</span>;
            },
          },
          {
            key: "periodo",
            label: "Período",
            cellClassName: "font-mono text-brand-text-secondary",
          },
        ]}
        rows={grades}
      />
    </div>
  );
}