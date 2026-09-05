"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface InviteInfo {
  email: string;
  role_name: string;
  expires_at: string;
}

type Status = "loading" | "invalid" | "valid" | "done";

function formatExpiry(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function AcceptInviteForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const hasToken = Boolean(token);

  const [status, setStatus] = useState<Status>(hasToken ? "loading" : "invalid");
  const [invite, setInvite] = useState<InviteInfo | null>(null);
  const [error, setError] = useState<string | null>(
    hasToken ? null : "Link de convite inválido ou incompleto.",
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hasToken) return;
    let cancelled = false;
    fetch(`/api/invites/${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.ok) {
          setInvite((await res.json()) as InviteInfo);
          setStatus("valid");
        } else {
          const data = await res.json().catch(() => null);
          setStatus("invalid");
          setError(
            data?.error ??
              "O convite é inválido ou já foi utilizado. Solicite um novo.",
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("invalid");
          setError("Não foi possível validar o convite.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [hasToken, token]);

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

    setLoading(true);
    try {
      const res = await fetch(
        `/api/invites/${encodeURIComponent(token)}/accept`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(
          data?.error ?? "Não foi possível concluir o cadastro.",
        );
        return;
      }
      setStatus("done");
    } catch {
      setError("Não foi possível concluir o cadastro.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="card p-6 text-center animate-rise">
        <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-2 border-brand-border border-t-brand-accent" />
        <p className="text-sm text-brand-text-secondary">Validando convite…</p>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="card p-6 text-center animate-rise">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-7 w-7 text-red-400"
            aria-hidden="true"
          >
            <path
              d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Convite inválido</h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-text-secondary">
          {error}
        </p>
        <a
          href="/login"
          className="mt-6 flex h-11 w-full items-center justify-center rounded-lg border border-brand-border px-4 text-sm text-brand-text-secondary transition-colors hover:text-white"
        >
          Voltar para o login
        </a>
      </div>
    );
  }

  if (status === "done") {
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
        <h2 className="text-xl font-semibold text-white">Conta criada</h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-text-secondary">
          Seu acesso foi ativado. Confirme o email recebido e entre na
          plataforma.
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
      <div className="rounded-lg border border-brand-border bg-black/40 p-4">
        <p className="font-mono text-[11px] uppercase tracking-wide text-brand-text-secondary">
          Convite para
        </p>
        <p className="mt-1 break-all text-sm font-medium text-white">
          {invite?.email}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2.5 py-1 font-mono text-[11px] text-brand-accent">
            {invite?.role_name}
          </span>
          {invite?.expires_at && (
            <span className="rounded-full border border-brand-border bg-black/40 px-2.5 py-1 font-mono text-[11px] text-brand-text-secondary">
              Válido até {formatExpiry(invite.expires_at)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <div className="flex flex-col gap-1.5" suppressHydrationWarning>
          <label
            htmlFor="password"
            className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-text-secondary"
          >
            Defina sua senha
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
            Confirmar senha
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
        {loading ? "Criando conta…" : "Aceitar convite"}
      </button>
    </form>
  );
}

export default function AcceptInvitePage() {
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
            Ative sua <span className="text-gradient">conta</span>
          </h1>
          <p className="mt-3 max-w-[17rem] text-sm leading-relaxed text-brand-text-secondary">
            Você foi convidado para a plataforma. Defina sua senha para
            começar.
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
          <AcceptInviteForm />
        </Suspense>
      </div>
    </main>
  );
}