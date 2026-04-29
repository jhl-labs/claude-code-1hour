export type SectionMeta = {
  id: "hero" | "history" | "features" | "embedded-demos" | "impact" | "getting-started" | "qa";
  number: number | null;     // 인덱스에 보이는 번호 (Hero/QA는 null)
  title: string;             // 짧은 제목 (사이드 인덱스용)
  longTitle: string;         // 본문 헤딩
  durationMinutes: number;   // 강의 시간 배분
};

export const sections: readonly SectionMeta[] = [
  { id: "hero",            number: null, title: "Hero",     longTitle: "Claude Code 1시간",                              durationMinutes: 2 },
  { id: "history",         number: 1,    title: "Claude Code란?", longTitle: "Claude Code란? + 지금 왜 봐야 하나",         durationMinutes: 4 },
  { id: "features",        number: 2,    title: "핵심 기능",  longTitle: "핵심 기능 투어",                                durationMinutes: 12 },
  { id: "embedded-demos",  number: 3,    title: "임베디드 데모", longTitle: "임베디드 라이브 데모 — U-Boot 메모리 서브시스템", durationMinutes: 24 },
  { id: "impact",          number: 4,    title: "효과",       longTitle: "효과 — 생산성과 검토 품질이 어떻게 바뀌나",        durationMinutes: 6 },
  { id: "getting-started", number: 5,    title: "시작하기",   longTitle: "시작하기 + 다음 7일",                             durationMinutes: 7 },
  { id: "qa",              number: null, title: "Q&A",       longTitle: "Q&A",                                            durationMinutes: 5 },
];

export function totalDurationMinutes(): number {
  return sections.reduce((acc, s) => acc + s.durationMinutes, 0);
}
