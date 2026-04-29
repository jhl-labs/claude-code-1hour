#!/usr/bin/env bash
# fake-claude.sh — 진짜 Claude Code TUI 흐름을 흉내내는 시연용 스크립트
#
# 목적:
#   - 진짜 claude CLI는 인증/사용자 정보 노출 위험으로 vhs 녹화 중 사용 불가
#   - 그러나 영상에서는 "사용자 -> claude '<prompt>'" 가 진짜처럼 보여야 함
#
# 사용법:
#   fake-claude.sh <data-file>   # data-file 은 프롬프트+응답이 박힌 시연 스크립트
#
# data-file 디렉티브:
#   @PROMPT <text>          사용자 입력 prompt 박스 출력
#   @SLEEP <ms>             밀리초 단위 sleep
#   @BULLET <color> <text>  Claude 도구 호출 라인 (● + 컬러)
#   @INDENT <text>          도구 결과 (  ⎿  + 텍스트)
#   @THINK <text>           Claude 사고 (● + cyan)
#   @SECTION <text>         섹션 구분선 + 제목
#   @FOOTER <text>          마지막 메타 (모델/시간)
#   @RAW <text>             그대로 출력 (ANSI 컬러 escape 그대로 통과)
#   @DONE                   완료 마크
#   <text>                  그 외 모든 줄은 그대로 출력 (ANSI escape 통과)
#
# 절대 규칙:
#   - 사용자 시스템 정보 (호스트명/홈경로/IP) 절대 출력 금지
#   - 환경 변수 직접 안 읽음 ($USER/$HOME/$HOSTNAME 등 사용 X)

set -u

DATA_FILE="${1:-}"
if [[ -z "$DATA_FILE" || ! -f "$DATA_FILE" ]]; then
    echo "fake-claude.sh: data-file not found: $DATA_FILE" >&2
    exit 1
fi

# ANSI 컬러
C_RESET=$'\033[0m'
C_BOLD=$'\033[1m'
C_DIM=$'\033[2m'
C_ORANGE=$'\033[38;5;208m'
C_CYAN=$'\033[38;5;87m'
C_GREEN=$'\033[38;5;120m'
C_YELLOW=$'\033[38;5;220m'
C_PURPLE=$'\033[38;5;141m'
C_GREY=$'\033[38;5;245m'
C_BLUE=$'\033[38;5;111m'

color_for() {
    case "$1" in
        orange) printf '%s' "$C_ORANGE" ;;
        cyan)   printf '%s' "$C_CYAN" ;;
        green)  printf '%s' "$C_GREEN" ;;
        yellow) printf '%s' "$C_YELLOW" ;;
        purple) printf '%s' "$C_PURPLE" ;;
        blue)   printf '%s' "$C_BLUE" ;;
        grey)   printf '%s' "$C_GREY" ;;
        *)      printf '%s' "$C_RESET" ;;
    esac
}

# 한 줄 출력 + 짧은 sleep (자연스러운 스트리밍 효과)
emit() {
    printf '%b\n' "$1"
}

ms_sleep() {
    local ms="$1"
    awk "BEGIN{ system(\"sleep \" $ms / 1000) }" >/dev/null 2>&1 || sleep 0.05
}

# 진입 헤더 (진짜 Claude Code 첫 줄과 비슷하게)
printf '%s%s%s\n' "$C_DIM" "─────────────────────────────────────────────────────────────" "$C_RESET"

while IFS= read -r line || [[ -n "$line" ]]; do
    case "$line" in
        '@PROMPT '*)
            text="${line#@PROMPT }"
            printf '\n%s>%s %s\n\n' "$C_BOLD" "$C_RESET" "$text"
            ms_sleep 700
            ;;
        '@SLEEP '*)
            ms="${line#@SLEEP }"
            # 교육용 가독성을 위해 모든 SLEEP 값을 1.6x로 늘림
            ms=$((ms * 16 / 10))
            ms_sleep "$ms"
            ;;
        '@BULLET '*)
            rest="${line#@BULLET }"
            color="${rest%% *}"
            text="${rest#* }"
            col="$(color_for "$color")"
            printf '%s●%s %s\n' "$col" "$C_RESET" "$text"
            ms_sleep 180
            ;;
        '@INDENT '*)
            text="${line#@INDENT }"
            printf '  %s⎿%s  %s\n' "$C_DIM" "$C_RESET" "$text"
            ms_sleep 120
            ;;
        '@THINK '*)
            text="${line#@THINK }"
            printf '%s●%s %s%s%s\n' "$C_CYAN" "$C_RESET" "$C_DIM" "$text" "$C_RESET"
            ms_sleep 240
            ;;
        '@SECTION '*)
            text="${line#@SECTION }"
            printf '\n%s%s%s\n' "$C_BOLD" "$text" "$C_RESET"
            printf '%s%s%s\n' "$C_DIM" "─────────────────────────────────────────────────────────────" "$C_RESET"
            ms_sleep 400
            ;;
        '@FOOTER '*)
            text="${line#@FOOTER }"
            printf '\n%s%s%s\n' "$C_DIM" "$text" "$C_RESET"
            ms_sleep 200
            ;;
        '@DONE')
            printf '\n%s✓%s %sTask complete%s\n' "$C_GREEN" "$C_RESET" "$C_BOLD" "$C_RESET"
            ms_sleep 400
            ;;
        '@RAW '*)
            text="${line#@RAW }"
            printf '%b\n' "$text"
            ms_sleep 60
            ;;
        '@COMMENT '*)
            : # 주석은 무시
            ;;
        '')
            printf '\n'
            ms_sleep 50
            ;;
        *)
            printf '%s\n' "$line"
            ms_sleep 60
            ;;
    esac
done < "$DATA_FILE"
