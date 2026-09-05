"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ScreenHeader from "../_components/screen-header";
import DataTable from "../_components/data-table";
import type { Page, Permission, Role } from "@/lib/api";

const PAGE_SIZE = 10;

export default function RolesClient() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissionsByRole, setPermissionsByRole] = useState<
    Record<string, Permission[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

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
    fetch(`/api/roles?page=1&page_size=${PAGE_SIZE}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .then(async (data) => {
        if (cancelled) return;
        const rolePage = data as Page<Role>;
        setRoles(rolePage.data);
        setTotalPages(rolePage.total_pages);
        setTotalItems(rolePage.total_items);
        await Promise.all(rolePage.data.map((r) => fetchRolePermissions(r.id)));
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

      <DataTable<Role>
        title="Papéis existentes"
        rows={roles}
        rowKey={(r) => r.id}
        loading={loading}
        emptyText="Nenhum papel cadastrado."
        countLabel="registros"
        totalItems={totalItems}
        page={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        onPageChange={changePage}
        action={
          <Link
            href="/dashboard/papeis/novo"
            className="flex h-9 items-center gap-1.5 rounded-lg bg-gradient-to-b from-brand-accent to-brand-primary px-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Novo papel
          </Link>
        }
        columns={[
          {
            key: "name",
            label: "Nome",
            cellClassName: "text-white",
            render: (role) => (
              <Link
                href={`/dashboard/papeis/${role.id}`}
                className="font-medium text-white transition-colors hover:text-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
              >
                {role.name}
              </Link>
            ),
          },
          {
            key: "description",
            label: "Descrição",
            render: (role) => role.description || "—",
          },
          {
            key: "permissions",
            label: "Permissões",
            render: (role) => {
              const count = permissionsByRole[role.id]?.length ?? 0;
              return count === 0 ? (
                <span className="text-brand-text-secondary">—</span>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[11px] text-brand-text-secondary">
                    {count} permissões
                  </span>
                </span>
              );
            },
          },
          {
            key: "actions",
            label: "Ações",
            headerClassName: "text-right",
            cellClassName: "text-right",
            render: (role) => (
              <Link
                href={`/dashboard/papeis/${role.id}`}
                className="inline-flex items-center gap-1 rounded border border-brand-border px-2.5 py-1 text-xs text-brand-text-secondary transition-colors hover:border-brand-accent/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                Ver
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}