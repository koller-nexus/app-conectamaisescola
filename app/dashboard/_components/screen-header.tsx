interface ScreenHeaderProps {
  title: string;
  description?: string;
}

export default function ScreenHeader({ title, description }: ScreenHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight text-white">{title}</h1>
      {description ? (
        <p className="mt-1 text-sm text-brand-text-secondary">{description}</p>
      ) : null}
    </div>
  );
}
