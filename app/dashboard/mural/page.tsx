import ScreenHeader from "../_components/screen-header";
import MockList from "../_components/mock-list";

const posts = [
  { author: "Direção", date: "18/08", message: "Comunicado sobre a semana de avaliações." },
  { author: "Coordenação", date: "16/08", message: "Reunião pedagógica na sexta-feira às 14h." },
  { author: "Secretaria", date: "12/08", message: "Prazo para entrega de documentos encerra dia 30." },
];

export default function MuralPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Mural social"
        description="Acompanhe as comunicações e avisos da comunidade escolar."
      />
      <MockList
        title="Publicações recentes"
        columns={[
          { key: "author", label: "Autor" },
          { key: "date", label: "Data" },
          { key: "message", label: "Mensagem" },
        ]}
        rows={posts}
      />
    </div>
  );
}
