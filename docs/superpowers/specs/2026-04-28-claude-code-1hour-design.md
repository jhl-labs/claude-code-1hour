---
date: 2026-04-28
status: draft
audience: 메모리 컨트롤러 SW 엔지니어 (임베디드)
delivery: 줌 라이브 1시간
---

# Claude Code 1시간 강의 — 강의 교안 설계서

## 1. 목표와 범위

### 1.1 한 줄 콘셉트
> **"60분에, 메모리 컨트롤러 엔지니어가 Claude Code의 가치를 자기 코드 위에서 직접 보고 떠나는 강의."**

### 1.2 청중과 사용 형태
- **청중**: 임베디드 SW 엔지니어, 특히 메모리 컨트롤러(NAND/eMMC/DDR/SD 등) 펌웨어·드라이버 개발자.
- **사전 지식**: AI 에이전트 기반 코딩 도구를 거의 접해본 적 없음.
- **사용 형태**: 강사가 줌 미팅에서 화면을 공유하고 웹페이지를 직접 스크롤하며 라이브 진행. 청중은 시청만 하며 실습·필기 없음. 끝나면 페이지를 다시 열어볼 수도 있으나 자가학습용 별도 모드는 만들지 않음.

### 1.3 메시지 톤
강점·개인 생산성 향상 위주. 회의감(보안·하드웨어 의존성 등)을 정면으로 다루기보다 **"이게 내 코드 위에서 진짜 통한다"** 를 데모로 증명하는 데 집중한다.

### 1.4 비목표 (Non-goals)
- 자가학습용 인터랙티브 콘텐츠 (실습, 노트 입력, 퀴즈 등) — 만들지 않음.
- 영어 자료, 다국어 — 한국어 단일.
- 모바일 최적화 — 강사 노트북 기준 1920×1080.
- 실제 회사 코드 사용 — 모든 데모는 공개 오픈소스(U-Boot) 위에서 진행.

---

## 2. 정보 아키텍처와 시간 배분

총 약 58분. 콘텐츠 53분 + Q&A 5분 (60분 슬롯 안에서 ±2분 여유).

| 섹션 | 시간 | 내용 |
|---|---|---|
| Hero — 후킹 | 2분 | "1주일 걸리던 일을 1시간 만에 직접 보세요" |
| §1 Claude Code란? + 짧은 역사 | 3분 | 한 줄 정의, 타임라인 영상, 최근 6개월 동향 카드 |
| §2 핵심 기능 투어 | 13분 | CLI / CLAUDE.md / 도구 사용 / MCP / Skills·Subagents·Hooks |
| §3 임베디드 라이브 데모 (U-Boot) | 27분 | A 분석 / C 빌드 / E 단위테스트 / H 문서화, 각 ~7분 |
| §4 효과 — 생산성 임팩트 | 5분 | Before/After, 시간 절감 차트, 워크플로우 변화, 대상별 이득 |
| §5 시작하기 + 다음 스텝 | 3분 | 설치 영상, CLAUDE.md 템플릿, 체크리스트, QR |
| Q&A | 5분 | 페이지 끝 FAQ + 라이브 |

웹페이지는 **이 순서대로 위→아래 스크롤되는 단일 페이지**. 각 섹션이 한 화면을 채우는 스크롤 스냅 또는 부드러운 스크롤. 좌측 고정 사이드 인덱스 + 우측 하단 진행도(현재 N/6 + 남은 추정 시간).

---

## 3. 임베디드 데모 4종 — 시나리오

모든 데모는 U-Boot 메모리 서브시스템(`drivers/mtd/nand/raw/` 중심) 위에서 진행한다. sandbox 빌드(`make sandbox_defconfig && make`)로 host gcc만으로 빌드·테스트가 가능하므로 크로스 컴파일러 없이도 데모 4종을 모두 시연할 수 있다.

데모 대상 후보 파일: `drivers/mtd/nand/raw/davinci_nand.c` (또는 동급의 NAND 컨트롤러 드라이버 1개). 600~800 라인 규모, 비트필드 매크로·명령 시퀀서·ECC·DMA가 한 파일에 섞인 전형적 레거시 C.

