# 강의 영상·페이지 감사 도구

서비스나 원본 영상은 변경하지 않는다. 프로젝트 루트에서 실행한다.

필요 도구: 프로젝트 pnpm 의존성, Chrome (`/usr/bin/google-chrome`), ffmpeg/ffprobe, Python의 Pillow·numpy, DejaVu Sans 폰트.

```bash
node scripts/audit/render-frames.cjs
python scripts/audit/inspect-video.py
python scripts/audit/build-gallery.py
```

페이지 점검은 별도 터미널에서 `pnpm dev`를 실행한 뒤:

```bash
node scripts/audit/page.cjs
```

출력은 `.audit/before`에 저장된다. 같은 경로를 다시 사용하면 기존 증거를 덮어쓰므로 수정 전·후 비교가 필요하면 기존 폴더를 먼저 보존한다. 현재 scripts는 수정 전 기준 수집용이다.

`index.html`은 로컬 브라우저에서 열 수 있다. Remotion은 매30프레임, MP4는 매초 샘플링한다. MP4의 `second-0001.jpg`가 0초다. 픽셀 변화량은 정지 후보를 찾는 보조 지표이며 내용의 옳고 그름이나 불필요한 대기를 자동 판정하지 않는다.

[2026-09-17 보고서](../../docs/audits/2026-09-17-content-video-audit.md)

수정 후 자료를 별도 보존하려면 각 스크립트에 `.audit/after`를 전달한다. 페이지 도구는 `AUDIT_URL`로 정적 빌드의 주소도 받을 수 있다. `interactions.cjs`는 수동 재생·동시 재생 방지·장면 이동·정지 유지를 실제 브라우저에서 확인한다.

영상 장면 이동 검증에는 HTTP Range를 지원하는 정적 서버를 사용한다. Python 기본 `http.server`는 이 조건을 충족하지 않을 수 있다.
