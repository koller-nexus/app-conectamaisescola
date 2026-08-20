import ScreenHeader from "../_components/screen-header";
import MockList from "../_components/mock-list";

const staff = [
  { id: "DOC-01", name: "Roberta Alves", cargo: "Professor", unidade: "Matriz" },
  { id: "DOC-02", name: "Fernanda Costa", cargo: "Diretor", unidade: "Matriz" },
  { id: "DOC-03", name: "Luciana Pires", cargo: "Coordenador", unidade: "Unidade 2" },
];

export default function CorpoDocentePage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Corpo docente"
        description="Equipe pedagógica e administrativa das unidades."
      />
      <MockList
        title="Corpo docente"
        columns={[
          { key: "id", label: "Código" },
          { key: "name", label: "Nome" },
          { key: "cargo", label: "Cargo" },
          { key: "unidade", label: "Unidade" },
        ]}
        rows={staff}
      />
    </div>
  );
}
