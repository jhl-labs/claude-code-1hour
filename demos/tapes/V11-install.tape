# V11 : 설치 & 첫 명령 (vhs 시나리오, ~45초)
#
# 핵심:
#   - npm install -> claude --version -> cd -> claude 첫 명령 -> CLAUDE.md 생성 -> 두 번째 질문
#   - 진짜 npm/claude CLI 호출 없음 — 모두 fake-claude.sh + 가짜 출력
#   - 사용자 시스템 정보 노출 없음 (alias 로 차단)
#
Output ../recordings/V11-install.mp4

Set FontSize 20
Set Width 1920
Set Height 1080
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms
Set PlaybackSpeed 1.0

# Setup
Hide
Type `cd /tmp/lecture-demo`
Enter
Type `export PS1='nand-dev@u-boot:~$ '`
Enter
Type `alias npm='echo "added 142 packages in 18s"'`
Enter
Type `alias claude='./fake-claude.sh ./.claude-resp/V11.txt'`
Enter
Type `clear`
Enter
Sleep 300ms
Show

# Scene 1: 설치
Type@40ms `npm install -g @anthropic-ai/claude-code`
Sleep 400ms
Enter
Sleep 1200ms

# Scene 2: 버전 확인
Type@40ms `printf 'claude-code 2.1.121\n'`
Sleep 300ms
Enter
Sleep 800ms

# Scene 3: 작업트리 진입
Type@40ms `cd /tmp/lecture-demo && pwd`
Sleep 300ms
Enter
Sleep 800ms

# Scene 4: 첫 claude 명령 — fake-claude 가 진짜 TUI 흐름으로 응답
Type@45ms `claude '이 저장소가 어떤 프로젝트인지 30초로 요약해줘. CLAUDE.md 도 5줄 만들어줘.'`
Sleep 500ms
Enter

# Claude 응답 + 사용자가 읽을 시간
Sleep 18s
