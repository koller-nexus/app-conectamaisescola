"use client";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface MockListProps<T> {
  title: string;
  columns: Column<T>[];
  rows: T[];
}

export default function MockList<T extends Record<string, unknown>>({
  title,
  columns,
  rows,
}: MockListProps<T>) {
  return (
    <div className="rounded-lg border border-brand-border bg-brand-surface">
      <div className="flex items-center justify-between border-b border-brand-border px-5 py-4">
        <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
          {title}
        </h2>
        <span className="rounded-md border border-brand-border bg-black/40 px-2 py-0.5 font-mono text-[11px] text-brand-text-secondary">
          {rows.length} registros
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-brand-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-text-secondary"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-brand-border/60 last:border-0 hover:bg-white/5"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3 text-brand-text-secondary">
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
    </div>
  );
}
