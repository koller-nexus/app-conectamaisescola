import ScreenHeader from "../_components/screen-header";
import MockList from "../_components/mock-list";

const teachers = [
  { id: "PROF-01", name: "Roberta Alves", disciplina: "Matemática", email: "roberta@escola.com" },
  { id: "PROF-02", name: "José Ferreira", disciplina: "História", email: "jose@escola.com" },
  { id: "PROF-03", name: "Paula Rocha", disciplina: "Ciências", email: "paula@escola.com" },
  { id: "PROF-04", name: "Marcos Teixeira", disciplina: "Português", email: "marcos@escola.com" },
];

export default function ProfessoresPage() {
  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Professores"
        description="Corpo docente e disciplinas lecionadas."
      />
      <MockList
        title="Professores"
        columns={[
          { key: "id", label: "Código" },
          { key: "name", label: "Nome" },
          { key: "disciplina", label: "Disciplina" },
          { key: "email", label: "Email" },
        ]}
        rows={teachers}
      />
    </div>
  );
}
