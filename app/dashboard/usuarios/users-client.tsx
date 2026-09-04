"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ScreenHeader from "../_components/screen-header";
import Pagination from "../_components/pagination";
import type { Page, Role, User } from "@/lib/api";

interface UserForm {
  name: string;
  last_name: string;
  email: string;
  password: string;
  active: boolean;
}

const EMPTY_FORM: UserForm = {
  name: "",
  last_name: "",
  email: "",
  password: "",
  active: true,
};

const PAGE_SIZE = 20;

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesByUser, setRolesByUser] = useState<Record<string, Role[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [roleModalUser, setRoleModalUser] = useState<User | null>(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [savingRoles, setSavingRoles] = useState(false);

  async function fetchUserRoles(userId: string) {
    try {
      const res = await fetch(`/api/users/${userId}/roles`);
      if (!res.ok) return;
      const data = (await res.json()) as Role[];
      setRolesByUser((prev) => ({ ...prev, [userId]: data }));
    } catch {
      // roles stay empty on failure
    }
  }

  const load = useCallback(async (targetPage: number) => {
    setError(null);
    try {
      const res = await fetch(
        `/api/users?page=${targetPage}&page_size=${PAGE_SIZE}`,
      );
      if (!res.ok) throw new Error();
      const data = (await res.json()) as Page<User>;
      setUsers(data.data);
      setTotalPages(data.total_pages);
      setTotalItems(data.total_items);
      await Promise.all(data.data.map((u) => fetchUserRoles(u.id)));
    } catch {
      setError("Não foi possível carregar os usuários.");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`/api/users?page=1&page_size=${PAGE_SIZE}`).then((res) =>
        res.ok ? res.json() : Promise.reject(new Error()),
      ),
      fetch("/api/roles?page_size=100").then((res) =>
        res.ok ? res.json() : Promise.reject(new Error()),
      ),
    ])
      .then(async ([userData, roleData]) => {
        if (cancelled) return;
        const userPage = userData as Page<User>;
        const roleList = (roleData as Page<Role>).data;
        setUsers(userPage.data);
        setTotalPages(userPage.total_pages);
        setTotalItems(userPage.total_items);
        setRoles(roleList);
        await Promise.all(userPage.data.map((u) => fetchUserRoles(u.id)));
      })
      .catch(() => {
        if (!cancelled) setError("Não foi possível carregar os usuários.");
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao criar usuário.");
        return;
      }
      setForm(EMPTY_FORM);
      await load(page);
    } catch {
      setError("Falha ao criar usuário.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        last_name: form.last_name,
        email: form.email,
        active: form.active,
      };
      if (form.password) payload.password = form.password;
      const res = await fetch(`/api/users/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao atualizar usuário.");
        return;
      }
      setEditingId(null);
      setForm(EMPTY_FORM);
      await load(page);
    } catch {
      setError("Falha ao atualizar usuário.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este usuário?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao excluir usuário.");
        return;
      }
      await load(page);
    } catch {
      setError("Falha ao excluir usuário.");
    }
  }

  function startEdit(user: User) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      last_name: user.last_name ?? "",
      email: user.email,
      password: "",
      active: user.active,
    });
  }

  function openRoleModal(user: User) {
    const current = rolesByUser[user.id] ?? [];
    setSelectedRoleIds(current.map((r) => r.id));
    setRoleModalUser(user);
  }

  function toggleRole(roleId: string) {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  }

  async function handleSaveRoles() {
    if (!roleModalUser) return;
    setSavingRoles(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${roleModalUser.id}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_ids: selectedRoleIds }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao atribuir papéis.");
        return;
      }
      await fetchUserRoles(roleModalUser.id);
      setRoleModalUser(null);
    } catch {
      setError("Falha ao atribuir papéis.");
    } finally {
      setSavingRoles(false);
    }
  }

  const inputClass = "input";

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title="Usuários"
        description="Contas de acesso da plataforma e seus papéis."
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
        onSubmit={editingId ? handleUpdate : handleCreate}
        className="card card-accent p-5"
      >
        <h2 className="mb-4 flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-white">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse-dot"
          />
          {editingId ? "Editar usuário" : "Novo usuário"}
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
              placeholder="ex: Maria"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="last_name" className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Sobrenome
            </label>
            <input
              id="last_name"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className={inputClass}
              placeholder="ex: Silva"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
              placeholder="ex: admin@escola.com"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              Senha {editingId ? "(opcional)" : ""}
            </label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass}
              placeholder="Mínimo 8 caracteres"
              minLength={editingId ? undefined : 8}
              required={!editingId}
            />
          </div>
          {editingId && (
            <div className="flex items-end gap-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-brand-text-secondary">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="h-4 w-4 rounded border-brand-border bg-black/40 accent-brand-primary"
                />
                Ativo
              </label>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary px-4 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
          >
            {saving ? "Salvando…" : editingId ? "Salvar alterações" : "Criar usuário"}
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
            Usuários
          </h2>
          <span className="rounded-full border border-brand-border bg-black/40 px-2.5 py-1 font-mono text-[11px] text-brand-text-secondary">
            {totalItems} registros
          </span>
        </div>
        {loading ? (
          <p className="px-5 py-6 text-sm text-brand-text-secondary">Carregando…</p>
        ) : users.length === 0 ? (
          <p className="px-5 py-6 text-sm text-brand-text-secondary">
            Nenhum usuário cadastrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border bg-black/20">
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Nome</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Email</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Papéis</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Status</th>
                  <th className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Email verificado</th>
                  <th className="px-5 py-3 text-right font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary">Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const userRoles = rolesByUser[user.id] ?? [];
                  return (
                    <tr key={user.id} className="border-b border-brand-border/60 last:border-0 hover:bg-brand-primary/[0.06]">
                      <td className="px-5 py-3 text-white">
                        {user.name}
                        {user.last_name ? ` ${user.last_name}` : ""}
                      </td>
                      <td className="px-5 py-3 text-brand-text-secondary">{user.email}</td>
                      <td className="px-5 py-3">
                        {userRoles.length === 0 ? (
                          <span className="text-brand-text-secondary">—</span>
                        ) : (
                          <div className="flex max-w-[220px] flex-wrap gap-1.5">
                            {userRoles.map((role) => (
                              <span
                                key={role.id}
                                className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 font-mono text-[10px] text-brand-accent"
                              >
                                {role.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-brand-text-secondary">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${user.active ? "bg-emerald-400" : "bg-zinc-500"}`}
                            aria-hidden="true"
                          />
                          {user.active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-brand-text-secondary">
                        {user.email_verified_at ? "Sim" : "Não"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openRoleModal(user)}
                            className="rounded border border-brand-border px-2.5 py-1 text-xs text-brand-text-secondary transition-colors hover:border-brand-accent/50 hover:text-white"
                          >
                            Papéis
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(user)}
                            className="rounded border border-brand-border px-2.5 py-1 text-xs text-brand-accent transition-colors hover:text-white"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
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

      {roleModalUser &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Papéis de ${roleModalUser.email}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setRoleModalUser(null)}
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
                    Papéis do usuário
                  </h2>
                  <p className="mt-1 break-all text-sm text-brand-text-secondary">
                    {roleModalUser.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
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

              {roles.length === 0 ? (
                <p className="mt-4 text-sm text-brand-text-secondary">
                  Nenhum papel cadastrado.
                </p>
              ) : (
                <div className="mt-5 flex max-h-[50vh] flex-col gap-2 overflow-y-auto">
                  {roles.map((role) => {
                    const checked = selectedRoleIds.includes(role.id);
                    return (
                      <label
                        key={role.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                          checked
                            ? "border-brand-accent/50 bg-brand-primary/10"
                            : "border-brand-border bg-black/40 hover:border-brand-accent/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRole(role.id)}
                          className="mt-0.5 h-4 w-4 rounded border-brand-border accent-brand-primary"
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-white">
                            {role.name}
                          </span>
                          {role.description && (
                            <span className="mt-0.5 block text-xs text-brand-text-secondary">
                              {role.description}
                            </span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRoleModalUser(null)}
                  className="flex h-10 items-center rounded-lg border border-brand-border px-4 text-sm text-brand-text-secondary transition-colors hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveRoles}
                  disabled={savingRoles || roles.length === 0}
                  className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary px-4 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
                >
                  {savingRoles ? "Salvando…" : "Salvar papéis"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}