### 3.1 데모 A — 레거시 C 분석·리팩토링 (≈7분)
- **Setup**: 화면에 NAND 컨트롤러 드라이버 열어둠.
- **Prompt 예시**: *"이 NAND 컨트롤러 드라이버의 함수별 책임을 정리하고, 명령 시퀀서·ECC·DMA 부분을 책임 단위로 분리할 수 있게 리팩토링을 제안해줘. 비트필드 매크로 가독성 개선도 포함해서."*
- **Claude 결과**: 함수 책임 마크다운 표, 책임 분리 Mermaid 다이어그램, 매크로 → `FIELD_PREP/FIELD_GET` 변환 diff.
- **강조**: "10년 된 코드를 30초에 의미 단위로 분리해 읽음. 코드리뷰 시작점이 0이 아니라 70%."

### 3.2 데모 C — 빌드 시스템 (≈6분)
- **Setup**: 가상 시나리오 — "이 컨트롤러의 새 IP rev(가칭 V2) 지원 추가."
- **Prompt 예시**: *"NAND 컨트롤러에 새 IP rev (가칭 V2) 지원을 위한 `CONFIG_NAND_DENALI_V2` Kconfig 옵션을 추가해줘. 관련 Makefile, 의존성, defconfig까지 일관되게 수정. sandbox 빌드가 깨지지 않게."*
- **Claude 결과**: Kconfig·Makefile·defconfig 동시 diff, `make sandbox_defconfig && make -j$(nproc)` 실제 빌드 통과.
- **강조**: "여러 디렉토리에 흩어진 빌드 파일을 동시에·일관되게 수정. 가장 자주 깜빡하는 부분."

### 3.3 데모 E — 단위 테스트 자동 생성 (≈7분)
- **Setup**: NAND 컨트롤러의 핵심 함수 하나(명령 시퀀서 또는 ECC 계산)에 단위테스트가 0개임을 강조.
- **Prompt 예시**: *"이 함수의 unit test를 U-Boot sandbox 환경에서 돌릴 수 있게 작성해줘. 정상 경로 + 경계 조건(타임아웃, 잘못된 명령, ECC 비트 1~3개 에러) 포함. test/dm/ 패턴 따라줘."*
- **Claude 결과**: `test/dm/nand_<controller>.c` 신규 + Mock 컨트롤러 레지스터 + Kconfig·Makefile 등록 + `./test/py/test.py --bd=sandbox -k nand` 통과.
- **강조**: "Mock·픽스처가 귀찮아 미루던 단위테스트가 1분에 만들어지고 host에서 돌아감. 보드 없이 회귀 검증, CI 통합 즉시 효과."

### 3.4 데모 H — 문서화 자동 생성 (≈7분)
- **Setup**: 데모 A에서 본 같은 드라이버. 문서가 0줄임 강조.
- **Prompt 예시**: *"이 드라이버에서 사용하는 컨트롤러 레지스터 맵을 마크다운 표로 정리해줘 (오프셋, 비트필드, 의미 포함). 그리고 'NAND read page' 명령 흐름을 Mermaid 시퀀스 다이어그램으로 그려줘 — CPU/컨트롤러/NAND 칩 사이의 신호 흐름 시각화."*
- **Claude 결과**: 레지스터 맵 마크다운 표(오프셋·필드·R/W·기본값·의미), Mermaid 시퀀스 다이어그램, (보너스) 메모리 트레이닝 흐름도.
- **강조**: "데이터시트와 코드 사이의 갭을 5분에 메움. 신규 입사자 온보딩, 디자인 리뷰, 문제 분석 자료 즉시 확보. 속도가 아니라 '안 하던 걸 하게 됨'."

### 3.5 4종 데모의 공통 메시지 (§4로 연결)

| 데모 | 사람이 해왔던 시간(추정) | Claude Code 시간(추정) | 절감 |
|---|---|---|---|
| A 분석 | 30~60분 | 1분 + 검토 5분 | ~85% |
| C 빌드 | 30분 | 5분 | ~80% |
| E 단위테스트 | 2~4시간 | 5분 + 검토 10분 | ~90% |
| H 문서화 | 1~2일 (안 함이 다반사) | 10분 | 0 → 1 |

H 행이 핵심 메시지: **속도가 아니라 가능성 자체가 바뀐 영역.** 강의 발표 직전 실측을 통해 추정치를 보정한다(데모 실 녹화 후 시간 측정).

