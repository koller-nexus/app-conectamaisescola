"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ScreenHeader from "../_components/screen-header";
import Pagination from "../_components/pagination";
import type { Page, Permission, Role } from "@/lib/api";

interface RoleForm {
  name: string;
  description: string;
}

const EMPTY_FORM: RoleForm = { name: "", description: "" };

const PAGE_SIZE = 20;

export default function RolesClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsByRole, setPermissionsByRole] = useState<
    Record<string, Permission[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [form, setForm] = useState<RoleForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [permModalRole, setPermModalRole] = useState<Role | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    [],
  );
  const [savingPermissions, setSavingPermissions] = useState(false);

  async function fetchRolePermissions(roleId: string) {
    try {
      const res = await fetch(`/api/roles/${roleId}/permissions`);
      if (!res.ok) return;
      const data = (await res.json()) as Permission[];
      setPermissionsByRole((prev) => ({ ...prev, [roleId]: data }));
    } catch {
      // permissions stay empty on failure
    }
  }

  const load = useCallback(async (targetPage: number) => {
    setError(null);
    try {
      const res = await fetch(
        `/api/roles?page=${targetPage}&page_size=${PAGE_SIZE}`,
      );
      if (!res.ok) throw new Error();
      const data = (await res.json()) as Page<Role>;
      setRoles(data.data);
      setTotalPages(data.total_pages);
      setTotalItems(data.total_items);
      await Promise.all(data.data.map((r) => fetchRolePermissions(r.id)));
    } catch {
      setError("Não foi possível carregar os papéis.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`/api/roles?page=1&page_size=${PAGE_SIZE}`).then((res) =>
        res.ok ? res.json() : Promise.reject(new Error()),
      ),
      fetch("/api/permissions?page_size=100").then((res) =>
        res.ok ? res.json() : Promise.reject(new Error()),
      ),
    ])
      .then(async ([roleData, permData]) => {
        if (cancelled) return;
        const rolePage = roleData as Page<Role>;
        setRoles(rolePage.data);
        setTotalPages(rolePage.total_pages);
        setTotalItems(rolePage.total_items);
        setPermissions((permData as Page<Permission>).data);
        await Promise.all(
          rolePage.data.map((r) => fetchRolePermissions(r.id)),
        );
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
      await load(page);
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
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao excluir papel.");
        return;
      }
      await load(page);
    } catch {
      setError("Falha ao excluir papel.");
    }
  }

  function startEdit(role: Role) {
    setEditingId(role.id);
    setForm({
      name: role.name,
      description: role.description ?? "",
    });
  }

  function openPermissionModal(role: Role) {
    const current = permissionsByRole[role.id] ?? [];
    setSelectedPermissionIds(current.map((p) => p.id));
    setPermModalRole(role);
  }

  function togglePermission(permissionId: string) {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  }

  async function handleSavePermissions() {
    if (!permModalRole) return;
    setSavingPermissions(true);
    setError(null);
    try {
      const res = await fetch(`/api/roles/${permModalRole.id}/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission_ids: selectedPermissionIds }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao atribuir permissões.");
        return;
      }
      await fetchRolePermissions(permModalRole.id);
      setPermModalRole(null);
    } catch {
      setError("Falha ao atribuir permissões.");
    } finally {
      setSavingPermissions(false);
    }
  }

  const inputClass = "input";

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Papéis"
        description="Gerencie os papéis de acesso e suas permissões."
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
          {editingId ? "Editar papel" : "Novo papel"}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary px-4 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
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

      <div className="card card-accent overflow-hidden">
        <div className="flex items-center justify-between border-b border-brand-border bg-black/20 px-5 py-4">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
            Papéis existentes
          </h2>
          <span className="rounded-full border border-brand-border bg-black/40 px-2.5 py-1 font-mono text-[11px] text-brand-text-secondary">
            {totalItems} registros
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
                <tr className="border-b border-brand-border bg-black/20">
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Nome</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Descrição</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Permissões</th>
                  <th className="px-5 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Ações</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => {
                  const rolePermissions = permissionsByRole[role.id] ?? [];
                  return (
                    <tr key={role.id} className="border-b border-brand-border/60 last:border-0 hover:bg-brand-primary/[0.06]">
                      <td className="px-5 py-3 text-white">{role.name}</td>
                      <td className="px-5 py-3 text-brand-text-secondary">{role.description || "—"}</td>
                      <td className="px-5 py-3">
                        {rolePermissions.length === 0 ? (
                          <span className="text-brand-text-secondary">—</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                              aria-hidden="true"
                            />
                            <span className="font-mono text-[11px] text-brand-text-secondary">
                              {rolePermissions.length} permissões
                            </span>
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openPermissionModal(role)}
                            className="rounded border border-brand-border px-2.5 py-1 text-xs text-brand-text-secondary transition-colors hover:border-brand-accent/50 hover:text-white"
                          >
                            Permissões
                          </button>
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

      {permModalRole &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Permissões do papel ${permModalRole.name}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setPermModalRole(null)}
              className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
            />
            <div className="card relative w-full max-w-md p-6 shadow-2xl shadow-black/50 animate-rise">
              <span
                aria-hidden="true"
                className="absolute left-6 right-6 top-0 h-px bg-gradient-to-r from-transparent via-brand-accent/80 to-transparent"
              />
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Permissões do papel
                  </h2>
                  <p className="mt-1 text-sm text-brand-text-secondary">
                    {permModalRole.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPermModalRole(null)}
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

              {permissions.length === 0 ? (
                <p className="mt-4 text-sm text-brand-text-secondary">
                  Nenhuma permissão cadastrada.
                </p>
              ) : (
                <div className="mt-5 flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
                  {permissions.map((permission) => {
                    const checked = selectedPermissionIds.includes(
                      permission.id,
                    );
                    return (
                      <label
                        key={permission.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                          checked
                            ? "border-brand-accent/50 bg-brand-primary/10"
                            : "border-brand-border bg-black/40 hover:border-brand-accent/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePermission(permission.id)}
                          className="mt-0.5 h-4 w-4 rounded border-brand-border accent-brand-primary"
                        />
                        <span className="min-w-0">
                          <span className="block font-mono text-sm text-white">
                            {permission.name}
                          </span>
                          <span className="mt-0.5 block font-mono text-xs text-brand-text-secondary">
                            {permission.resource}:{permission.action}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPermModalRole(null)}
                  className="flex h-10 items-center rounded-lg border border-brand-border px-4 text-sm text-brand-text-secondary transition-colors hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  disabled={savingPermissions || permissions.length === 0}
                  className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary px-4 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
                >
                  {savingPermissions ? "Salvando…" : "Salvar permissões"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}