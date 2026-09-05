"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Role } from "@/lib/api";

interface RolesManagerProps {
  userId: string;
  userLabel: string;
  allRoles: Role[];
  initialRoleIds: string[];
}

export default function RolesManager({
  userId,
  userLabel,
  allRoles,
  initialRoleIds,
}: RolesManagerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(initialRoleIds);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function toggle(roleId: string) {
    setSaved(false);
    setSelected((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/users/${userId}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role_ids: selected }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao atribuir papéis.");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Falha ao atribuir papéis.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card card-accent overflow-hidden animate-rise">
      <div className="border-b border-brand-border bg-black/20 px-5 py-4">
        <h2 className="flex items-center gap-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-white">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse-dot"
          />
          Papéis do usuário
        </h2>
        <p className="mt-1 break-all text-sm text-brand-text-secondary">
          {userLabel}
        </p>
      </div>

      {error ? (
        <p
          role="alert"
          className="mx-5 mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300"
        >
          {error}
        </p>
      ) : null}
      {saved ? (
        <p
          role="status"
          className="mx-5 mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400"
        >
          Papéis atualizados.
        </p>
      ) : null}

      {allRoles.length === 0 ? (
        <p className="px-5 py-6 text-sm text-brand-text-secondary">
          Nenhum papel cadastrado.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-2 p-5 sm:grid-cols-2">
          {allRoles.map((role) => {
            const checked = selected.includes(role.id);
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
                  onChange={() => toggle(role.id)}
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

      <div className="flex items-center justify-end gap-2 border-t border-brand-border bg-black/20 px-5 py-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || allRoles.length === 0}
          className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary px-4 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          {saving ? "Salvando…" : "Salvar papéis"}
        </button>
      </div>
    </div>
  );
}