---

## 4. 영상/모션 자산 카탈로그 (총 14편)

| ID | 위치 | 길이 | 형식 | 핵심 내용 |
|---|---|---|---|---|
| V0 | Hero 배경 | 15초 루프 | Remotion 합성 | 임베디드 데모 하이라이트 클립 + 글리치 효과 (음소거) |
| V1 | §1 역사 | 90초 | 순수 Remotion | Anthropic 2021 → Claude 1/2/3 → Claude Code 2025-02 → 2026 현재 타임라인 |
| V2 | §2-1 CLI | 60초 | R1 터미널 시뮬레이션 | `claude` 실행, 사고→도구→관찰 루프 시각화 |
| V3 | §2-2 CLAUDE.md | 45초 | Remotion 모션 | 빈 프로젝트 → CLAUDE.md → 다음 세션이 이미 알고 시작 |
| V4 | §2-3 도구 사용 | 60초 | R1 시뮬레이션 | Read/Edit/Bash/Grep 도구 호출 흐름 |
| V5 | §2-4 MCP | 60초 | Remotion 다이어그램 | Claude Code ↔ 외부 시스템 연결 |
| V6 | §2-5 Skills/Subagent/Hooks | 90초 | Remotion 모션 | 세 개념 각 30초 |
| V7-A | §3-A | 90초 | **vhs + Remotion 합성** | 레거시 C 분석/리팩토링 결과 |
| V7-C | §3-C | 90초 | **vhs + Remotion 합성** | Kconfig/Makefile/defconfig 동시 수정 + 빌드 |
| V7-E | §3-E | 90초 | **vhs + Remotion 합성** | 단위테스트 작성 → sandbox 통과 |
| V7-H | §3-H | 90초 | **vhs + Remotion 합성** | 레지스터 맵 + Mermaid 시퀀스 다이어그램 자동 생성 |
| V8 | §4 Before/After | 90초 | Remotion 분할화면 | 사람 vs Claude 같은 작업, 스톱워치 회전 |
| V9 | §4 시간 절감 차트 | 60초 | 순수 Remotion | 막대 그래프 애니, 마지막 막대(문서화)는 다른 색 |
| V11 | §5 시작하기 | 30초 | **vhs 녹화** | 설치 한 줄 → `claude` → 첫 명령 |

(V10번은 카탈로그 단순화 위해 결번 — 워크플로우 비교는 V9 차트 + 정적 캘린더로 대체.)

영상 총 길이 ≈ 16분 (Hero 루프 제외). 1시간 강의 중 영상 비중 약 25%, 나머지는 강사 해설·코드 정적 화면·전환.

### 4.1 비주얼 토큰
- 코드: JetBrains Mono. 본문: Pretendard(한글) + Inter(영문).
- 컬러 팔레트: Claude 차콜 + 따뜻한 오렌지 + 임베디드 미드나잇 블루.
- 타이핑 속도: 사람 약 40 wpm × 1.3.
- 콜아웃 박스: 우측 슬라이드 인 + 1px 모서리 하이라이트.
- diff: 빨강/초록 배경 + 라인넘버 좌측 빔.
- 스톱워치: 사람=주황, AI=시안.

---

## 5. 기술 스택과 디렉토리 구조

### 5.1 스택

| 영역 | 선택 |
|---|---|
| 프레임워크 | Next.js 15 (App Router) + React 19 + TypeScript |
| 스타일 | Tailwind CSS + shadcn/ui (다크 기본) |
| 영상 임베드 | `@remotion/player` (브라우저 직접 재생, mp4 export 불필요) |
| 영상 합성 | Remotion 5.x |
| 다이어그램 | Mermaid |
| 차트 | Recharts 또는 자체 SVG 모션 |
| 폰트 | Pretendard / Inter / JetBrains Mono |
| 임베디드 데모 녹화 | vhs (charm sh), 보조로 asciinema |
| 영상 후처리 | ffmpeg |
| 패키지 매니저 | pnpm |
| 호스팅 | 라이브: 로컬 `pnpm dev`. 백업: 정적 빌드(Vercel은 옵션) |

### 5.2 디렉토리 구조

