import type { SectionMeta } from "@/app/lib/sections";
type Props = {
  section: SectionMeta;
  onEnter?: (id: SectionMeta["id"]) => void;
  children: React.ReactNode;
};
export function ScrollSection({ section, children }: Props) {
  return (
    <section
      id={section.id}
      data-section-id={section.id}
      className="min-h-screen flex flex-col justify-center px-5 py-16 sm:px-8 lg:pl-64 lg:pr-16 xl:pr-24"
    >
      {children}
    </section>
  );
}
