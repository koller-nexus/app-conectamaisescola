"use client";

import { FormEvent, useState } from "react";
import { forgotPassword } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Informe seu email.");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(trimmedEmail);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Não foi possível enviar.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-primary/25 blur-3xl" />
        <div className="absolute -bottom-56 -right-40 h-[440px] w-[440px] rounded-full bg-brand-accent/15 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center animate-rise">
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            ConectaMaisEscola
          </p>
          <h1 className="text-3xl font-medium leading-tight tracking-tight text-white">
            Recuperar senha
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-brand-text-secondary">
            Informe o email da sua conta para receber as instruções de
            recuperação.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-lg border border-brand-border bg-brand-surface p-6 shadow-2xl shadow-black/40 animate-rise"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex flex-col gap-1.5" suppressHydrationWarning>
            <label
              htmlFor="email"
              className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-text-secondary"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || sent}
              className="h-11 w-full rounded-lg border border-brand-border bg-black/40 px-3.5 text-sm text-white placeholder:text-zinc-600 transition-colors focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30 disabled:opacity-60"
              placeholder="voce@exemplo.com"
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
            >
              {error}
            </p>
          ) : null}

          {sent ? (
            <p className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
              Se houver uma conta com esse email, enviaremos as instruções de
              recuperação.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || sent}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white shadow-lg shadow-brand-primary/30 transition-all hover:-translate-y-0.5 hover:bg-brand-primary-hover hover:shadow-brand-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? "Enviando…" : "Enviar instruções"}
          </button>

          <div className="mt-4 text-center">
            <a
              href="/login"
              className="rounded text-sm font-medium text-brand-accent transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              Voltar para o login
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
