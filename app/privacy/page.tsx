import Link from "next/link";

export default function PrivacyPage() {
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
          Política de <span className="text-gradient">Privacidade</span>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
          Última atualização: 19 de agosto de 2026
        </p>

        <div className="mt-10 flex flex-col gap-10">
          <section>
            <h2 className="flex items-center gap-2.5 border-l-2 border-brand-accent/60 pl-3 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              1. Dados coletados
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
              Coletamos os dados necessários para a gestão escolar, como nome,
              e-mail institucional, cargo, informações de alunos vinculados à
              instituição e registros de acesso à plataforma. Não coletamos
              dados além daqueles necessários para a operação do serviço.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2.5 border-l-2 border-brand-accent/60 pl-3 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              2. Uso dos dados
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
              Os dados são utilizados exclusivamente para autenticação,
              gestão da rotina escolar e prestação do serviço contratado.
              Seus dados não são vendidos a terceiros.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2.5 border-l-2 border-brand-accent/60 pl-3 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              3. Segurança
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
              Adotamos medidas técnicas e organizacionais adequadas para
              proteger os dados contra acesso não autorizado, alteração,
              divulgação ou destruição, incluindo criptografia em trânsito e
              controle de acesso baseado em função.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2.5 border-l-2 border-brand-accent/60 pl-3 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              4. Compartilhamento
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
              Os dados são acessados apenas por pessoas autorizadas e podem
              ser compartilhados com processadores contratados para a operação
              do serviço, sempre sob obrigações de confidencialidade e
              segurança, no estrito limite necessário.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2.5 border-l-2 border-brand-accent/60 pl-3 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              5. Seus direitos (LGPD)
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
              Nos termos da LGPD, você pode solicitar o acesso, a correção, a
              portabilidade e a eliminação dos seus dados, bem como revogar
              autorizações, entrando em contato pelo canal indicado na
              plataforma.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2.5 border-l-2 border-brand-accent/60 pl-3 font-mono text-sm font-semibold uppercase tracking-wide text-white">
              6. Retenção
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
              Os dados são mantidos apenas pelo tempo necessário à prestação
              do serviço e ao cumprimento de obrigações legais, sendo
              eliminados ou anonimizados após o término da relação contratual,
              salvo exigência legal em contrário.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
