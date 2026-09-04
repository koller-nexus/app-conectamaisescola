"use client";

import { useMemo, useState } from "react";

interface Column<T> {
  key: string;
  label: string;
  headerClassName?: string;
  cellClassName?: string;
  render?: (row: T) => React.ReactNode;
}

interface MockListProps<T> {
  title: string;
  columns: Column<T>[];
  rows: T[];
  icon?: React.ReactNode;
  action?: React.ReactNode;
  searchable?: boolean;
  searchKeys?: string[];
  searchPlaceholder?: string;
  emptyText?: string;
  countLabel?: string;
  loading?: boolean;
}

export default function MockList<T extends Record<string, unknown>>({
  title,
  columns,
  rows,
  icon,
  action,
  searchable = false,
  searchKeys,
  searchPlaceholder = "Buscar…",
  emptyText = "Nenhum registro encontrado.",
  countLabel = "registros",
  loading = false,
}: MockListProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return rows;
    const q = query.trim().toLowerCase();
    const keys =
      searchKeys && searchKeys.length > 0
        ? searchKeys
        : columns.map((c) => c.key);
    return rows.filter((row) =>
      keys.some((key) =>
        String(row[key] ?? "").toLowerCase().includes(q),
      ),
    );
  }, [rows, query, searchable, searchKeys, columns]);

  return (
    <div className="card card-accent overflow-hidden animate-rise">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border bg-black/20 px-5 py-4">
        <div className="flex items-center gap-3">
          {icon && (
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand-border bg-gradient-to-b from-brand-accent/15 to-transparent text-brand-accent">
              {icon}
            </span>
          )}
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-brand-accent animate-pulse-dot"
            />
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
              {title}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!searchable && (
            <span className="rounded-full border border-brand-border bg-black/40 px-2.5 py-1 font-mono text-[11px] text-brand-text-secondary">
              {filtered.length} {countLabel}
            </span>
          )}
          {action}
        </div>
      </div>

      {searchable && (
        <div className="border-b border-brand-border bg-black/10 px-5 py-3">
          <div className="relative max-w-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-3 my-auto h-4 w-4 text-zinc-500"
            >
              <path
                d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={`Buscar em ${title}`}
              className="input h-9 pl-9 text-sm"
            />
          </div>
          <p className="mt-2 font-mono text-[11px] text-brand-text-secondary">
            {filtered.length} de {rows.length} {countLabel}
          </p>
        </div>
      )}

      {loading ? (
        <p className="px-5 py-6 text-sm text-brand-text-secondary">
          Carregando…
        </p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-border bg-black/40 text-zinc-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M21 21l-4.3-4.3M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8 11h6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <p className="text-sm text-brand-text-secondary">{emptyText}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-brand-border bg-black/20">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={`px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary ${
                      col.headerClassName ?? ""
                    }`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-brand-border/60 last:border-0 transition-colors hover:bg-brand-primary/[0.06]"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-3.5 text-brand-text-secondary ${
                        col.cellClassName ?? ""
                      }`}
                    >
                      {col.render
                        ? col.render(row)
                        : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}