```
claude-code-1hour/
├─ app/                              # Next.js 강의 사이트 (스크롤 1페이지)
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ sections/
│  │   ├─ Hero.tsx
│  │   ├─ History.tsx
│  │   ├─ Features.tsx
│  │   ├─ EmbeddedDemos.tsx
│  │   ├─ Impact.tsx
│  │   └─ GettingStarted.tsx
│  ├─ components/
│  │   ├─ ScrollSection.tsx
│  │   ├─ SideIndex.tsx
│  │   ├─ ProgressBar.tsx
│  │   ├─ VideoPlayer.tsx
│  │   ├─ Mermaid.tsx
│  │   ├─ CodeBlock.tsx
│  │   └─ Card.tsx
│  └─ globals.css
├─ remotion/
│  ├─ Root.tsx
│  ├─ compositions/
│  │   ├─ V0HeroLoop.tsx
│  │   ├─ V1Timeline.tsx
│  │   ├─ V2CliLoop.tsx
│  │   ├─ V3ClaudeMd.tsx
│  │   ├─ V4Tools.tsx
│  │   ├─ V5Mcp.tsx
│  │   ├─ V6SkillsSubagentsHooks.tsx
│  │   ├─ V7ALegacyC.tsx
│  │   ├─ V7CBuild.tsx
│  │   ├─ V7EUnitTest.tsx
│  │   ├─ V7HDocs.tsx
│  │   ├─ V8BeforeAfter.tsx
│  │   ├─ V9SavingsChart.tsx
│  │   └─ V11Install.tsx
│  ├─ shared/
│  │   ├─ Terminal.tsx
│  │   ├─ Callout.tsx
│  │   ├─ DiffBlock.tsx
│  │   ├─ Stopwatch.tsx
│  │   └─ AnimatedBar.tsx
│  └─ tokens.ts
├─ demos/
│  ├─ uboot/                          # gitignore (별도 작업 트리)
│  ├─ tapes/
│  │   ├─ 7a-legacy-c.tape
│  │   ├─ 7c-build.tape
│  │   ├─ 7e-unit-test.tape
│  │   ├─ 7h-docs.tape
│  │   └─ 11-install.tape
│  ├─ recordings/                     # gitignore (vhs 결과 mp4)
│  └─ scripts/
│      ├─ install-tools.sh
│      ├─ clone-uboot.sh
│      ├─ run-real-claude.sh
│      └─ render-tapes.sh
├─ public/rendered/                   # 최종 export mp4 (선택)
├─ docs/superpowers/
│  ├─ specs/2026-04-28-claude-code-1hour-design.md   # 본 문서
│  └─ plans/                          # writing-plans 산출물
├─ scripts/build-and-export.sh
├─ package.json / tsconfig.json / tailwind.config.ts
├─ next.config.ts / remotion.config.ts
└─ CLAUDE.md
```

### 5.3 환경 검증 (스펙 작성 시점 확인 사항)
- `gcc 11.4`, `make`, `git`, `python3 3.10`, `node v22.21`, `pnpm`, `ffmpeg`, `asciinema` 모두 host에 설치되어 있음.
- 크로스 컴파일러는 없음 → U-Boot **sandbox** 빌드만으로 데모 4종을 모두 진행한다는 것이 본 설계의 전제.
- Bazel 없음 → OpenTitan은 후보에서 배제하고 U-Boot로 단일화.
- vhs는 M1에서 설치(`demos/scripts/install-tools.sh`).
- 프로젝트 루트 디스크 여유 ≈ 407GB로 U-Boot 트리 + 영상 산출물 보관 충분.

---

## 6. 컴포넌트 책임 (얇게)

| 컴포넌트 | 단일 책임 |
|---|---|
| `app/page.tsx` | 6개 섹션을 순서대로 렌더링하는 단일 스크롤 페이지 |
| `ScrollSection` | 자식이 뷰포트 진입/이탈 시 영상 자동재생/정지 트리거 |
| `SideIndex` | 현재 섹션 하이라이트 + 클릭 시 해당 섹션으로 점프 |
| `ProgressBar` | "현재 §3-A · 남은 시간 ~XX분" 강사용 가이드 |
| `VideoPlayer` | `@remotion/player` 래핑 — composition id, 입력 props, 자동재생 정책을 일관되게 적용 |
| `remotion/compositions/V*` | 한 영상 = 한 Composition. 외부에서 props로 자막/속도 조정 가능 |
| `remotion/shared/Terminal` | R1 시뮬레이션용 터미널 — 타이핑 속도·커서·프롬프트 행만 다룸 |
| `demos/scripts/run-real-claude.sh` | 실제 Claude Code를 한 번 돌려 출력을 캡처 (재현용 입력) |
| `demos/scripts/render-tapes.sh` | `.tape` 5편을 vhs로 일괄 렌더 |

