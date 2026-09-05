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

const invoices = [
  { mes: "Julho/2026", faturamento: "R$ 482.500", inadimplencia: "4,6%", nf: "NF-e 0042" },
  { mes: "Junho/2026", faturamento: "R$ 446.200", inadimplencia: "5,0%", nf: "NF-e 0041" },
  { mes: "Maio/2026", faturamento: "R$ 431.800", inadimplencia: "5,3%", nf: "NF-e 0040" },
  { mes: "Abril/2026", faturamento: "R$ 419.600", inadimplencia: "5,8%", nf: "NF-e 0039" },
];

function inadimplenciaClass(v: string) {
  const num = parseFloat(v.replace(",", "."));
  if (num <= 4.8) return "text-emerald-400";
  if (num <= 5.4) return "text-amber-400";
  return "text-red-400";
}

export default function FinanceiroPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Financeiro & NF-e"
        description="Faturamento, inadimplência e notas fiscais eletrônicas."
      />

      <StatCards
        items={[
          {
            label: "Faturamento do mês",
            value: "R$ 482,5k",
            delta: "+8,1%",
            positive: true,
            icon: i("M12 3v18M5 8h14M7 8c0-2 2-3 5-3s5 1 5 3c0 2-2 3-5 3S7 10 7 8ZM4 13h16M6 13c0 2 2 3 6 3s6-1 6-3"),
          },
          {
            label: "Inadimplência",
            value: "4,6%",
            delta: "-0,4%",
            positive: true,
            icon: i("M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"),
          },
          {
            label: "NF-e emitidas",
            value: "42",
            delta: "+6",
            positive: true,
            icon: i("M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM9 8h6M9 12h6M9 16h4"),
          },
          {
            label: "Repasses realizados",
            value: "12",
            delta: "este mês",
            positive: true,
            icon: i("M4 4v6h6M20 20v-6h-6M4 10a8 8 0 0 1 14-3l2 2M20 14a8 8 0 0 1-14 3l-2-2"),
          },
        ]}
      />

      <MockList
        title="Fechamentos mensais"
        icon={i("M12 3v18M5 8h14M7 8c0-2 2-3 5-3s5 1 5 3c0 2-2 3-5 3S7 10 7 8ZM4 13h16M6 13c0 2 2 3 6 3s6-1 6-3")}
        searchable
        searchKeys={["mes", "nf"]}
        searchPlaceholder="Buscar por mês ou nota fiscal…"
        columns={[
          { key: "mes", label: "Mês", cellClassName: "text-white font-medium" },
          {
            key: "faturamento",
            label: "Faturamento",
            cellClassName: "font-mono text-white",
          },
          {
            key: "inadimplencia",
            label: "Inadimplência",
            cellClassName: "font-mono",
            render: (row) => {
              const v = String(row.inadimplencia);
              return <span className={inadimplenciaClass(v)}>{v}</span>;
            },
          },
          {
            key: "nf",
            label: "Nota fiscal",
            cellClassName: "font-mono text-brand-text-secondary",
          },
        ]}
        rows={invoices}
      />
    </div>
  );
}