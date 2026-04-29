#!/usr/bin/env bash
# fake-claude.sh — 진짜 Claude Code TUI 를 흉내내는 시연용 스크립트
#
# 두 가지 모드:
#   1. 비인터랙티브  (`claude '<prompt>'`) — data-file 만 출력 후 종료
#   2. 인터랙티브   (`claude` 단독)         — REPL 시뮬레이션
#                                            > prompt 박스 → 응답 → > prompt → ...
#                                            /exit 로 종료
#
# data-file 디렉티브: @PROMPT, @SLEEP, @BULLET, @INDENT, @THINK, @SECTION,
# @FOOTER, @DONE, @RAW, @COMMENT, 그 외 모든 줄은 그대로 출력.
#
# 절대 규칙:
#   - 사용자 시스템 정보 (호스트명/홈경로/IP) 절대 출력 금지
#   - $USER/$HOME/$HOSTNAME 등 환경변수 직접 안 읽음

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

ms_sleep() {
    local ms="$1"
    awk "BEGIN{ system(\"sleep \" $ms / 1000) }" >/dev/null 2>&1 || sleep 0.05
}

emit_response_body() {
    # data-file 의 모든 줄을 directive 에 따라 출력
    while IFS= read -r line || [[ -n "$line" ]]; do
        case "$line" in
            '@PROMPT '*)
                # 인터랙티브 모드에서는 사용자 prompt 입력이 별도이므로 무시
                : ;;
            '@SLEEP '*)
                ms="${line#@SLEEP }"
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
                : ;;
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
}

# 인터랙티브 모드 판정: 두번째 인자가 'i' 또는 'interactive' 거나 stdin 이 tty
MODE="${2:-auto}"
if [[ "$MODE" == "auto" ]]; then
    if [ -t 0 ]; then MODE="interactive"; else MODE="prompt"; fi
fi

# 진입 헤더 (구분선)
print_separator() {
    printf '%s%s%s\n' "$C_DIM" "─────────────────────────────────────────────────────────────" "$C_RESET"
}

if [[ "$MODE" == "interactive" ]]; then
    # ── Welcome banner ──
    printf '\n'
    printf '%s%s★%s %s%sClaude Code v2.1.121%s  %s/help for shortcuts%s\n' \
        "$C_BOLD" "$C_ORANGE" "$C_RESET" "$C_BOLD" "$C_ORANGE" "$C_RESET" "$C_DIM" "$C_RESET"
    printf '%s%s%s\n' "$C_DIM" "  ~/u-boot · main · 2026-04-29" "$C_RESET"
    printf '\n'
    ms_sleep 800

    # 첫 prompt 박스 — 사용자 입력은 .tape 의 Type 으로 옴
    printf '%s╭───────────────────────────────────────────────────────────╮%s\n' "$C_DIM" "$C_RESET"
    printf '%s│%s %s>%s ' "$C_DIM" "$C_RESET" "$C_BOLD" "$C_RESET"
    # stdin 에서 한 줄 읽음 (사용자 입력)
    IFS= read -r user_prompt
    # 박스 닫기 + 입력 echo
    printf '%s%s\n' "$user_prompt" ""
    printf '%s╰───────────────────────────────────────────────────────────╯%s\n' "$C_DIM" "$C_RESET"
    ms_sleep 600

    # /exit 처리
    if [[ "$user_prompt" == "/exit" ]] || [[ "$user_prompt" == "/quit" ]]; then
        printf '\n%sGoodbye%s\n' "$C_DIM" "$C_RESET"
        exit 0
    fi

    # 응답
    emit_response_body
    ms_sleep 800

    # 다음 prompt 띄우고 한 줄 더 읽음 (대개 /exit)
    printf '\n%s╭───────────────────────────────────────────────────────────╮%s\n' "$C_DIM" "$C_RESET"
    printf '%s│%s %s>%s ' "$C_DIM" "$C_RESET" "$C_BOLD" "$C_RESET"
    if IFS= read -r second_prompt; then
        printf '%s\n' "$second_prompt"
        printf '%s╰───────────────────────────────────────────────────────────╯%s\n' "$C_DIM" "$C_RESET"
        if [[ "$second_prompt" != "/exit" && "$second_prompt" != "/quit" && -n "$second_prompt" ]]; then
            # 두번째 응답이 필요하면 짧게 ack
            ms_sleep 400
            printf '\n%s●%s 다음 단계로 넘어갑니다…\n' "$C_CYAN" "$C_RESET"
            ms_sleep 600
        fi
        printf '\n%sGoodbye%s\n' "$C_DIM" "$C_RESET"
    fi
else
    # ── 비인터랙티브: data-file 의 @PROMPT 도 prompt 박스로 표시 ──
    print_separator
    while IFS= read -r line || [[ -n "$line" ]]; do
        case "$line" in
            '@PROMPT '*)
                text="${line#@PROMPT }"
                printf '\n%s>%s %s\n\n' "$C_BOLD" "$C_RESET" "$text"
                ms_sleep 700
                ;;
            *)
                # 단일 줄 처리 — emit_response_body 와 동일 분기 재사용 위해 임시 파일
                printf '%s\n' "$line"
                ;;
        esac
    done < "$DATA_FILE"
fi
