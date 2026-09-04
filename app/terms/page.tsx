import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="relative flex min-h-full flex-1 overflow-hidden bg-background">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,black,transparent)]" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-6 py-16">
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 rounded font-mono text-xs font-semibold uppercase tracking-wide text-brand-accent transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="M15 5l-7 7 7 7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Voltar
        </Link>

        <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
          ConectaMaisEscola
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white">
          Termos de <span className="text-gradient">Serviço</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
          Última atualização: 19 de agosto de 2026
        </p>

        <div className="mt-10 flex flex-col gap-10">
          <section>
            <h2 className="flex items-center gap-2.5 border-l-2 border-brand-accent/60 pl-3 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              1. Aceitação dos termos
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
              Ao acessar a plataforma ConectaMaisEscola, você declara estar
              de acordo com estes Termos de Serviço e com a Política de
              Privacidade. Caso não concorde com qualquer parte, não utilize
              a plataforma.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2.5 border-l-2 border-brand-accent/60 pl-3 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              2. Acesso e uso
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
              O acesso é restrito a administradores, diretores, assistentes e
              professores vinculados à instituição contratante. As credenciais
              de acesso são pessoais e intransferíveis. Você é responsável por
              manter a confidencialidade da sua senha e por todas as atividades
              realizadas na sua conta.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2.5 border-l-2 border-brand-accent/60 pl-3 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              3. Uso dos dados escolares
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
              A plataforma processa dados de alunos e de equipes escolares com
              a finalidade de gestão da rotina institucional. O uso deve
              respeitar a legislação aplicável, incluindo a Lei Geral de
              Proteção de Dados (LGPD), e os dados não podem ser utilizados
              para finalidades diversas daquelas contratadas.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2.5 border-l-2 border-brand-accent/60 pl-3 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              4. Conduta do usuário
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
              É vedado compartilhar credenciais, tentar acessar contas de
              terceiros, ou utilizar a plataforma de forma que comprometa a
              segurança, a disponibilidade ou a integridade do serviço e dos
              dados nela contidos.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2.5 border-l-2 border-brand-accent/60 pl-3 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              5. Encerramento
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
              A instituição contratante pode solicitar o encerramento do
              acesso a qualquer momento. A plataforma pode suspender ou
              encerrar contas em caso de violação destes termos, sem prejuízo
              das demais medidas legais cabíveis.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2.5 border-l-2 border-brand-accent/60 pl-3 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              6. Contato
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
              Dúvidas sobre estes Termos de Serviço podem ser enviadas pelo
              canal de suporte da sua instituição ou pelo e-mail institucional
              da ConectaMaisEscola.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
