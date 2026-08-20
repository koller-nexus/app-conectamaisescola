import ScreenHeader from "../_components/screen-header";
import MockList from "../_components/mock-list";

const menu = [
  { date: "19/08", refeicao: "Almoço", prato: "Arroz, feijão, frango grelhado e salada", restricao: "2 sem glúten" },
  { date: "20/08", refeicao: "Almoço", prato: "Massa ao sugo, carne moída e legumes", restricao: "1 sem lactose" },
  { date: "21/08", refeicao: "Lanche", prato: "Suco natural e pão integral", restricao: "Nenhuma" },
];

export default function CardapioPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Cardápio & alergias"
        description="Planejamento de refeições e restrições nutricionais."
      />
      <MockList
        title="Cardápio da semana"
        columns={[
          { key: "date", label: "Data" },
          { key: "refeicao", label: "Refeição" },
          { key: "prato", label: "Cardápio" },
          { key: "restricao", label: "Restrições" },
        ]}
        rows={menu}
      />
    </div>
  );
}
