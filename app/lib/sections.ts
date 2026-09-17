export type SectionMeta = {
  id: "hero" | "history" | "features" | "embedded-demos" | "impact" | "getting-started" | "qa";
  number: number | null;     // 인덱스에 보이는 번호 (Hero/QA는 null)
  title: string;             // 짧은 제목 (사이드 인덱스용)
  longTitle: string;         // 본문 헤딩
  durationMinutes: number;   // 강의 시간 배분
};

export const sections: readonly SectionMeta[] = [
  { id: "hero",            number: null, title: "오프닝",     longTitle: "Claude Code 1시간",                              durationMinutes: 2 },
  { id: "history",         number: 1,    title: "Claude Code란?", longTitle: "Claude Code란? + 지금 왜 봐야 하나",         durationMinutes: 4 },
  { id: "features",        number: 2,    title: "핵심 기능",  longTitle: "핵심 기능 투어",                                durationMinutes: 12 },
  { id: "embedded-demos",  number: 3,    title: "실제 시연·실습", longTitle: "Claude Code 실제 시연과 U-Boot 응용 실습", durationMinutes: 24 },
  { id: "impact",          number: 4,    title: "효과",       longTitle: "효과를 검증하는 방법",        durationMinutes: 6 },
  { id: "getting-started", number: 5,    title: "시작하기",   longTitle: "시작하기 + 다음 7일",                             durationMinutes: 7 },
  { id: "qa",              number: null, title: "Q&A",       longTitle: "Q&A",                                            durationMinutes: 5 },
];

export function totalDurationMinutes(): number {
  return sections.reduce((acc, s) => acc + s.durationMinutes, 0);
}
