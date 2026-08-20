import ScreenHeader from "../_components/screen-header";
import MockList from "../_components/mock-list";

const students = [
  { id: "ALU-001", name: "Ana Clara Souza", turma: "3º Ano A", responsavel: "Maria Souza" },
  { id: "ALU-002", name: "Bruno Lima", turma: "5º Ano B", responsavel: "Carlos Lima" },
  { id: "ALU-003", name: "Carla Mendes", turma: "1º Ano A", responsavel: "Joana Mendes" },
  { id: "ALU-004", name: "Diego Santos", turma: "2º Ano B", responsavel: "Paulo Santos" },
];

export default function AlunosPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Alunos"
        description="Gestão do corpo discente matriculado na instituição."
      />
      <MockList
        title="Alunos matriculados"
        columns={[
          { key: "id", label: "Matrícula" },
          { key: "name", label: "Nome" },
          { key: "turma", label: "Turma" },
          { key: "responsavel", label: "Responsável" },
        ]}
        rows={students}
      />
    </div>
  );
}
