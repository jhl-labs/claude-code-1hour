type Props = {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
};
export function Card({ title, eyebrow, children, className = "" }: Props) {
  return (
    <article className={`rounded-lg bg-bg-soft p-6 ring-1 ring-white/5 ${className}`}>
      {eyebrow && <div className="mb-1 text-xs uppercase tracking-wider text-accent">{eyebrow}</div>}
      {title && <h3 className="mb-3 text-xl font-semibold">{title}</h3>}
      <div className="text-ink-soft leading-relaxed">{children}</div>
    </article>
  );
}
