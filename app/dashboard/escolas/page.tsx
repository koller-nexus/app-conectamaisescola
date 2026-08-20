import ScreenHeader from "../_components/screen-header";
import MockList from "../_components/mock-list";

const schools = [
  { id: "ESC-01", name: "Colégio Conecta Mais", unidade: "Matriz", diretor: "Fernanda Costa" },
  { id: "ESC-02", name: "Escola Infantil Alegria", unidade: "Unidade 2", diretor: "Ricardo Dias" },
];

export default function EscolasPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Escolas"
        description="Unidades escolares vinculadas à organização."
      />
      <MockList
        title="Escolas"
        columns={[
          { key: "id", label: "Código" },
          { key: "name", label: "Nome" },
          { key: "unidade", label: "Unidade" },
          { key: "diretor", label: "Diretor" },
        ]}
        rows={schools}
      />
    </div>
  );
}
