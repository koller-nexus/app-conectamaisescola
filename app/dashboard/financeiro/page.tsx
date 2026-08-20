import ScreenHeader from "../_components/screen-header";
import MockList from "../_components/mock-list";

const invoices = [
  { mes: "Julho/2026", faturamento: "R$ 482.500", inadimplencia: "4,6%", nf: "NF-e 0042" },
  { mes: "Junho/2026", faturamento: "R$ 446.200", inadimplencia: "5,0%", nf: "NF-e 0041" },
  { mes: "Maio/2026", faturamento: "R$ 431.800", inadimplencia: "5,3%", nf: "NF-e 0040" },
];

export default function FinanceiroPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Financeiro & NF-e"
        description="Faturamento, inadimplência e notas fiscais eletrônicas."
      />
      <MockList
        title="Fechamentos mensais"
        columns={[
          { key: "mes", label: "Mês" },
          { key: "faturamento", label: "Faturamento" },
          { key: "inadimplencia", label: "Inadimplência" },
          { key: "nf", label: "Nota fiscal" },
        ]}
        rows={invoices}
      />
    </div>
  );
}
