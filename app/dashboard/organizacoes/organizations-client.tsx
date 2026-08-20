"use client";

import { useEffect, useState } from "react";
import ScreenHeader from "../_components/screen-header";
import type { Organization } from "@/lib/api";

function statusBadge(status: string) {
  const active = status === "active";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-zinc-500"}`}
        aria-hidden="true"
      />
      {active ? "Ativo" : status}
    </span>
  );
}

interface OrgForm {
  name: string;
  legal_name: string;
  document: string;
  status: string;
}

const EMPTY_FORM: OrgForm = {
  name: "",
  legal_name: "",
  document: "",
  status: "active",
};

const STATUS_OPTIONS = ["active", "blocked", "disabled"];

function formatCNPJ(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12)
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

export default function OrganizationsClient() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<OrgForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/organizations")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .then((data) => {
        if (!cancelled) setOrganizations(data as Organization[]);
      })
      .catch(() => {
        if (!cancelled)
          setError("Não foi possível carregar as organizações.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function load() {
    setError(null);
    try {
      const res = await fetch("/api/organizations");
      if (!res.ok) throw new Error();
      setOrganizations(await res.json());
    } catch {
      setError("Não foi possível carregar as organizações.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId
        ? `/api/organizations/${editingId}`
        : "/api/organizations";
      const payload = editingId
        ? { name: form.name, legal_name: form.legal_name, status: form.status }
        : { name: form.name, legal_name: form.legal_name, document: form.document };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao salvar organização.");
        return;
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await load();
    } catch {
      setError("Falha ao salvar organização.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta organização?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/organizations/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Falha ao excluir organização.");
        return;
      }
      await load();
    } catch {
      setError("Falha ao excluir organização.");
    }
  }

  function startEdit(org: Organization) {
    setEditingId(org.id);
    setForm({
      name: org.name,
      legal_name: org.legal_name,
      document: org.document,
      status: org.status,
    });
  }

  const inputClass =
    "h-10 w-full rounded-lg border border-brand-border bg-black/40 px-3.5 text-sm text-white placeholder:text-zinc-600 transition-colors focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30";
  const selectClass = `${inputClass} appearance-none`;

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Organizações"
        description="Organizações vinculadas à plataforma."
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
        className="rounded-lg border border-brand-border bg-brand-surface p-5"
      >
        <h2 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wide text-white">
          {editingId ? "Editar organização" : "Nova organização"}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Nome
            </label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="ex: Colégio Conecta Mais"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="legal_name" className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Razão social
            </label>
            <input
              id="legal_name"
              value={form.legal_name}
              onChange={(e) => setForm({ ...form, legal_name: e.target.value })}
              className={inputClass}
              placeholder="ex: Colégio Conecta Mais LTDA"
            />
          </div>
          {!editingId && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="document" className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
                CNPJ
              </label>
              <input
                id="document"
                value={formatCNPJ(form.document)}
                onChange={(e) =>
                  setForm({ ...form, document: e.target.value.replace(/\D/g, "") })
                }
                className={inputClass}
                placeholder="00.000.000/0000-00"
                maxLength={18}
                required
              />
            </div>
          )}
          {editingId && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
                Status
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={selectClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex h-10 items-center justify-center rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover disabled:opacity-60"
          >
            {saving ? "Salvando…" : editingId ? "Salvar alterações" : "Criar organização"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY_FORM);
              }}
              className="flex h-10 items-center rounded-lg border border-brand-border px-4 text-sm text-brand-text-secondary transition-colors hover:text-white"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="rounded-lg border border-brand-border bg-brand-surface">
        <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
            Organizações existentes
          </h2>
          <span className="rounded-md border border-brand-border bg-black/40 px-2 py-0.5 font-mono text-[11px] text-brand-text-secondary">
            {organizations.length} registros
          </span>
        </div>
        {loading ? (
          <p className="px-5 py-6 text-sm text-brand-text-secondary">Carregando…</p>
        ) : organizations.length === 0 ? (
          <p className="px-5 py-6 text-sm text-brand-text-secondary">
            Nenhuma organização cadastrada.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Nome</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Razão social</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">CNPJ</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Status</th>
                  <th className="px-5 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Ações</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr key={org.id} className="border-b border-brand-border/60 last:border-0 hover:bg-white/5">
                    <td className="px-5 py-3 text-white">{org.name}</td>
                    <td className="px-5 py-3 text-brand-text-secondary">{org.legal_name || "—"}</td>
                    <td className="px-5 py-3 font-mono text-brand-text-secondary">{formatCNPJ(org.document)}</td>
                    <td className="px-5 py-3 text-brand-text-secondary">
                      {statusBadge(org.status)}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(org)}
                          className="rounded border border-brand-border px-2.5 py-1 text-xs text-brand-accent transition-colors hover:text-white"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(org.id)}
                          className="rounded border border-red-500/40 px-2.5 py-1 text-xs text-red-300 transition-colors hover:bg-red-500/10"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}