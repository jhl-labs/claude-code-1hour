type Tone = "info" | "warn" | "ok";
type Props = { tone?: Tone; title?: string; children: React.ReactNode };

const toneClass: Record<Tone, string> = {
  info: "border-accent/40 bg-accent/5",
  warn: "border-warn/40 bg-warn/5",
  ok: "border-ok/40 bg-ok/5",
};
export function Callout({ tone = "info", title, children }: Props) {
  return (
    <div className={`rounded-md border-l-4 px-4 py-3 ${toneClass[tone]}`}>
      {title && <div className="mb-1 font-semibold">{title}</div>}
      <div className="text-ink-soft">{children}</div>
    </div>
  );
}
