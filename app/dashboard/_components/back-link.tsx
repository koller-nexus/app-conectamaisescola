import Link from "next/link";

interface BackLinkProps {
  href: string;
  label: string;
}

export default function BackLink({ href, label }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border bg-black/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide text-brand-text-secondary transition-colors hover:border-brand-accent/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path
          d="M15 5l-7 7 7 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </Link>
  );
}