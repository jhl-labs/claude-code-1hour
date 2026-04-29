# V11 : 설치 & 첫 명령 (vhs 시나리오, ~45초)
#
# 핵심:
#   - npm install -> claude --version -> cd -> claude 첫 명령 -> CLAUDE.md 생성
#   - 진짜 npm/claude CLI 호출 없음 — 모두 함수로 가짜 출력
#   - 사용자 시스템 정보 노출 없음
#
Output ../recordings/V11-install.mp4

Set FontSize 20
Set Width 1920
Set Height 1080
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms
Set PlaybackSpeed 1.0

# Setup — 모든 setup 명령은 .bashrc 같은 파일 source 한 줄로 처리
# (각 명령을 Type 으로 일일이 치면 Hide 사이에 prompt blink 가 보일 위험)
Hide
Type `cd /tmp/lecture-demo`
Enter
# 모든 가짜 명령(npm/claude/cd)을 한 줄에 정의 + PS1 설정
Type `source ./.demo-rc-v11.sh 2>/dev/null || { export PS1='nand-dev@u-boot:~$ '; npm() { sleep 1; echo "added 142 packages in 18s"; }; claude() { if [ "$1" = "--version" ]; then echo "claude-code 2.1.121"; else ./fake-claude.sh ./.claude-resp/V11.txt; fi; }; cd() { export PS1='nand-dev@u-boot:'"$1"'$ '; }; }`
Enter
Type `clear`
Enter
Sleep 400ms
Show

# Scene 1: 설치
Type@40ms `npm install -g @anthropic-ai/claude-code`
Sleep 400ms
Enter
Sleep 2500ms

# Scene 2: 버전 확인
Type@40ms `claude --version`
Sleep 300ms
Enter
Sleep 1500ms

# Scene 3: 작업트리 진입 — cd 함수가 PS1 만 바꿈 (실제 디렉토리 변경 안 함)
# '~/u-boot' 를 single quote 로 감싸 ~ expand 차단
Type@40ms `cd '~/u-boot'`
Sleep 300ms
Enter
Sleep 600ms

# Scene 4: 첫 claude 명령 — fake-claude 가 진짜 TUI 흐름으로 응답
Type@45ms `claude '이 저장소가 어떤 프로젝트인지 30초로 요약해줘. CLAUDE.md 도 5줄 만들어줘.'`
Sleep 500ms
Enter

# Claude 응답 + 사용자가 읽을 시간
Sleep 22s
