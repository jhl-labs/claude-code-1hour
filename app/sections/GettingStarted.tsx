import { ScrollSection } from "@/app/components/ScrollSection";
import { SectionIntro, DocLink } from "@/app/components/SectionIntro";
import { CodeBlock } from "@/app/components/CodeBlock";
import { Card } from "@/app/components/Card";
import { sections } from "@/app/lib/sections";
const meta = sections[5];
export function GettingStarted({
  onEnter,
}: {
  onEnter?: (id: typeof meta.id) => void;
}) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <SectionIntro label="§5 · 7분" title="첫 실행과 다음 7일">
        라이브에서는 설치 경로·권한·첫 읽기 작업을 설명합니다. 아래 체크리스트로
        강의 후 자신의 환경에서 시작하세요.
      </SectionIntro>
      <h3 className="text-xl font-semibold">공식 native 설치</h3>
      <p className="mt-3 leading-relaxed text-ink-soft">
        OS와 조직 설치 정책에 맞는 명령을 사용하세요. 아래 주소는 공식 설치
        스크립트입니다. 지원 환경과 다른 설치 방법은 공식 문서에서 확인할 수
        있습니다.
      </p>
      <CodeBlock lang="bash">{`# macOS / Linux / WSL
curl -fsSL https://claude.ai/install.sh | bash

# 설치 후 인증·확인
claude auth login
claude --version
claude update

# 실제 저장소 경로로 변경
cd ~/work/u-boot
claude`}</CodeBlock>
      <CodeBlock lang="powershell">{`# Windows PowerShell
irm https://claude.ai/install.ps1 | iex`}</CodeBlock>
      <p className="mt-3">
        <DocLink path="overview">설치 안내</DocLink> ·{" "}
        <DocLink path="cli-reference">인증과 CLI</DocLink> ·{" "}
        <DocLink path="network-config">프록시·인증서</DocLink>
      </p>
      <p className="mt-4 leading-relaxed text-ink-muted">
        사내 프록시는 HTTPS_PROXY뿐 아니라 인증서·허용 도메인 등 환경 설정이
        필요할 수 있습니다. 로그인 토큰을 문서나 영상에 남기지 마세요.
      </p>
      <h3 className="mt-10 text-xl font-semibold">CLAUDE.md의 시작점</h3>
      <CodeBlock lang="markdown">{`# 프로젝트 지침
## 대상
- 소스 커밋과 보드 설정을 먼저 확인한다.
- 데이터시트 버전과 근거 위치를 보고한다.
## 작업
- 분석 요청에는 파일을 변경하지 않는다.
- 변경은 작은 diff로 나누고 git diff --check를 실행한다.
- 검증된 빌드·테스트 명령은 아래에 팀이 추가한다.
## 보고
- 실행한 명령과 결과를 기록한다.
- 보드 미검증 항목과 추정은 구분한다.`}</CodeBlock>
      <p className="mt-3 leading-relaxed">
        실제 확인한 빌드 명령과 하드웨어 제약을 추가하세요. ECC 방식·OOB
        크기·클럭을 다른 보드에서 복사하지 않습니다. CLAUDE.md는 간결하게
        유지하되 200줄을 넘으면 자동으로 무시된다는 규칙은 없습니다.{" "}
        <DocLink path="memory">메모리 규칙</DocLink>
      </p>
      <h3 className="mt-10 text-xl font-semibold">문맥·복구·사용량</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Card title="문맥 정리">
          /context로 상태를 보고 /compact로 요약합니다. /clear는 현재 문맥을
          비우며 계정의 사용량 한도를 초기화하지 않습니다.
        </Card>
        <Card title="작업 이어가기">
          claude --continue 또는 claude --resume으로 세션을 이어갑니다. 큰
          실험은 별도 브랜치·worktree에서 수행하고 Git diff로 변경을 확인합니다.
        </Card>
        <Card title="비용 확인">
          /usage와 /cost에서 제공되는 정보를 확인하세요. 구독 포함 사용량과
          API·추가 usage credits 과금은 다릅니다. 병렬 작업은 사용량을 늘릴 수
          있습니다.
        </Card>
        <Card title="권한 확인">
          /permissions로 정책을 확인합니다. 지침, 도구 권한, sandbox는 서로 다른
          역할입니다. .gitignore는 비밀 파일의 접근 차단 수단이 아닙니다.
        </Card>
      </div>
      <p className="mt-4">
        <DocLink path="costs">비용 관리</DocLink> ·{" "}
        <DocLink path="permissions">권한</DocLink> ·{" "}
        <DocLink path="sandboxing">Sandbox</DocLink> ·{" "}
        <DocLink path="checkpointing">변경 복구의 범위</DocLink>
      </p>
      <div className="mt-8 rounded-lg border border-accent/30 p-6">
        <h3 className="text-xl font-semibold">코드와 데이터 사용 전 확인</h3>
        <p className="mt-3 leading-relaxed">
          소비자 플랜의 데이터 설정과 상용 플랜·API의 정책은 다릅니다. 상용
          상품은 별도 동의가 없으면 학습에 사용하지 않는 정책이지만, 보존 기간과
          조직의 허용 범위는 따로 확인해야 합니다. 프록시나 CLAUDE.md만으로 NDA
          적합성·비밀 보호가 보장되지 않습니다.
        </p>
        <p className="mt-3">
          <DocLink path="data-usage">데이터 사용 정책</DocLink> ·{" "}
          <DocLink path="security">보안 안내</DocLink>
        </p>
      </div>
      <h3 className="mt-10 text-xl font-semibold">첫 30분, 그리고 7일</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Card title="첫 30분">
          설치·인증·권한을 확인하고, 저장소의 작은 파일 하나를 수정 없이
          분석합니다. 소스와 설명을 직접 대조합니다.
        </Card>
        <Card title="Day 3">
          확인된 빌드 명령과 반복되는 검토 항목을 CLAUDE.md에 기록합니다. 작은
          변경 하나를 검증합니다.
        </Card>
        <Card title="Day 7">
          리뷰 결과·총시간·실패 사례를 비교합니다. 반복 절차 하나를 Skill로
          만들고 팀과 검토합니다.
        </Card>
      </div>
    </ScrollSection>
  );
}
