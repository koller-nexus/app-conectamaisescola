"use client";

import Pagination from "./pagination";

export interface DataTableColumn<T> {
  key: string;
  label: string;
  headerClassName?: string;
  cellClassName?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  icon?: React.ReactNode;
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  action?: React.ReactNode;
  loading?: boolean;
  emptyText?: string;
  countLabel?: string;
  totalItems?: number;
  page?: number;
  totalPages?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export default function DataTable<T>({
  title,
  icon,
  columns,
  rows,
  rowKey,
  action,
  loading = false,
  emptyText = "Nenhum registro encontrado.",
  countLabel = "registros",
  totalItems,
  page,
  totalPages,
  pageSize,
  onPageChange,
}: DataTableProps<T>) {
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
          {totalItems !== undefined && (
            <span className="rounded-full border border-brand-border bg-black/40 px-2.5 py-1 font-mono text-[11px] text-brand-text-secondary">
              {totalItems} {countLabel}
            </span>
          )}
          {action}
        </div>
      </div>

      {loading ? (
        <p className="px-5 py-6 text-sm text-brand-text-secondary">
          Carregando…
        </p>
      ) : rows.length === 0 ? (
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
              {rows.map((row) => (
                <tr
                  key={rowKey(row)}
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
                        : String((row as Record<string, unknown>)[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {onPageChange &&
        page !== undefined &&
        totalPages !== undefined &&
        totalItems !== undefined &&
        pageSize !== undefined && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        )}
    </div>
  );
}