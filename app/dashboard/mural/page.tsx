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

const posts = [
  {
    author: "Direção",
    date: "18/08",
    message: "Comunicado sobre a semana de avaliações.",
    tipo: "Comunicado",
  },
  {
    author: "Coordenação",
    date: "16/08",
    message: "Reunião pedagógica na sexta-feira às 14h.",
    tipo: "Aviso",
  },
  {
    author: "Secretaria",
    date: "12/08",
    message: "Prazo para entrega de documentos encerra dia 30.",
    tipo: "Aviso",
  },
  {
    author: "Professores",
    date: "10/08",
    message: "Feira de ciências: inscrições abertas para todas as turmas.",
    tipo: "Atividade",
  },
];

function tipoClass(tipo: string) {
  switch (tipo) {
    case "Comunicado":
      return "border-brand-primary/30 bg-brand-primary/10 text-brand-accent";
    case "Aviso":
      return "border-amber-500/40 bg-amber-500/10 text-amber-400";
    case "Atividade":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
    default:
      return "border-brand-border bg-black/40 text-brand-text-secondary";
  }
}

export default function MuralPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Mural social"
        description="Acompanhe as comunicações e avisos da comunidade escolar."
      />

      <StatCards
        items={[
          {
            label: "Publicações",
            value: "128",
            delta: "+12",
            positive: true,
            icon: i("M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5ZM8 8h8M8 12h8M8 16h5"),
          },
          {
            label: "Esta semana",
            value: "9",
            delta: "+3",
            positive: true,
            icon: i("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 3"),
          },
          {
            label: "Rascunhos",
            value: "2",
            delta: "aguardando",
            positive: false,
            icon: i("M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"),
          },
          {
            label: "Reações & curtidas",
            value: "312",
            delta: "+18%",
            positive: true,
            icon: i("M12 21s-7-4.6-9.5-9C.7 8.5 2.8 5 6.3 5c2 0 3.2 1.2 3.7 2 .5-.8 1.7-2 3.7-2 3.5 0 5.6 3.5 3.8 7-2.5 4.4-9.5 9-9.5 9Z"),
          },
        ]}
      />

      <MockList
        title="Publicações recentes"
        icon={i("M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5ZM8 8h8M8 12h8M8 16h5")}
        searchable
        searchKeys={["author", "date", "message", "tipo"]}
        searchPlaceholder="Buscar publicações…"
        columns={[
          {
            key: "author",
            label: "Autor",
            cellClassName: "text-white font-medium",
          },
          {
            key: "date",
            label: "Data",
            cellClassName: "font-mono text-brand-accent",
          },
          { key: "message", label: "Mensagem" },
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
        rows={posts}
      />
    </div>
  );
}