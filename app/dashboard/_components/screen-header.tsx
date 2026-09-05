interface ScreenHeaderProps {
  title: string;
  description?: string;
}

export default function ScreenHeader({ title, description }: ScreenHeaderProps) {
  return (
    <div className="flex flex-col gap-1.5 animate-rise">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-6 w-1 shrink-0 rounded-full bg-gradient-to-b from-brand-accent to-brand-primary/40"
        />
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h1>
      </div>
      {description ? (
        <p className="pl-4 text-sm leading-relaxed text-brand-text-secondary">
          {description}
        </p>
      ) : null}
    </div>
  );
}