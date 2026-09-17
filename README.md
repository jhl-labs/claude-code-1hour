# Claude Code — 임베디드 엔지니어를 위한 60분

2026-09-17 공식 문서 기준의 한국어 강의 페이지다. 영상은 **설명용 시나리오**이며 실제 Claude 실행 녹화·하드웨어 검증·성능 측정 결과가 아니다.

```bash
pnpm install
pnpm dev
pnpm test
pnpm typecheck:remotion
pnpm build
```

GitHub Pages용 빌드는 `NEXT_PUBLIC_BASE_PATH=/claude-code-1hour pnpm build`를 사용한다. main 푸시는 자동 배포되므로 로컬 수정·검증과 배포를 구분한다.

## 콘텐츠와 영상 수정

- `app/sections`: 7개 강의 섹션.
- `remotion/lesson-data.json`: 13개 영상의 장면·코드·설명·출처. 모든 장면은 8초다.
- `remotion/shared/LessonFilm.tsx`: 큰 글씨와 단계별 강조를 사용하는 영상 레이아웃.
- `app/components/LessonVideo.tsx`: 수동 재생, 단일 재생, 장면 이동, 전체 transcript.
- MP4 5개는 아래 명령으로 영상·포스터·한국어 VTT·manifest를 함께 생성한다. 나머지8개는 Remotion Player로 재생한다.

```bash
pnpm demos:render
```

Chrome이 필요하다. 기본 `/usr/bin/google-chrome` 대신 `REMOTION_BROWSER_EXECUTABLE`을 지정할 수 있다. 오래된 fake Claude 응답·VHS tape·합성 PASS 로그는 폐기했다. `demos/scripts/render-tapes.sh`는 새 렌더러로 연결되는 호환 진입점이다.

## 검증

```bash
# 독립 교육용 비트필드 예제 — ECC/보드 검증은 아님
cc -std=c11 -Wall -Wextra -Werror demos/examples/bitfield_test.c -o /tmp/bitfield-test
/tmp/bitfield-test

# 전체 영상의 1초 이미지 / 장면표
node scripts/audit/render-frames.cjs .audit/after
python scripts/audit/inspect-video.py .audit/after
python scripts/audit/build-gallery.py .audit/after

# pnpm dev 실행 중 데스크톱·모바일 캡처
node scripts/audit/page.cjs .audit/after
```

Python Pillow·numpy, ffmpeg/ffprobe가 필요하다. `.audit`는 로컬 검토 증거이며 Git에 포함하지 않는다.

[수정 전 전수 점검](docs/audits/2026-09-17-content-video-audit.md) · [수정 결과](docs/audits/2026-09-17-remediation.md)
