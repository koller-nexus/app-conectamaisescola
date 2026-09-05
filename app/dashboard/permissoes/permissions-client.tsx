"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScreenHeader from "../_components/screen-header";
import DataTable from "../_components/data-table";
import type { Page, Permission } from "@/lib/api";

const PAGE_SIZE = 10;

export default function PermissionsClient() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/permissions?page=1&page_size=${PAGE_SIZE}`)
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
        `/api/permissions?page=${targetPage}&page_size=${PAGE_SIZE}`,
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

      <DataTable<Permission>
        title="Permissões existentes"
        rows={permissions}
        rowKey={(p) => p.id}
        loading={loading}
        emptyText="Nenhuma permissão cadastrada."
        countLabel="registros"
        totalItems={totalItems}
        page={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        onPageChange={changePage}
        action={
          <Link
            href="/dashboard/permissoes/novo"
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
            Nova permissão
          </Link>
        }
        columns={[
          {
            key: "name",
            label: "Nome",
            cellClassName: "text-white",
            render: (permission) => (
              <Link
                href={`/dashboard/permissoes/${permission.id}`}
                className="font-medium text-white transition-colors hover:text-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
              >
                {permission.name}
              </Link>
            ),
          },
          {
            key: "resource",
            label: "Recurso",
            cellClassName: "font-mono",
            render: (permission) => (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-brand-accent">
                {permission.resource}
              </span>
            ),
          },
          {
            key: "action",
            label: "Ação",
            cellClassName: "font-mono",
          },
          {
            key: "actions",
            label: "Ações",
            headerClassName: "text-right",
            cellClassName: "text-right",
            render: (permission) => (
              <Link
                href={`/dashboard/permissoes/${permission.id}`}
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