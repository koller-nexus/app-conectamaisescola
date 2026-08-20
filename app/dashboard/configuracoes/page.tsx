import ScreenHeader from "../_components/screen-header";
import MockList from "../_components/mock-list";

const settings = [
  { chave: "Idioma", valor: "Português (Brasil)" },
  { chave: "Fuso horário", valor: "America/Sao_Paulo" },
  { chave: "Notificações por e-mail", valor: "Ativadas" },
  { chave: "Notificações push", valor: "Ativadas" },
];

export default function ConfiguracoesPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Configurações"
        description="Preferências gerais da plataforma."
      />
      <MockList
        title="Preferências"
        columns={[
          { key: "chave", label: "Preferência" },
          { key: "valor", label: "Valor" },
        ]}
        rows={settings}
      />
    </div>
  );
}
