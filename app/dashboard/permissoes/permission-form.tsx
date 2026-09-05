"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Permission } from "@/lib/api";

interface PermissionFormProps {
  mode: "create" | "edit";
  initial?: Permission;
}

export default function PermissionForm({ mode, initial }: PermissionFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    resource: initial?.resource ?? "",
    action: initial?.action ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!initial || !confirm("Excluir esta permissão?")) return;
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/permissions/${initial.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao excluir permissão.");
        return;
      }
      router.push("/dashboard/permissoes");
      router.refresh();
    } catch {
      setError("Falha ao excluir permissão.");
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
      const url = isEdit
        ? `/api/permissions/${initial!.id}`
        : "/api/permissions";
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao salvar permissão.");
        return;
      }
      router.push("/dashboard/permissoes");
      router.refresh();
    } catch {
      setError("Falha ao salvar permissão.");
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
        {mode === "edit" ? "Editar permissão" : "Nova permissão"}
      </h2>

      {error ? (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {error}
        </p>
      ) : null}

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
          className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary px-4 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          {saving ? "Salvando…" : mode === "edit" ? "Salvar alterações" : "Criar permissão"}
        </button>
        <button
          type="button"
          onClick={() => {
            router.push("/dashboard/permissoes");
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
              <p className="text-sm font-semibold text-red-300">Excluir permissão</p>
              <p className="text-xs text-brand-text-secondary">
                Remove a permissão do catálogo.
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