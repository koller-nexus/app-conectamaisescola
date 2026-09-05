"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Permission } from "@/lib/api";

interface PermissionsManagerProps {
  roleId: string;
  roleName: string;
  allPermissions: Permission[];
  initialPermissionIds: string[];
}

export default function PermissionsManager({
  roleId,
  roleName,
  allPermissions,
  initialPermissionIds,
}: PermissionsManagerProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(initialPermissionIds);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function toggle(permissionId: string) {
    setSaved(false);
    setSelected((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/roles/${roleId}/permissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission_ids: selected }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Falha ao atribuir permissões.");
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Falha ao atribuir permissões.");
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
          Permissões do papel
        </h2>
        <p className="mt-1 text-sm text-brand-text-secondary">{roleName}</p>
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
          Permissões atualizadas.
        </p>
      ) : null}

      {allPermissions.length === 0 ? (
        <p className="px-5 py-6 text-sm text-brand-text-secondary">
          Nenhuma permissão cadastrada.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-2 p-5 sm:grid-cols-2">
          {allPermissions.map((permission) => {
            const checked = selected.includes(permission.id);
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
                  onChange={() => toggle(permission.id)}
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

      <div className="flex items-center justify-end gap-2 border-t border-brand-border bg-black/20 px-5 py-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || allPermissions.length === 0}
          className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary px-4 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          {saving ? "Salvando…" : "Salvar permissões"}
        </button>
      </div>
    </div>
  );
}