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

const menu = [
  {
    date: "19/08",
    refeicao: "Almoço",
    prato: "Arroz, feijão, frango grelhado e salada",
    restricao: "2 sem glúten",
  },
  {
    date: "20/08",
    refeicao: "Almoço",
    prato: "Massa ao sugo, carne moída e legumes",
    restricao: "1 sem lactose",
  },
  {
    date: "21/08",
    refeicao: "Lanche",
    prato: "Suco natural e pão integral",
    restricao: "Nenhuma",
  },
  {
    date: "22/08",
    refeicao: "Almoço",
    prato: "Arroz integral, feijão, peixe assado e legumes",
    restricao: "1 sem glúten",
  },
  {
    date: "23/08",
    refeicao: "Lanche",
    prato: "Fruta da estação e iogurte natural",
    restricao: "Nenhuma",
  },
];

export default function CardapioPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Cardápio & alergias"
        description="Planejamento de refeições e restrições nutricionais."
      />

      <StatCards
        items={[
          {
            label: "Refeições na semana",
            value: "15",
            delta: "+2",
            positive: true,
            icon: i("M12 3c.5-1.5 2-2.5 3.5-2.5 0 2-1 3-2.5 3.5C12 4 11.5 3.5 12 3ZM8 8c0-1.5 1-2.5 2-3 1.5-1 3-1 4.5-1M12 5c-1-1.5-3-2-4.5-2-1 1-1.5 3-.5 4.5"),
          },
          {
            label: "Restrições ativas",
            value: "3",
            delta: "atenção",
            positive: false,
            icon: i("M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"),
          },
          {
            label: "Sem glúten",
            value: "2",
            delta: "alunos",
            positive: true,
            icon: i("M12 3c.5-1.5 2-2.5 3.5-2.5 0 2-1 3-2.5 3.5C12 4 11.5 3.5 12 3ZM8 8c0-1.5 1-2.5 2-3 1.5-1 3-1 4.5-1"),
          },
          {
            label: "Sem lactose",
            value: "1",
            delta: "aluno",
            positive: true,
            icon: i("M12 3v18M5 8h14M7 8c0-2 2-3 5-3s5 1 5 3c0 2-2 3-5 3S7 10 7 8ZM4 13h16M6 13c0 2 2 3 6 3s6-1 6-3"),
          },
        ]}
      />

      <MockList
        title="Cardápio da semana"
        icon={i("M12 3c.5-1.5 2-2.5 3.5-2.5 0 2-1 3-2.5 3.5C12 4 11.5 3.5 12 3ZM8 8c0-1.5 1-2.5 2-3 1.5-1 3-1 4.5-1M12 5c-1-1.5-3-2-4.5-2-1 1-1.5 3-.5 4.5")}
        searchable
        searchKeys={["date", "refeicao", "prato", "restricao"]}
        searchPlaceholder="Buscar por data, refeição ou prato…"
        columns={[
          {
            key: "date",
            label: "Data",
            cellClassName: "font-mono text-brand-accent",
          },
          {
            key: "refeicao",
            label: "Refeição",
            render: (row) => {
              const almoco = String(row.refeicao) === "Almoço";
              return (
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
                    almoco
                      ? "border-brand-primary/30 bg-brand-primary/10 text-brand-accent"
                      : "border-brand-border bg-black/40 text-brand-text-secondary"
                  }`}
                >
                  {String(row.refeicao)}
                </span>
              );
            },
          },
          { key: "prato", label: "Cardápio", cellClassName: "text-white" },
          {
            key: "restricao",
            label: "Restrições",
            render: (row) => {
              const restricao = String(row.restricao);
              const none = restricao === "Nenhuma";
              return (
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${
                    none
                      ? "border-brand-border bg-black/40 text-brand-text-secondary"
                      : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {restricao}
                </span>
              );
            },
          },
        ]}
        rows={menu}
      />
    </div>
  );
}