"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/api";

interface UserFormProps {
  mode: "create" | "edit";
  initial?: User;
}

interface UserFormState {
  name: string;
  last_name: string;
  email: string;
  password: string;
  active: boolean;
}

export default function UserForm({ mode, initial }: UserFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<UserFormState>({
    name: initial?.name ?? "",
    last_name: initial?.last_name ?? "",
    email: initial?.email ?? "",
    password: "",
    active: initial?.active ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!initial || !confirm("Excluir este usuário?")) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${initial.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao excluir usuário.");
        return;
      }
      router.push("/dashboard/usuarios");
      router.refresh();
    } catch {
      setError("Falha ao excluir usuário.");
    } finally {
      setDeleting(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const isEdit = mode === "edit" && initial;
      const url = isEdit ? `/api/users/${initial!.id}` : "/api/users";
      const payload: Record<string, unknown> = {
        name: form.name,
        last_name: form.last_name,
        email: form.email,
      };
      if (isEdit) payload.active = form.active;
      if (form.password) payload.password = form.password;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? (isEdit ? "Falha ao atualizar usuário." : "Falha ao criar usuário."));
        return;
      }
      router.push("/dashboard/usuarios");
      router.refresh();
    } catch {
      setError(mode === "edit" ? "Falha ao atualizar usuário." : "Falha ao criar usuário.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "input";

  return (
    <form
      onSubmit={handleSubmit}
      className="card card-accent p-5 animate-rise"
    >
      <h2 className="mb-4 flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-white">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse-dot"
        />
        {mode === "edit" ? "Editar usuário" : "Novo usuário"}
      </h2>

      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {error}
        </p>
      ) : null}

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
            Senha {mode === "edit" ? "(opcional)" : ""}
          </label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={inputClass}
            placeholder="Mínimo 8 caracteres"
            minLength={mode === "edit" ? undefined : 8}
            required={mode === "create"}
          />
        </div>
        {mode === "edit" && (
          <div className="flex items-end">
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
          className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary px-4 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          {saving
            ? "Salvando…"
            : mode === "edit"
              ? "Salvar alterações"
              : "Criar usuário"}
        </button>
        <button
          type="button"
          onClick={() => {
            router.push("/dashboard/usuarios");
            router.refresh();
          }}
          className="flex h-10 items-center rounded-lg border border-brand-border px-4 text-sm text-brand-text-secondary transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          Cancelar
        </button>
      </div>

      {mode === "edit" && initial && (
        <div className="mt-6 border-t border-brand-border pt-5">
          <div className="flex items-center justify-between gap-3 rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-red-300">Excluir usuário</p>
              <p className="text-xs text-brand-text-secondary">
                Remove a conta de acesso permanentemente.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex h-9 shrink-0 items-center rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-60"
            >
              {deleting ? "Excluindo…" : "Excluir"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}