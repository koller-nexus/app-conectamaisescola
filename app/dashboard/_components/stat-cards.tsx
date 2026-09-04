interface StatCardItem {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  icon: React.ReactNode;
}

export default function StatCards({ items }: { items: StatCardItem[] }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <div
          key={item.label}
          className="card card-accent card-hover p-4 animate-rise"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-wide text-brand-text-secondary">
              {item.label}
            </p>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-brand-border bg-black/40 text-brand-accent">
              {item.icon}
            </span>
          </div>
          <div className="mt-2 flex items-end justify-between gap-2">
            <p className="text-2xl font-semibold tracking-tight text-white">
              {item.value}
            </p>
            {item.delta && (
              <span
                className={`mb-0.5 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                  item.positive
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                {item.delta}
              </span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}