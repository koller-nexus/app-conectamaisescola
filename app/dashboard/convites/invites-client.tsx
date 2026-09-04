"use client";

import { FormEvent, useEffect, useState } from "react";
import ScreenHeader from "../_components/screen-header";
import Pagination from "../_components/pagination";
import type { Invite, Page, Role } from "@/lib/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAGE_SIZE = 20;

interface InviteStatus {
  label: string;
  className: string;
  dot: string;
}

function inviteStatus(invite: Invite): InviteStatus {
  if (invite.accepted_at) {
    return {
      label: "Aceito",
      className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
      dot: "bg-emerald-400",
    };
  }
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    return {
      label: "Expirado",
      className: "border-zinc-500/40 bg-black/40 text-zinc-400",
      dot: "bg-zinc-500",
    };
  }
  return {
    label: "Pendente",
    className: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400 animate-pulse-dot",
  };
}

const FALLBACK_ACCEPTED: InviteStatus = {
  label: "Aceito",
  className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  dot: "bg-emerald-400",
};

const FALLBACK_PENDING: InviteStatus = {
  label: "Pendente",
  className: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  dot: "bg-amber-400 animate-pulse-dot",
};

export default function InvitesClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [email, setEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [statuses, setStatuses] = useState<Record<string, InviteStatus>>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  function applyInvites(data: Invite[]) {
    setInvites(data);
    setStatuses(
      Object.fromEntries(data.map((inv) => [inv.id, inviteStatus(inv)])),
    );
  }

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/roles?page_size=100").then((res) =>
        res.ok ? res.json() : Promise.reject(new Error()),
      ),
      fetch(`/api/invites?page=1&page_size=${PAGE_SIZE}`).then((res) =>
        res.ok ? res.json() : Promise.reject(new Error()),
      ),
    ])
      .then(([roleData, inviteData]) => {
        if (cancelled) return;
        const roles = (roleData as Page<Role>).data;
        setRoles(roles);
        if (roles.length > 0) setRoleId(roles[0].id);
        const invitePage = inviteData as Page<Invite>;
        applyInvites(invitePage.data);
        setTotalPages(invitePage.total_pages);
        setTotalItems(invitePage.total_items);
      })
      .catch(() => {
        if (!cancelled) setError("Não foi possível carregar os convites.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function load(targetPage: number) {
    setError(null);
    try {
      const res = await fetch(
        `/api/invites?page=${targetPage}&page_size=${PAGE_SIZE}`,
      );
      if (!res.ok) throw new Error();
      const data = (await res.json()) as Page<Invite>;
      applyInvites(data.data);
      setTotalPages(data.total_pages);
      setTotalItems(data.total_items);
    } catch {
      setError("Não foi possível carregar os convites.");
    }
  }

  function changePage(next: number) {
    setPage(next);
    void load(next);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Informe o email do convidado.");
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError("Informe um email válido.");
      return;
    }
    if (!roleId) {
      setError("Selecione um papel para o convite.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, role_id: roleId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao criar o convite.");
        return;
      }
      setEmail("");
      setPage(1);
      await load(1);
    } catch {
      setError("Falha ao criar o convite.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Convites"
        description="Convide profissionais para a plataforma atribuindo um papel de acesso."
      />

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {error}
        </p>
      ) : null}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="card card-accent p-5 animate-rise"
      >
        <h2 className="mb-4 flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-white">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse-dot"
          />
          Enviar convite
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary"
            >
              Email do convidado
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={saving}
              className="input"
              placeholder="nome@escola.com"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="role"
              className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary"
            >
              Papel de acesso
            </label>
            <div className="relative">
              <select
                id="role"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                disabled={saving || roles.length === 0}
                className="input appearance-none pr-10"
                required
              >
                {roles.length === 0 ? (
                  <option value="">Carregando papéis…</option>
                ) : (
                  roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))
                )}
              </select>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-3 my-auto h-4 w-4 text-zinc-500"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary px-4 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
          >
            {saving ? "Enviando…" : "Enviar convite"}
          </button>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-brand-text-secondary">
          O convidado receberá um email com um link para ativar a conta e
          definir a senha.
        </p>
      </form>

      <div className="card card-accent overflow-hidden animate-rise">
        <div className="flex items-center justify-between border-b border-brand-border bg-black/20 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse-dot"
            />
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
              Convites enviados
            </h2>
          </div>
          <span className="rounded-full border border-brand-border bg-black/40 px-2.5 py-1 font-mono text-[11px] text-brand-text-secondary">
            {totalItems} registros
          </span>
        </div>
        {loading ? (
          <p className="px-5 py-6 text-sm text-brand-text-secondary">
            Carregando…
          </p>
        ) : invites.length === 0 ? (
          <p className="px-5 py-6 text-sm text-brand-text-secondary">
            Nenhum convite enviado ainda.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-black/20">
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">
                    Email
                  </th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">
                    Papel
                  </th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">
                    Enviado em
                  </th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">
                    Validade
                  </th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => {
                  const status =
                    statuses[invite.id] ??
                    (invite.accepted_at
                      ? FALLBACK_ACCEPTED
                      : FALLBACK_PENDING);
                  return (
                    <tr
                      key={invite.id}
                      className="border-b border-brand-border/60 last:border-0 transition-colors hover:bg-brand-primary/[0.06]"
                    >
                      <td className="px-5 py-3 text-white">{invite.email}</td>
                      <td className="px-5 py-3">
                        <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2.5 py-1 font-mono text-[11px] text-brand-accent">
                          {invite.role?.name ?? "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-brand-text-secondary">
                        {new Date(invite.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-5 py-3 font-mono text-brand-text-secondary">
                        {new Date(invite.expires_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] ${status.className}`}
                        >
                          <span
                            className={`h-1 w-1 rounded-full ${status.dot}`}
                            aria-hidden="true"
                          />
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={changePage}
        />
      </div>
    </div>
  );
}