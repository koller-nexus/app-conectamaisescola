"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type Status = "verifying" | "success" | "error";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const hasToken = Boolean(token);

  const [status, setStatus] = useState<Status>(
    hasToken ? "verifying" : "error",
  );
  const [error, setError] = useState<string | null>(
    hasToken ? null : "Link de verificação inválido ou incompleto.",
  );

  useEffect(() => {
    if (!hasToken) return;
    let cancelled = false;
    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        if (cancelled) return;
        if (res.ok) {
          setStatus("success");
        } else {
          const data = await res.json().catch(() => null);
          setStatus("error");
          setError(
            data?.error ??
              "Não foi possível verificar o email. O link pode ter expirado.",
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
          setError("Não foi possível verificar o email.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [hasToken, token]);

  if (status === "verifying") {
    return (
      <div className="card p-6 text-center animate-rise">
        <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-2 border-brand-border border-t-brand-accent" />
        <p className="text-sm text-brand-text-secondary">Verificando email…</p>
      </div>
    );
  }

  if (status === "success") {
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
        <h2 className="text-xl font-semibold text-white">Email verificado</h2>
        <p className="mt-2 text-sm leading-relaxed text-brand-text-secondary">
          Seu email foi confirmado com sucesso. Você já pode acessar a
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
      <h2 className="text-xl font-semibold text-white">
        Não foi possível verificar
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-brand-text-secondary">
        {error}
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <a
          href="/login"
          className="flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110"
        >
          Ir para o login
        </a>
        <a
          href="/forgot-password"
          className="flex h-11 w-full items-center justify-center rounded-lg border border-brand-border px-4 text-sm text-brand-text-secondary transition-colors hover:text-white"
        >
          Solicitar nova senha
        </a>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
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
            Verificação de <span className="text-gradient">email</span>
          </h1>
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
          <VerifyEmailContent />
        </Suspense>
      </div>
    </main>
  );
}