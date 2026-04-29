import { ScrollSection } from "@/app/components/ScrollSection";
import { Mp4Video } from "@/app/components/Mp4Video";
import { CodeBlock } from "@/app/components/CodeBlock";
import { Card } from "@/app/components/Card";
import { Callout } from "@/app/components/Callout";
import { sections } from "@/app/lib/sections";

const meta = sections.find((s) => s.id === "getting-started")!;

const claudeMdTemplate = `# 우리 프로젝트
이 프로젝트는 NAND 컨트롤러 펌웨어다.

## 빌드/실행
- 빌드: \`make sandbox_defconfig && make -j$(nproc)\`
- 단위테스트: \`./test/py/test.py --bd=sandbox\`
- 크로스 빌드: \`make CROSS_COMPILE=arm-linux-gnueabihf- am335x_evm_defconfig\`

## 관습
- 새 컨트롤러 드라이버는 drivers/mtd/nand/raw/ 에.
- 비트필드는 FIELD_PREP/FIELD_GET 사용 (직접 시프트/마스크 금지).
- 신규 코드는 SPDX-License-Identifier 헤더 필수.

## 하드웨어 제약
- ECC: BCH-8, OOB 64바이트 (변경 불가)
- 페이지 크기: 4KB
- 컨트롤러 클럭: 100MHz, AHB 버스
- DMA 정렬: 16바이트

## 리뷰어가 항상 보는 것
- race condition (IRQ context vs sleeping function)
- endianness (cpu_to_le32 누락)
- 타임아웃 처리 (busy loop 금지)
`;

const shellSetup = `# 1. 설치 (npm 글로벌)
npm install -g @anthropic-ai/claude-code

# 2. 인증
claude login

# 3. 프로젝트 루트로 이동 후 시작
cd ~/work/u-boot
claude

# 4. 첫 명령 — 프로젝트 파악시키기
> CLAUDE.md 를 읽고, 이 저장소 구조를 3문단으로 요약해줘.
`;

