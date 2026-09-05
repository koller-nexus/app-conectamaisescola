"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import ScreenHeader from "../_components/screen-header";
import DataTable from "../_components/data-table";
import type { Page, Role, User } from "@/lib/api";

const PAGE_SIZE = 10;

function roleBadge(role: Role) {
  return (
    <span
      key={role.id}
      className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 font-mono text-[10px] text-brand-accent"
    >
      {role.name}
    </span>
  );
}

export default function UsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [rolesByUser, setRolesByUser] = useState<Record<string, Role[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

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
    fetch(`/api/users?page=1&page_size=${PAGE_SIZE}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error())))
      .then(async (data) => {
        if (cancelled) return;
        const userPage = data as Page<User>;
        setUsers(userPage.data);
        setTotalPages(userPage.total_pages);
        setTotalItems(userPage.total_items);
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

      <DataTable<User>
        title="Usuários"
        rows={users}
        rowKey={(u) => u.id}
        loading={loading}
        emptyText="Nenhum usuário cadastrado."
        countLabel="registros"
        totalItems={totalItems}
        page={page}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        onPageChange={changePage}
        action={
          <Link
            href="/dashboard/usuarios/novo"
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
            Novo usuário
          </Link>
        }
        columns={[
          {
            key: "name",
            label: "Nome",
            cellClassName: "text-white",
            render: (user) => (
              <Link
                href={`/dashboard/usuarios/${user.id}`}
                className="font-medium text-white transition-colors hover:text-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
              >
                {user.name}
                {user.last_name ? ` ${user.last_name}` : ""}
              </Link>
            ),
          },
          {
            key: "email",
            label: "Email",
            render: (user) => (
              <Link
                href={`/dashboard/usuarios/${user.id}`}
                className="transition-colors hover:text-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
              >
                {user.email}
              </Link>
            ),
          },
          {
            key: "roles",
            label: "Papéis",
            render: (user) => {
              const userRoles = rolesByUser[user.id] ?? [];
              return userRoles.length === 0 ? (
                <span className="text-brand-text-secondary">—</span>
              ) : (
                <div className="flex max-w-[220px] flex-wrap gap-1.5">
                  {userRoles.map(roleBadge)}
                </div>
              );
            },
          },
          {
            key: "active",
            label: "Status",
            render: (user) => (
              <span className="inline-flex items-center gap-1.5">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${user.active ? "bg-emerald-400" : "bg-zinc-500"}`}
                  aria-hidden="true"
                />
                {user.active ? "Ativo" : "Inativo"}
              </span>
            ),
          },
          {
            key: "email_verified_at",
            label: "Email verificado",
            render: (user) =>
              user.email_verified_at ? (
                <span className="inline-flex items-center gap-1.5 text-brand-text-secondary">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-3.5 w-3.5 text-emerald-400"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Sim
                </span>
              ) : (
                "Não"
              ),
          },
          {
            key: "actions",
            label: "Ações",
            headerClassName: "text-right",
            cellClassName: "text-right",
            render: (user) => (
              <Link
                href={`/dashboard/usuarios/${user.id}`}
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