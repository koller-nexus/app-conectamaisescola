"use client";

import ScreenHeader from "../_components/screen-header";
import MockList from "../_components/mock-list";
import StatCards from "../_components/stat-cards";

const MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

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

const events = [
  { date: "14/05", title: "Semana de leitura", location: "Pátio central", tipo: "Atividade" },
  { date: "09/05", title: "Apresentação dia das mães", location: "Auditório", tipo: "Atividade" },
  { date: "30/06", title: "Feira de ciências 2026", location: "Quadra", tipo: "Atividade" },
  { date: "15/07", title: "Reunião de pais", location: "Auditório", tipo: "Reunião" },
  { date: "22/06", title: "Conselho de classe", location: "Sala de reuniões", tipo: "Reunião" },
  { date: "10/06", title: "Prova do 2º bimestre", location: "Todas as turmas", tipo: "Avaliação" },
];

function tipoClass(tipo: string) {
  switch (tipo) {
    case "Avaliação":
      return "border-brand-primary/30 bg-brand-primary/10 text-brand-accent";
    case "Reunião":
      return "border-amber-500/40 bg-amber-500/10 text-amber-400";
    case "Atividade":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
    default:
      return "border-brand-border bg-black/40 text-brand-text-secondary";
  }
}

export default function AgendaPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Agenda & calendário"
        description="Eventos, avaliações e atividades acadêmicas."
      />

      <StatCards
        items={[
          {
            label: "Eventos no mês",
            value: "6",
            delta: "+2",
            positive: true,
            icon: i("M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7ZM16 3v4M8 3v4M4 11h16"),
          },
          {
            label: "Avaliações",
            value: "4",
            delta: "2º bim",
            positive: true,
            icon: i("M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"),
          },
          {
            label: "Reuniões",
            value: "3",
            delta: "agendadas",
            positive: true,
            icon: i("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0"),
          },
          {
            label: "Atividades",
            value: "2",
            delta: "abertas",
            positive: true,
            icon: i("M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3Z"),
          },
        ]}
      />

      <MockList
        title="Próximos eventos"
        icon={i("M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7ZM16 3v4M8 3v4M4 11h16")}
        searchable
        searchKeys={["title", "location", "tipo"]}
        searchPlaceholder="Buscar por evento, local ou tipo…"
        columns={[
          {
            key: "date",
            label: "Data",
            render: (row) => {
              const [d, m] = String(row.date).split("/");
              const month = MONTHS[Number(m) - 1] ?? m;
              return (
                <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg border border-brand-border bg-gradient-to-b from-brand-accent/15 to-transparent">
                  <span className="text-sm font-semibold leading-none text-white">
                    {d}
                  </span>
                  <span className="mt-0.5 font-mono text-[9px] uppercase text-brand-accent">
                    {month}
                  </span>
                </div>
              );
            },
          },
          { key: "title", label: "Evento", cellClassName: "text-white font-medium" },
          { key: "location", label: "Local" },
          {
            key: "tipo",
            label: "Tipo",
            render: (row) => {
              const tipo = String(row.tipo);
              return (
                <span
                  className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] ${tipoClass(tipo)}`}
                >
                  {tipo}
                </span>
              );
            },
          },
        ]}
        rows={events}
      />
    </div>
  );
}