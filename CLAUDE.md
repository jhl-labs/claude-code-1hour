# claude-code-1hour

임베디드(메모리 컨트롤러) 엔지니어 대상 줌 라이브 60분 강의 교안.
설계서: `docs/superpowers/specs/2026-04-28-claude-code-1hour-design.md`
구현 플랜: `docs/superpowers/plans/`

## 빌드/실행
- `pnpm install`
- `pnpm dev` — 로컬 개발 (라이브 강의도 이걸로)
- `pnpm build` — 정적 빌드 (`out/` 생성, GitHub Pages 배포 산출물)
- `pnpm test` — Vitest

## 배포
- GitHub Pages: `https://jhl-labs.github.io/claude-code-1hour/`
- `main` 브랜치 푸시 시 `.github/workflows/deploy-pages.yml` 가 자동 배포.
- `next.config.ts` 의 `output: "export"` + `basePath` 사용. CI 에서 `NEXT_PUBLIC_BASE_PATH=/claude-code-1hour` 주입.
- `<video>` 등 raw 태그 자산 경로는 `app/lib/assetPath.ts` 의 `assetPath()` 로 prefix.

## 영상
- 모션 영상은 `remotion/compositions/V*.tsx`. `pnpm remotion:studio`로 미리보기.
- 교육 영상은 설명용 시나리오이며 실제 Claude 실행·성능 측정이 아니다.
- 내용·길이·장면 큐의 원본은 `remotion/lesson-data.json`. `LessonFilm`과 본문 transcript가 함께 사용한다.
- MP4 5편은 `node scripts/videos/render.cjs`로 재생성한다. 포스터·VTT·manifest도 함께 갱신한다.
- 원본 수정 후 `.audit/after`에 1초 샘플을 생성해 가독성·잘림·정지 구간을 검토한다.

## 관습
- 사용자 시스템 정보(호스트명, 사용자명, IP)가 절대 코드/스크립트에 노출되지 않게 한다.
- 다크 모드 기본. 한국어 본문, 코드 영문.
- 컴포넌트는 한 가지 일만. 길어지면 분리.

## 진행 상황
- [x] 플랜 1 (M1+M2) — 사이트 골격 + 정적 콘텐츠
- [x] 플랜 2 (M3+M4) — 모션그래픽 + R1 시뮬레이션 영상 9편
- [x] 플랜 3 (M5) — 임베디드 데모 영상 5편
- [ ] 플랜 4 (M6) — 마감·리허설
