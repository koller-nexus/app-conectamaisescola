"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import type { MeResponse } from "@/lib/api";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  initialMe: MeResponse;
  onLogout: () => Promise<void>;
}

function initialsOf(email: string): string {
  const local = email.split("@")[0] ?? "";
  const parts = local.replace(/[._-]+/g, " ").trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default function UserModal({
  open,
  onClose,
  initialMe,
  onLogout,
}: UserModalProps) {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse>(initialMe);
  const [loaded, setLoaded] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: MeResponse | null) => {
        if (!cancelled && data) {
          setMe(data);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  async function handleLogout() {
    setLoggingOut(true);
    await onLogout();
    router.push("/login");
    router.refresh();
  }

  const statusActive = me.user.status === "active";

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Informações do usuário"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-sm rounded-lg border border-brand-border bg-brand-surface p-6 shadow-2xl shadow-black/50 animate-rise">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary text-lg font-semibold text-white">
            {initialsOf(me.user.email)}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-text-secondary transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-1">
          <p className="break-all text-lg font-semibold text-white">
            {!loaded ? "Carregando…" : me.user.email}
          </p>
          <p className="font-mono text-xs uppercase tracking-wide text-brand-accent">
            {me.roles.map((r) => r.name).join(", ")}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <div className="rounded-lg border border-brand-border bg-black/40 p-3.5">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Email
            </dt>
            <dd className="mt-1 break-all text-sm text-white">
              {me.user.email}
            </dd>
          </div>
          <div className="flex gap-3">
            <div className="flex-1 rounded-lg border border-brand-border bg-black/40 p-3.5">
              <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
                Email verificado
              </dt>
              <dd className="mt-1 text-sm font-medium text-white">
                {me.user.emailVerified ? "Sim" : "Não"}
              </dd>
            </div>
            <div className="flex-1 rounded-lg border border-brand-border bg-black/40 p-3.5">
              <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
                Status
              </dt>
              <dd className="mt-1 flex items-center gap-1.5 text-sm font-medium text-white">
                <span
                  className={`h-2 w-2 rounded-full ${
                    statusActive ? "bg-emerald-400" : "bg-zinc-500"
                  }`}
                  aria-hidden="true"
                />
                {statusActive ? "Ativo" : me.user.status}
              </dd>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {me.permissions.length > 0 && (
            <div>
              <p className="mb-1.5 font-mono text-xs uppercase tracking-wide text-brand-text-secondary">
                Permissões
              </p>
              <div className="flex flex-wrap gap-1.5">
                {me.permissions.map((p) => (
                  <span
                    key={p.id}
                    className="rounded-md border border-brand-border bg-black/40 px-2 py-0.5 font-mono text-[11px] text-brand-text-secondary"
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-60"
          >
            {loggingOut ? "Saindo…" : "Sair da conta"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
