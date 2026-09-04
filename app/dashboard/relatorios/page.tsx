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

const reports = [
  { titulo: "Relatório geral", periodo: "Julho/2026", tipo: "PDF", status: "Disponível" },
  { titulo: "Relatório de notas", periodo: "2º Bimestre", tipo: "PDF", status: "Disponível" },
  { titulo: "Relatório financeiro", periodo: "Julho/2026", tipo: "XLSX", status: "Gerando" },
  { titulo: "Relatório de frequência", periodo: "Junho/2026", tipo: "PDF", status: "Disponível" },
  { titulo: "Exportação de contatos", periodo: "Julho/2026", tipo: "XLSX", status: "Disponível" },
];

export default function RelatoriosPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Relatórios"
        description="Geração e exportação de relatórios institucionais."
      />

      <StatCards
        items={[
          {
            label: "Relatórios gerados",
            value: "24",
            delta: "+5",
            positive: true,
            icon: i("M4 4v16h16M8 15l3-3 3 3 5-6"),
          },
          {
            label: "Em processamento",
            value: "1",
            delta: "fila",
            positive: false,
            icon: i("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 3"),
          },
          {
            label: "Exportações PDF",
            value: "18",
            delta: "75%",
            positive: true,
            icon: i("M4 5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2V5ZM4 21h16M12 8v6M9 11l3 3 3-3"),
          },
          {
            label: "Planilhas XLSX",
            value: "6",
            delta: "25%",
            positive: true,
            icon: i("M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM9 8h6M9 12h6M9 16h4"),
          },
        ]}
      />

      <MockList
        title="Relatórios gerados"
        icon={i("M4 4v16h16M8 15l3-3 3 3 5-6")}
        searchable
        searchKeys={["titulo", "periodo", "tipo", "status"]}
        searchPlaceholder="Buscar por relatório, período ou formato…"
        columns={[
          { key: "titulo", label: "Relatório", cellClassName: "text-white font-medium" },
          { key: "periodo", label: "Período", cellClassName: "font-mono" },
          {
            key: "tipo",
            label: "Formato",
            render: (row) => {
              const tipo = String(row.tipo);
              const isPdf = tipo === "PDF";
              return (
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
                    isPdf
                      ? "border-red-500/40 bg-red-500/10 text-red-400"
                      : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {tipo}
                </span>
              );
            },
          },
          {
            key: "status",
            label: "Status",
            render: (row) => {
              const pronto = String(row.status) === "Disponível";
              return (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
                    pronto
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  <span
                    className={`h-1 w-1 rounded-full ${
                      pronto ? "bg-emerald-400" : "bg-amber-400 animate-pulse-dot"
                    }`}
                    aria-hidden="true"
                  />
                  {String(row.status)}
                </span>
              );
            },
          },
        ]}
        rows={reports}
      />
    </div>
  );
}