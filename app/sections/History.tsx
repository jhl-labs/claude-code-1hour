import { ScrollSection } from "@/app/components/ScrollSection";
import { VideoPlayer } from "@/app/components/VideoPlayer";
import { V1Timeline } from "@/remotion/compositions/V1Timeline";
import { Card } from "@/app/components/Card";
import { Callout } from "@/app/components/Callout";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "history")!;

export function History({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-accent">§1</div>
        <h2 className="mt-1 text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">5분. 한 줄 정의 → 진화 타임라인 → 왜 지금이 변곡점인가.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.4fr] gap-10 items-start">
        <div className="space-y-6">
          <Callout tone="info" title="한 줄 정의">
            <p className="font-mono text-lg leading-snug">
              Claude Code = 터미널에서 자율적으로 일하는 코드 동료
            </p>
          </Callout>
          <p className="text-ink-soft leading-relaxed">
            “자율적”이란, 한 번 시키면 <strong>스스로 파일을 읽고 / 빌드를 돌리고 / 로그를 보고 / 다음 행동을
            결정</strong>한다는 뜻. 사람이 매 단계 손잡고 끌어줄 필요가 없습니다. 보드 디버깅에서
            “레지스터 한 번 보고, 로그 한 번 보고, 가설 세우고, 다시 시도” 하는 그 루프 — 그걸
            Claude 가 코드 위에서 합니다.
          </p>
          <p className="text-ink-soft leading-relaxed">
            웹 개발자만의 도구가 아닙니다. <strong>C / C++ · 빌드 시스템 · 디바이스 트리 · 펌웨어</strong> —
            메모리 컨트롤러 엔지니어가 매일 만지는 영역에서 Claude Code 는 강합니다. 오늘 보여드릴
            데모 4 종이 그 증거입니다.
          </p>
        </div>
        <div>
          <VideoPlayer
            composition={V1Timeline}
            inputProps={{}}
            durationInFrames={90 * 30}
          />
        </div>
      </div>

      {/* 왜 지금 변곡점인가 */}
      <div className="mt-12">
        <h3 className="mb-4 text-xl font-semibold">왜 지금이 변곡점인가</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card eyebrow="2024" title="자율 루프의 등장">
            <p>
              ChatGPT 류 챗봇 → 한 번에 한 응답. 도구 호출이 가능해진 뒤로
              “읽고 → 시도하고 → 관찰하고 → 다시 시도” 하는 <strong>에이전틱 루프</strong>가 본격화.
              임베디드 디버깅 사고법과 정확히 같음.
            </p>
          </Card>
          <Card eyebrow="2025" title="컨텍스트 1M 토큰">
            <p>
              U-Boot 처럼 큰 저장소(수만 파일)를 <strong>한 번에 들고 작업</strong>할 수 있게 됨.
              이전엔 “관련 파일 5개”를 사람이 골라줘야 했지만, 이제는 grep 부터 Claude 가.
            </p>
          </Card>
          <Card eyebrow="2025~26" title="Plugins / Skills">
            <p>
              자주 하는 절차(린트·릴리즈·코드리뷰)가 <strong>호출 가능한 Skill</strong> 로 표준화.
              팀 노하우를 코드로 굳혀 다음 사람이 그대로 호출.
            </p>
          </Card>
        </div>
      </div>

      {/* 진화 마일스톤 */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card eyebrow="최근 6개월" title="Plugins / Skills">
          호출 가능한 절차와 커뮤니티 스킬 생태계가 폭발적으로 확장. 사내 표준 절차도 그대로 Skill 로.
        </Card>
        <Card eyebrow="최근 6개월" title="Subagent / Hook 표준화">
          큰 작업 위임과 자동 트리거가 1급 시민으로. 커밋 전 단위테스트, PR 생성 시 자동 리뷰가 기본기.
        </Card>
        <Card eyebrow="최근 6개월" title="SDK · IDE 통합">
          VS Code · JetBrains · Web · CLI 어디서든 같은 에이전틱 루프. CI 파이프라인·코드 서버에도 같은 엔진.
        </Card>
      </div>

      {/* 임베디드 관점에서의 강점 정리 */}
      <div className="mt-12">
        <h3 className="mb-4 text-xl font-semibold">임베디드 관점에서 — 어디가 강한가</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
          <div className="rounded-md bg-bg-soft px-4 py-3 ring-1 ring-white/5">
            <div className="text-accent text-xs uppercase tracking-wider mb-1">읽기</div>
            대형 C 코드베이스를 빠르게 의미 단위로 분해. 매크로 정의·콜그래프·레지스터 정의 추적.
          </div>
          <div className="rounded-md bg-bg-soft px-4 py-3 ring-1 ring-white/5">
            <div className="text-accent text-xs uppercase tracking-wider mb-1">쓰기</div>
            <code className="font-mono text-xs">FIELD_PREP/GET</code>·SPDX 헤더·DM_TEST 같은 코드 관습을 학습해 일관되게.
          </div>
          <div className="rounded-md bg-bg-soft px-4 py-3 ring-1 ring-white/5">
            <div className="text-accent text-xs uppercase tracking-wider mb-1">빌드</div>
            Kconfig · Makefile · defconfig 동시 수정. <code className="font-mono text-xs">make sandbox_defconfig</code> 부터 cross-build 까지.
          </div>
          <div className="rounded-md bg-bg-soft px-4 py-3 ring-1 ring-white/5">
            <div className="text-accent text-xs uppercase tracking-wider mb-1">검증</div>
            sandbox · DM 테스트 자동 생성. 보드 없이 호스트에서 회귀 검증 루프를 만들어줌.
          </div>
        </div>
      </div>
    </ScrollSection>
  );
}
