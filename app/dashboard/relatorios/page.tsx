import ScreenHeader from "../_components/screen-header";
import MockList from "../_components/mock-list";

const reports = [
  { titulo: "Relatório geral", periodo: "Julho/2026", tipo: "PDF", status: "Disponível" },
  { titulo: "Relatório de notas", periodo: "2º Bimestre", tipo: "PDF", status: "Disponível" },
  { titulo: "Relatório financeiro", periodo: "Julho/2026", tipo: "XLSX", status: "Gerando" },
];

export default function RelatoriosPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Relatórios"
        description="Geração e exportação de relatórios institucionais."
      />
      <MockList
        title="Relatórios gerados"
        columns={[
          { key: "titulo", label: "Relatório" },
          { key: "periodo", label: "Período" },
          { key: "tipo", label: "Formato" },
          { key: "status", label: "Status" },
        ]}
        rows={reports}
      />
    </div>
  );
}
