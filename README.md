# Claude Code — 임베디드 엔지니어를 위한 60분

개념은 본문과 수동 슬라이드로 읽고, 영상은 **실제 Claude Code를 사용한 장면**만 보여준다.
U-Boot 실습마다 실제 시연이 있다: 소스 분석 36초, ARM object 컴파일 29초, 테스트 작성·리뷰·재검증 103초, 문서 작성·수정 75초. 작은 C 예제 50초는 선택형 워밍업이다.

```bash
pnpm install
pnpm dev
pnpm test
pnpm exec tsc --noEmit
NEXT_PUBLIC_BASE_PATH=/claude-code-1hour pnpm build
```

GitHub Pages는 `.github/workflows/deploy-pages.yml`을 사용한다. `main` 및 `feature/plan-01-scaffold` 푸시가 배포를 실행한다.

## 콘텐츠 수정

- `app/sections`: 7개 강의 섹션. 모델·설치·효과 측정은 본문과 표로 제공한다.
- `app/content/lessons.json`: 기능 5개와 U-Boot 실습 4개의 슬라이드. 시간·재생 개념이 없다.
- `app/components/LessonSlides.tsx`: 이전·다음, 장 선택, 좌우 방향키, 전체 내용 읽기.
- `app/components/PracticeVideo.tsx`: 실습 4개 각각의 실제 시연, 자막·장면 이동·검증 범위.
- `app/components/RealDemoVideo.tsx`: 선택형 C 예제 워밍업.
- `demos/uboot-sessions`: 최초 요청, 실제 생성 코드·문서, 적용 가능한 patch, 편집 구간과 재현법.
- `demos/real-session`: 실제 사용한 오류 예제, Claude Code가 수정한 결과, 요청과 검증 범위.
- `public/videos/real-demo.json`: 원본·편집본 해시, 편집 구간, 챕터, 실행 버전.

설명용 Remotion 영상·플레이어·렌더링 경로는 제거했다. CLI 출력을 합성해 실제 녹화로 게시하지 않는다.

## 실제 녹화 재편집

```bash
python scripts/videos/publish-practices.py demos/uboot-sessions/edit-plan.json --published-raw
# 선택형 워밍업
python scripts/videos/edit-recording.py public/videos/source/claude-code-real-uncut.mp4
```

이 명령은 이미 녹화한 화면의 지정 구간만 순서대로 연결한다. 응답·명령·결과를 새로 만들지 않는다. 새 세션을 녹화하면 구간과 설명을 그 세션에 맞게 다시 검토해야 한다.

## 화면·영상 검증

```bash
python scripts/audit/inspect-video.py .audit/review
python scripts/audit/build-gallery.py .audit/review
# 개발 서버 또는 Range 요청을 지원하는 정적 서버의 주소
AUDIT_URL=http://localhost:3000 node scripts/audit/page.cjs .audit/review
AUDIT_URL=http://localhost:3000 node scripts/audit/interactions.cjs
```

Chrome, ffmpeg/ffprobe, Python Pillow·numpy가 필요하다. `.audit`는 로컬 검토 증거이며 Git에 포함하지 않는다. 수정 전·후 C 예제의 실행법과 범위는 [실제 시연 기록](demos/real-session/README.md)을 참조한다.

[최초 전수 점검](docs/audits/2026-09-17-content-video-audit.md) · [구성 재검토와 실제 시연](docs/audits/2026-09-17-real-demo-redesign.md)

[U-Boot 실습 시연 4편의 결과·재현법](demos/uboot-sessions/README.md)

[U-Boot 실습 4편 실제 녹화 점검](docs/audits/2026-09-17-uboot-practice-recordings.md)
