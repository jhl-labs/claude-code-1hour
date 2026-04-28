# claude-code-1hour

임베디드(메모리 컨트롤러) 엔지니어 대상 줌 라이브 60분 강의 교안.
설계서: `docs/superpowers/specs/2026-04-28-claude-code-1hour-design.md`
구현 플랜: `docs/superpowers/plans/`

## 빌드/실행
- `pnpm install`
- `pnpm dev` — 로컬 개발 (라이브 강의도 이걸로)
- `pnpm build` — 정적 빌드 백업
- `pnpm test` — Vitest

## 영상
- 모션 영상은 `remotion/compositions/V*.tsx`. `pnpm remotion:studio`로 미리보기.
- 임베디드 데모 영상은 `demos/tapes/*.tape` → vhs 렌더 → Remotion 합성.

## 관습
- 사용자 시스템 정보(호스트명, 사용자명, IP)가 절대 코드/스크립트에 노출되지 않게 한다.
- 다크 모드 기본. 한국어 본문, 코드 영문.
- 컴포넌트는 한 가지 일만. 길어지면 분리.
