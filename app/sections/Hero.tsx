import { ScrollSection } from "@/app/components/ScrollSection";
import { sections } from "@/app/lib/sections";
const meta = sections[0];
export function Hero({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <p className="text-sm uppercase tracking-widest text-accent">
        임베디드 엔지니어를 위한 60분 · 2026-09-17 확인
      </p>
      <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-6xl">
        Claude Code,
        <br />
        <span className="text-accent">분석에서 검증까지.</span>
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-soft">
        U-Boot NAND 코드를 소재로 저장소 탐색, 작은 변경, 빌드·테스트 검토를
        배웁니다. 최신 모델을 선택하고, 작업 범위와 권한을 정하고, 근거가 남는
        결과를 만드는 것이 목표입니다.
      </p>
      <a href="#embedded-demos" className="mt-6 inline-block rounded-lg bg-accent px-5 py-3 font-semibold text-bg">50초 실제 시연 바로 보기 →</a>
      <div className="mt-8 rounded-lg border border-accent/30 bg-bg-soft p-6">
        <h2 className="font-semibold">
          설명은 읽고, 실제 작업은 시연으로 확인합니다
        </h2>
        <p className="mt-2 leading-relaxed text-ink-soft">
          개념과 명령 예제는 직접 넘기는 슬라이드로 읽습니다. 실제 시연에서는
          Claude Code가 C 파일을 읽고, 오류를 수정하고, 테스트하는 터미널을
          보여줍니다. 이어서 U-Boot 실습에 적용할 요청과 검토 기준을 살펴봅니다.
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          "현재 모델·계정·권한 확인",
          "근거가 있는 분석과 변경 요청",
          "테스트 결과와 미검증 범위 구분",
        ].map((t, i) => (
          <div key={t} className="rounded bg-bg-soft p-5">
            <span className="text-accent">0{i + 1}</span>
            <p className="mt-2">{t}</p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">60분 진행 순서</h2>
        <ol className="grid gap-3 sm:grid-cols-2">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="flex justify-between rounded bg-bg-soft px-4 py-3 hover:text-accent"
              >
                <span>{s.title}</span>
                <span>{s.durationMinutes}분</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-6 text-sm leading-relaxed text-ink-muted">
        준비: 지원 OS, 로그인 가능한 Claude 계정 또는 조직의 API 환경, Git
        저장소. 빌드 실습에는 대상에 맞는 컴파일러와 의존성이 필요합니다.
        처음에는 읽기 작업부터 시작합니다.
      </p>
    </ScrollSection>
  );
}
