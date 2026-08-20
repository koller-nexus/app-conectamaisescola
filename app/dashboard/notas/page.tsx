import ScreenHeader from "../_components/screen-header";
import MockList from "../_components/mock-list";

const grades = [
  { aluno: "Ana Clara Souza", disciplina: "Matemática", nota: 8.5, periodo: "2º Bimestre" },
  { aluno: "Bruno Lima", disciplina: "Português", nota: 7.0, periodo: "2º Bimestre" },
  { aluno: "Carla Mendes", disciplina: "Ciências", nota: 9.2, periodo: "2º Bimestre" },
  { aluno: "Diego Santos", disciplina: "História", nota: 6.8, periodo: "2º Bimestre" },
];

export default function NotasPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Notas & boletim"
        description="Lançamento e consulta de notas por período letivo."
      />
      <MockList
        title="Notas do período"
        columns={[
          { key: "aluno", label: "Aluno" },
          { key: "disciplina", label: "Disciplina" },
          { key: "nota", label: "Nota" },
          { key: "periodo", label: "Período" },
        ]}
        rows={grades}
      />
    </div>
  );
}
