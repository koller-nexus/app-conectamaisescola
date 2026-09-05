"use client";

import { FormEvent, useState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não coincidem.");
      return;
    }
    if (!token) {
      setError("Link de recuperação inválido. Solicite um novo link.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Não foi possível redefinir a senha.");
        return;
      }
      setDone(true);
    } catch {
      setError("Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="card card-accent p-6 text-center animate-rise">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7 text-emerald-400"
            aria-hidden="true"
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">
          Senha redefinida
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-text-secondary">
          Sua senha foi atualizada e todas as sessões anteriores foram
          encerradas. Entre com a nova senha.
        </p>
        <Link
          href="/login"
          className="mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110"
        >
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="card card-accent p-6 animate-rise"
      style={{ animationDelay: "80ms" }}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5" suppressHydrationWarning>
          <label
            htmlFor="password"
            className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-text-secondary"
          >
            Nova senha
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-zinc-500"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="input pl-11"
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5" suppressHydrationWarning>
          <label
            htmlFor="confirm"
            className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-text-secondary"
          >
            Confirmar nova senha
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-zinc-500"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
              className="input pl-11"
              placeholder="Repita a senha"
              minLength={8}
              required
            />
          </div>
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary px-4 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110 hover:shadow-glow-strong active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {loading ? "Salvando…" : "Redefinir senha"}
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
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-primary/25 blur-3xl" />
        <div className="absolute -bottom-56 -right-40 h-[440px] w-[440px] rounded-full bg-brand-accent/15 blur-3xl" />
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]" />
        <div className="absolute inset-0 opacity-[0.05] bg-noise" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center animate-rise">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent shadow-glow">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7 text-white"
              aria-hidden="true"
            >
              <path
                d="M4 6.5c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8.5L4 21.5V6.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path
                d="M8 10.5h8M8 13.5h5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
            ConectaMaisEscola
          </p>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white">
            Redefinir <span className="text-gradient">senha</span>
          </h1>
          <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-brand-text-secondary">
            Escolha uma nova senha para a sua conta institucional.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="card p-6">
              <p className="py-6 text-center text-sm text-brand-text-secondary">
                Carregando…
              </p>
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}