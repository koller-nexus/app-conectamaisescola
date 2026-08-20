import ScreenHeader from "../_components/screen-header";
import MockList from "../_components/mock-list";

const events = [
  { date: "14/05", title: "Semana de leitura", location: "Pátio central" },
  { date: "09/05", title: "Apresentação dia das mães", location: "Auditório" },
  { date: "30/06", title: "Feira de ciências 2026", location: "Quadra" },
  { date: "15/07", title: "Reunião de pais", location: "Auditório" },
];

export default function AgendaPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Agenda & calendário"
        description="Eventos, avaliações e atividades acadêmicas."
      />
      <MockList
        title="Próximos eventos"
        columns={[
          { key: "date", label: "Data" },
          { key: "title", label: "Evento" },
          { key: "location", label: "Local" },
        ]}
        rows={events}
      />
    </div>
  );
}
