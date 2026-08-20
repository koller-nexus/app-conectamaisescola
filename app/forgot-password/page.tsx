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
    <main className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-white px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-lilac-soft blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-900">
            Recuperar senha
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            Informe o email da sua conta para receber as instruções.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur"
        >
          <div className="flex flex-col gap-1.5" suppressHydrationWarning>
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700"
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
              className="h-11 rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-lilac disabled:bg-zinc-50"
              placeholder="voce@exemplo.com"
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}

          {sent ? (
            <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              Se houver uma conta com esse email, enviaremos as instruções de
              recuperação.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || sent}
            className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-lilac focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Enviando…" : "Enviar instruções"}
          </button>

          <div className="mt-4 text-center">
            <a
              href="/login"
              className="rounded text-sm font-medium text-brand-primary hover:text-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-lilac"
            >
              Voltar para o login
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}