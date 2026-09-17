# 실제 Claude Code 시연 · 2026-09-17

Claude Code 2.1.274 / Sonnet 5 (low effort), Linux, GCC.
`bitfield.c`는 시연을 위해 12비트 마스크를 8비트로 잘못 작성한 작은 교육용 파일이다.
실제 U-Boot 버그나 실제 보드 테스트라고 주장하지 않는다.

1. `/tmp/claude-code-live-demo/bitfield.c`에 수정 전 파일을 복사했다.
2. 대화형 Claude Code에서 읽기만 요청했다. Read 결과에 기반해 4행 마스크 문제를 설명했다.
3. 실패 재현 → 한 줄 수정 → 같은 명령으로 재검증을 요청했다.
4. 실제 Bash 실행은 assertion 실패 / exit code 134를 반환했다.
5. 실제 Edit가 `0x00ffu`를 `0x0fffu`로 바꿨다. 결과가 `bitfield.after.c`다.
6. 같은 컴파일·실행 명령은 `4 boundary cases passed`를 출력했다.
7. Ctrl+O로 상세 로그를 열고 PageUp/PageDown으로 실패·성공 기록을 검토했다.

## 요청 원문

> /tmp/claude-code-live-demo/bitfield.c를 읽고 low12의 요구사항과 구현이 일치하는지 설명해줘. 아직 파일을 수정하지 말고 문제의 코드 위치를 알려줘. 한국어로 간결하게 답해줘.

> 먼저 cc -std=c11 -Wall -Wextra -Werror bitfield.c -o bitfield-test && ./bitfield-test 로 실패를 재현해줘. 그다음 마스크 한 곳만 수정하고 같은 명령으로 재검증해줘. 실패·수정·통과 결과와 검증하지 않은 범위를 짧게 보고해줘.

## 녹화·편집

- Xvfb의 실제 xterm 화면을 ffmpeg x11grab으로 캡처했다. 터미널 출력 문자열을 만들어서 재생하지 않았다.
- 1504×994, 15fps, 무음. 한국어 해설은 별도 VTT이며 CLI 출력이 아니다.
- 사용자 확장을 끄는 `--safe-mode`, 도구 `Read,Edit,Bash`, `--permission-mode acceptEdits`, 명령 허용 `Bash(cc *)`, `Bash(./bitfield-test)`를 사용했다. MCP는 빈 설정이다. 권한 우회 플래그는 사용하지 않았다.
- 원본: `public/videos/source/claude-code-real-uncut.mp4` (124.534초).
- 편집본: `public/videos/claude-code-real.mp4` (50초).
- `public/videos/real-demo.json`에 원본·편집본 SHA-256 및 원본의 보존 구간을 기록했다. 구간 순서와 재생 속도를 유지했고, 응답 후 대기·로그 탐색 사이 정지 구간만 제외했다.
- 재편집: `python scripts/videos/edit-recording.py public/videos/source/claude-code-real-uncut.mp4`
- 같은 프롬프트를 다시 실행하더라도 모델 응답과 소요시간은 달라질 수 있다.

## 결과 독립 확인

격리된 임시 디렉토리에서 각 파일을 컴파일·실행한다. 수정 전 assertion 실패는 **의도된 결과**이며 수정 후 네 입력의 통과와 비교한다.

```sh
cc -std=c11 -Wall -Wextra -Werror bitfield.c -o /tmp/bitfield-before
cc -std=c11 -Wall -Wextra -Werror bitfield.after.c -o /tmp/bitfield-after
/tmp/bitfield-before
/tmp/bitfield-after
```

검증 범위는 네 입력에서의 하위 12비트 추출이다. ECC, MMIO, DMA, 보드 동작을 검증하지 않는다.
