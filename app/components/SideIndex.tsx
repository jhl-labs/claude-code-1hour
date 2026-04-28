"use client";
import { sections } from "@/app/lib/sections";

type Props = { activeId: string | null };

export function SideIndex({ activeId }: Props) {
  return (
    <nav
      aria-label="강의 인덱스"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
    >
      <ul className="space-y-3 text-sm">
        {sections.map((s) => {
          const isActive = s.id === activeId;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                data-active={isActive}
                className={
                  "flex items-center gap-3 py-1 transition-colors duration-300 ease-smooth " +
                  (isActive ? "text-accent" : "text-ink-muted hover:text-ink-soft")
                }
              >
                <span
                  aria-hidden
                  className={
                    "block h-2 w-2 rounded-full " +
                    (isActive ? "bg-accent" : "bg-ink-muted/50")
                  }
                />
                <span>{s.number !== null ? `§${s.number} ` : ""}{s.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
