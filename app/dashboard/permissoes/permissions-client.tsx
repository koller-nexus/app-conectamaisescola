"use client";

import { useEffect, useState } from "react";
import ScreenHeader from "../_components/screen-header";
import type { Permission } from "@/lib/api";

interface PermissionForm {
  name: string;
  resource: string;
  action: string;
  description: string;
}

const EMPTY_FORM: PermissionForm = {
  name: "",
  resource: "",
  action: "",
  description: "",
};

export default function PermissionsClient() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<PermissionForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/permissions")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .then((data) => {
        if (!cancelled) setPermissions(data as Permission[]);
      })
      .catch(() => {
        if (!cancelled) setError("Não foi possível carregar as permissões.");
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
      const res = await fetch("/api/permissions");
      if (!res.ok) throw new Error();
      setPermissions(await res.json());
    } catch {
      setError("Não foi possível carregar as permissões.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `/api/permissions/${editingId}`
        : "/api/permissions";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao salvar permissão.");
        return;
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await load();
    } catch {
      setError("Falha ao salvar permissão.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta permissão?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/permissions/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Falha ao excluir permissão.");
        return;
      }
      await load();
    } catch {
      setError("Falha ao excluir permissão.");
    }
  }

  function startEdit(permission: Permission) {
    setEditingId(permission.id);
    setForm({
      name: permission.name,
      resource: permission.resource,
      action: permission.action,
      description: permission.description ?? "",
    });
  }

  const inputClass =
    "h-10 w-full rounded-lg border border-brand-border bg-black/40 px-3.5 text-sm text-white placeholder:text-zinc-600 transition-colors focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30";

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Permissões"
        description="Catálogo de permissões reconhecidas pela plataforma."
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
          {editingId ? "Editar permissão" : "Nova permissão"}
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
              placeholder="ex: Criar papéis"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="resource" className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Recurso
            </label>
            <input
              id="resource"
              value={form.resource}
              onChange={(e) => setForm({ ...form, resource: e.target.value })}
              className={inputClass}
              placeholder="ex: roles"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="action" className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Ação
            </label>
            <input
              id="action"
              value={form.action}
              onChange={(e) => setForm({ ...form, action: e.target.value })}
              className={inputClass}
              placeholder="ex: read"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Descrição
            </label>
            <input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
              placeholder="Descrição"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex h-10 items-center justify-center rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover disabled:opacity-60"
          >
            {saving
              ? "Salvando…"
              : editingId
                ? "Salvar alterações"
                : "Criar permissão"}
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
            Permissões existentes
          </h2>
          <span className="rounded-md border border-brand-border bg-black/40 px-2 py-0.5 font-mono text-[11px] text-brand-text-secondary">
            {permissions.length} registros
          </span>
        </div>
        {loading ? (
          <p className="px-5 py-6 text-sm text-brand-text-secondary">Carregando…</p>
        ) : permissions.length === 0 ? (
          <p className="px-5 py-6 text-sm text-brand-text-secondary">
            Nenhuma permissão cadastrada.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Nome</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Recurso</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Ação</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Sistema</th>
                  <th className="px-5 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Ações</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission.id} className="border-b border-brand-border/60 last:border-0 hover:bg-white/5">
                    <td className="px-5 py-3 text-white">{permission.name}</td>
                    <td className="px-5 py-3 font-mono text-brand-text-secondary">{permission.resource}</td>
                    <td className="px-5 py-3 font-mono text-brand-text-secondary">{permission.action}</td>
                    <td className="px-5 py-3 text-brand-text-secondary">
                      {permission.isSystem ? (
                        <span className="rounded-md border border-brand-border bg-black/40 px-2 py-0.5 font-mono text-[10px] uppercase text-brand-accent">
                          Sim
                        </span>
                      ) : (
                        "Não"
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(permission)}
                          className="rounded border border-brand-border px-2.5 py-1 text-xs text-brand-accent transition-colors hover:text-white"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(permission.id)}
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
