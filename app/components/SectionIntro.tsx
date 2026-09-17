export function SectionIntro({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <header className="mb-8">
      <p className="text-sm text-accent">{label}</p>
      <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-3xl leading-relaxed text-ink-muted">
        {children}
      </p>
    </header>
  );
}
export function DocLink({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  return (
    <a
      className="text-accent underline underline-offset-4"
      href={`https://code.claude.com/docs/en/${path}`}
      target="_blank"
      rel="noreferrer"
    >
      {children} ↗
    </a>
  );
}