export function GettingStarted({ onEnter }: { onEnter?: (id: typeof meta.id) => void }) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <header className="mb-10">
        <div className="text-xs uppercase tracking-wider text-accent">§5</div>
        <h2 className="mt-1 text-4xl font-semibold">{meta.longTitle}</h2>
        <p className="mt-2 text-ink-muted">
          오늘 미팅 후 30분이면 첫 명령까지. 하루면 일하는 흐름 안에 들어옴.
        </p>
      </header>

      {/* 상단: 영상 + 첫 셸 세션 */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-8 items-start">
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-wider text-ink-muted">V11 · 30초</div>
          <h3 className="text-xl font-semibold">설치 & 첫 명령</h3>
          <Mp4Video src="/videos/V11-install.mp4" loop />
        </div>
        <Card eyebrow="복붙용" title="첫 셸 세션 — 4 줄이면 끝">
          <CodeBlock lang="bash">{shellSetup}</CodeBlock>
          <p className="mt-3 text-xs text-ink-muted">
            인증은 1회. 이후 같은 셸이면 토큰이 캐시됨. 프록시 환경은 <code className="font-mono">HTTPS_PROXY</code> 만 export.
          </p>
        </Card>
      </div>

      {/* CLAUDE.md 템플릿 */}
      <div className="mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-8 items-start">
          <Card eyebrow="템플릿" title="CLAUDE.md — 우리팀 사정에 맞춘 5분 작성">
            <CodeBlock lang="markdown">{claudeMdTemplate}</CodeBlock>
          </Card>
          <div className="space-y-4">
            <Callout tone="info" title="작성 원칙">
              <ul className="space-y-1.5 text-sm">
                <li>· <strong>빌드 명령은 무조건 1번</strong> 적기 — Claude가 환각으로 만들지 않게.</li>
                <li>· <strong>하지 말 것</strong>도 적기 — “직접 시프트/마스크 금지” 같은 금기.</li>
                <li>· <strong>리뷰 관점</strong>을 적기 — race·endianness·timeout.</li>
                <li>· 길게 쓰지 말 것. 30~60줄이면 충분, 200줄 넘어가면 오히려 무시됨.</li>
                <li>· 하위 디렉토리에도 별도 <code className="font-mono">CLAUDE.md</code> 가능 (스코프드).</li>
              </ul>
            </Callout>
            <Callout tone="ok" title="좋은 한 줄 vs 나쁜 한 줄">
              <div className="text-sm space-y-2">
                <div>
                  <span className="text-ok">✓</span> <code className="font-mono text-xs">ECC: BCH-8 고정. 변경 시 OOB 레이아웃까지 확인.</code>
                </div>
                <div>
                  <span className="text-warn">✗</span> <code className="font-mono text-xs">ECC 잘 처리해줘.</code> ← Claude가 추측함
                </div>
              </div>
            </Callout>
          </div>
        </div>
      </div>

      {/* 첫 30분 단계 */}
      <div className="mt-12">
        <h3 className="mb-4 text-xl font-semibold">미팅 직후 30분 — 단계별</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card eyebrow="0~5 분" title="설치 + 로그인">
            <p>
              <code className="font-mono text-xs">npm i -g @anthropic-ai/claude-code</code> 후
              <code className="font-mono text-xs"> claude login</code>. 사내 프록시면 <code className="font-mono text-xs">HTTPS_PROXY</code> 만 export.
            </p>
          </Card>
          <Card eyebrow="5~15 분" title="CLAUDE.md 5줄 + 1 작업">
            <p>
              빌드 명령·하드웨어 제약 5줄만 적고, 가장 무서운 파일을 코드리뷰 시키기.
              결과를 사람이 읽고 “여긴 잘못됐어”라고 바로잡으면서 컨텍스트가 쌓임.
            </p>
          </Card>
          <Card eyebrow="15~30 분" title="단위테스트 1개 + 빌드">
            <p>
              sandbox 빌드가 도는 폴더에서 <code className="font-mono text-xs">test/dm/</code> 패턴으로
              테스트 1개 생성 시키기. <code className="font-mono text-xs">./test/py/test.py</code> 까지 PASS 보면 끝.
            </p>
          </Card>
        </div>
      </div>

      {/* 체크리스트 + 트러블슈팅 + 보안 */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card eyebrow="오늘 안 해보면 손해" title="체크리스트">
          <ul className="space-y-2 text-sm">
            <li>☐ <code className="font-mono">npm install -g @anthropic-ai/claude-code</code></li>
            <li>☐ 프로젝트 루트에 CLAUDE.md 5줄 작성</li>
            <li>☐ 가장 무서운 파일을 Claude에 코드리뷰 시키기</li>
            <li>☐ 단위테스트 1개 작성 시키기 (sandbox)</li>
            <li>☐ <code className="font-mono">/ide</code> 로 VS Code 연결</li>
            <li>☐ <code className="font-mono">.claude/commands/</code> 에 자주 쓰는 명령 1개 저장</li>
          </ul>
        </Card>
        <Card eyebrow="자주 막히는 곳" title="트러블슈팅">
          <ul className="space-y-2 text-sm">
            <li>· <strong>응답이 엉뚱함</strong> → CLAUDE.md 부재 or 오래된 내용. 최신화 5분.</li>
            <li>· <strong>Bash 권한 거부</strong> → <code className="font-mono text-xs">/permissions</code> 에서 정책 조정.</li>
            <li>· <strong>환각 빌드 명령</strong> → CLAUDE.md 에 “빌드: …” 한 줄 박기.</li>
            <li>· <strong>토큰 한도</strong> → <code className="font-mono text-xs">/clear</code> 로 컨텍스트 정리, subagent 분할.</li>
            <li>· <strong>대용량 로그</strong> → 파이프 대신 파일로 저장 후 Read.</li>
          </ul>
        </Card>
        <Card eyebrow="조직 차원" title="보안 / 데이터">
          <ul className="space-y-2 text-sm">
            <li>· <strong>엔터프라이즈 플랜</strong>: 학습 미사용 + 보존정책 통제.</li>
            <li>· <strong>비밀키·고객 데이터</strong>: <code className="font-mono text-xs">.env</code>, <code className="font-mono text-xs">credentials*</code> 자동 무시 — <code className="font-mono text-xs">.gitignore</code> 정비 우선.</li>
            <li>· <strong>NDA 코드</strong>: 사내 프록시 + 감사 로그 활성화 후 사용.</li>
            <li>· <strong>금지 명령</strong>: <code className="font-mono text-xs">rm -rf</code>, <code className="font-mono text-xs">git push --force</code> 는 hook 으로 사전 차단.</li>
            <li>· 자세한 정책은 <strong>보안팀 가이드</strong> 따르기.</li>
          </ul>
        </Card>
      </div>

      {/* 다음 자료 */}
      <div className="mt-10">
        <Callout tone="info" title="더 깊이 들어가고 싶을 때">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-1 text-ink">공식 문서</div>
              <p>설치·CLI·MCP 레퍼런스. 변경이 빠르므로 분기마다 한 번씩.</p>
            </div>
            <div>
              <div className="font-semibold mb-1 text-ink">사내 슬랙 채널</div>
              <p>
                실패담·노하우 공유. 같은 함정에 두 번 빠지지 말 것. 신규 멤버는 핀 메시지부터.
              </p>
            </div>
            <div>
              <div className="font-semibold mb-1 text-ink">vibe-project-lesson</div>
              <p>
                자가학습 28모듈. CLAUDE.md → MCP → Subagent 순으로. 주 1모듈 페이스 권장.
              </p>
            </div>
          </div>
        </Callout>
      </div>
    </ScrollSection>
  );
}
