"use client";

import { useEffect, useState } from "react";
import ScreenHeader from "../_components/screen-header";
import type { Role } from "@/lib/api";

interface RoleForm {
  code: string;
  name: string;
  description: string;
}

const EMPTY_FORM: RoleForm = { code: "", name: "", description: "" };

export default function RolesClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<RoleForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/roles")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .then((data) => {
        if (!cancelled) setRoles(data as Role[]);
      })
      .catch(() => {
        if (!cancelled) setError("Não foi possível carregar os papéis.");
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
      const res = await fetch("/api/roles");
      if (!res.ok) throw new Error();
      setRoles(await res.json());
    } catch {
      setError("Não foi possível carregar os papéis.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/roles/${editingId}` : "/api/roles";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao salvar papel.");
        return;
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      await load();
    } catch {
      setError("Falha ao salvar papel.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este papel?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/roles/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Falha ao excluir papel.");
        return;
      }
      await load();
    } catch {
      setError("Falha ao excluir papel.");
    }
  }

  function startEdit(role: Role) {
    setEditingId(role.id);
    setForm({
      code: role.code,
      name: role.name,
      description: role.description ?? "",
    });
  }

  const inputClass =
    "h-10 w-full rounded-lg border border-brand-border bg-black/40 px-3.5 text-sm text-white placeholder:text-zinc-600 transition-colors focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30";

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Papéis"
        description="Gerencie os papéis de acesso da organização."
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
          {editingId ? "Editar papel" : "Novo papel"}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="code" className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Código
            </label>
            <input
              id="code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className={inputClass}
              placeholder="ex: coordenador"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Nome
            </label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="ex: Coordenador"
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
              placeholder="Descrição do papel"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex h-10 items-center justify-center rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover disabled:opacity-60"
          >
            {saving ? "Salvando…" : editingId ? "Salvar alterações" : "Criar papel"}
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
            Papéis existentes
          </h2>
          <span className="rounded-md border border-brand-border bg-black/40 px-2 py-0.5 font-mono text-[11px] text-brand-text-secondary">
            {roles.length} registros
          </span>
        </div>
        {loading ? (
          <p className="px-5 py-6 text-sm text-brand-text-secondary">Carregando…</p>
        ) : roles.length === 0 ? (
          <p className="px-5 py-6 text-sm text-brand-text-secondary">
            Nenhum papel cadastrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Código</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Nome</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Descrição</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Permissões</th>
                  <th className="px-5 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Ações</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b border-brand-border/60 last:border-0 hover:bg-white/5">
                    <td className="px-5 py-3 font-mono text-brand-text-secondary">{role.code}</td>
                    <td className="px-5 py-3 text-white">{role.name}</td>
                    <td className="px-5 py-3 text-brand-text-secondary">{role.description || "—"}</td>
                    <td className="px-5 py-3 text-brand-text-secondary">
                      {role.permissions?.length ?? 0}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(role)}
                          className="rounded border border-brand-border px-2.5 py-1 text-xs text-brand-accent transition-colors hover:text-white"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(role.id)}
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
