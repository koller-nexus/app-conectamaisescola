"use client";

import { useState } from "react";
import { destroySession } from "@/lib/auth-actions";
import type { MeResponse } from "@/lib/api";
import UserModal from "./user-modal";

export default function Header({ me }: { me: MeResponse }) {
  const [modalOpen, setModalOpen] = useState(false);
  const notifications = 1;
  const roleLabel = me.roles.map((r) => r.name).join(", ");

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-brand-border bg-brand-surface/80 px-6 backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </span>
        <span className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-text-secondary">
          Online
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Notificações (${notifications} não lidas)`}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border bg-black/40 text-brand-text-secondary transition-colors hover:border-brand-accent/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path
              d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6ZM10 20a2 2 0 0 0 4 0"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {notifications > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-b from-brand-accent to-brand-primary px-1 font-mono text-[10px] font-semibold text-white shadow-glow">
              {notifications}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          aria-label="Abrir informações do usuário"
          className="flex items-center gap-2.5 rounded-lg border border-brand-border bg-black/40 p-1.5 pr-3 transition-colors hover:border-brand-accent/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent text-sm font-semibold text-white shadow-glow">
            {me.user.email.charAt(0).toUpperCase()}
          </div>
          <span className="hidden text-left sm:block">
            <span className="block max-w-[180px] truncate text-sm font-medium text-white">
              {me.user.email}
            </span>
            <span className="block max-w-[180px] truncate font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              {roleLabel}
            </span>
          </span>
        </button>
      </div>

      <UserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialMe={me}
        onLogout={destroySession}
      />
    </header>
  );
}