"use client";

import { useEffect, useState } from "react";
import ScreenHeader from "../_components/screen-header";
import Pagination from "../_components/pagination";
import type { Page, Permission } from "@/lib/api";

interface PermissionForm {
  name: string;
  resource: string;
  action: string;
}

const EMPTY_FORM: PermissionForm = {
  name: "",
  resource: "",
  action: "",
};

export default function PermissionsClient() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [form, setForm] = useState<PermissionForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/permissions?page=1&page_size=20")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .then((data) => {
        if (cancelled) return;
        const pageData = data as Page<Permission>;
        setPermissions(pageData.data);
        setTotalPages(pageData.total_pages);
        setTotalItems(pageData.total_items);
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

  async function load(targetPage: number) {
    setError(null);
    try {
      const res = await fetch(
        `/api/permissions?page=${targetPage}&page_size=20`,
      );
      if (!res.ok) throw new Error();
      const pageData = (await res.json()) as Page<Permission>;
      setPermissions(pageData.data);
      setTotalPages(pageData.total_pages);
      setTotalItems(pageData.total_items);
    } catch {
      setError("Não foi possível carregar as permissões.");
    }
  }

  function changePage(next: number) {
    setPage(next);
    void load(next);
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
      await load(page);
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
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao excluir permissão.");
        return;
      }
      await load(page);
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
    });
  }

  const inputClass = "input";

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
        className="card card-accent p-5"
      >
        <h2 className="mb-4 flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-white">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse-dot"
          />
          {editingId ? "Editar permissão" : "Nova permissão"}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Nome
            </label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="ex: users:create"
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
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary px-4 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
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

      <div className="card card-accent overflow-hidden">
        <div className="flex items-center justify-between border-b border-brand-border bg-black/20 px-5 py-4">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
            Permissões existentes
          </h2>
          <span className="rounded-full border border-brand-border bg-black/40 px-2.5 py-1 font-mono text-[11px] text-brand-text-secondary">
            {totalItems} registros
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
                <tr className="border-b border-brand-border bg-black/20">
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Nome</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Recurso</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Ação</th>
                  <th className="px-5 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Ações</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission) => (
                  <tr key={permission.id} className="border-b border-brand-border/60 last:border-0 hover:bg-brand-primary/[0.06]">
                    <td className="px-5 py-3 text-white">{permission.name}</td>
                    <td className="px-5 py-3 font-mono text-brand-text-secondary">{permission.resource}</td>
                    <td className="px-5 py-3 font-mono text-brand-text-secondary">{permission.action}</td>
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
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={20}
          onPageChange={changePage}
        />
      </div>
    </div>
  );
}