원칙: **한 컴포넌트 = 한 가지 일.** 영상은 모두 props로 텍스트·길이를 받아 재사용 가능하게 한다.

---

## 7. 제작 마일스톤 (총 5.5~6일)

| M | 산출물 | 분량 | 끝낼 때 검증 |
|---|---|---|---|
| M1 | Next.js 골격 + Remotion 통합 + vhs 설치 + U-Boot clone | 0.5일 | 빈 페이지에서 6섹션 스크롤·인덱스·진행도 동작 |
| M2 | 비주얼 토큰 + Hero/§1/§2/§5 정적 콘텐츠 | 1.0일 | 영상이 빠진 채로 강의 사이트 한 바퀴 가능 |
| M3 | 모션그래픽 영상 6편 (V1, V3, V5, V6, V8, V9) | 1.5일 | §1, §4 영상 모두 자동재생/정지 |
| M4 | R1 시뮬레이션 영상 3편 (V0, V2, V4) | 1.0일 | §2 영상 5편 전부 동작 |
| M5 | 임베디드 데모 5편 (V7-A/C/E/H + V11) | 2.0일 | 4종 데모가 사이트에서 90초±5초로 정확 재생 |
| M6 | 마감 + 줌 시뮬레이션 + 풀 리허설 | 0.5일 | 60분 풀 리허설 1회 무사 통과 |

### 7.1 M5 세부 순서
1. U-Boot sandbox 빌드 검증(`make sandbox_defconfig && make`, `test/py` 실행 OK).
2. 실제 Claude Code 실행, 4종 데모 + 설치 시나리오 진짜 출력 캡처.
3. `.tape` 시나리오 5편 작성 (캡처 출력 임베드).
4. vhs 일괄 렌더 → mp4 5편.
5. Remotion에서 자막·콜아웃·diff 합성.
6. 사이트 임베드 + 길이/타이밍 미세조정.

### 7.2 리스크와 완화
| 리스크 | 완화 |
|---|---|
| U-Boot sandbox에서 NAND 데모 E가 의도대로 통과 안 함 | M5-1에서 먼저 검증. 안 되면 더 단순한 컨트롤러 함수로 변경 |
| 실제 Claude Code 출력이 데모용으로 너무 길거나 짧음 | M5-2에서 출력 보고 프롬프트 미세조정. .tape에서 압축 가능 |
| Remotion + Next.js 통합 자잘한 이슈 | M1에서 `@remotion/player` 동작을 가장 먼저 검증, 미루지 않음 |
| 일정 부족 | V8(Before/After), V11(설치) 후순위. 핵심은 §3 4종 |

---

## 8. 산출물 정의 (Done의 기준)

이 강의 교안 프로젝트는 다음을 모두 충족하면 완료.

1. `pnpm dev`로 로컬에서 단일 페이지가 1920×1080에서 깨지지 않고 6섹션을 스크롤한다.
2. 영상 14편이 모두 사이트 안에서 자동재생되고, 길이/자막/하이라이트가 카탈로그 사양(§4)을 따른다.
3. 임베디드 데모 4종(V7-A/C/E/H)의 mp4가 vhs로 결정적으로 재생산 가능하고, U-Boot sandbox에서의 실측 결과를 반영한다.
4. 60분 풀 리허설을 1회 통과한다(±2분 허용).
5. 정적 빌드(`pnpm build`)가 성공하고, 줌 화면공유 백업 시나리오에서 동작한다.

---

## 9. 본 설계서가 다루지 않는 것

- writing-plans 단계에서 작성될 **단계별 구현 플랜**(파일 단위 변경 명세, 테스트 전략).
- 추후 자가학습용 확장(노트, 퀴즈, 진행 추적) — 본 강의는 라이브 단발성.
- 사내 호스팅·SSO 등 배포 운영 사항 — 라이브는 로컬에서 진행.
