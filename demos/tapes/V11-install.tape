# V11 : 설치 & 첫 명령 (인터랙티브 모드 vhs, ~45초)
#
# 흐름:
#   $ npm install -g @anthropic-ai/claude-code   → "added 142 packages..."
#   $ claude --version                            → 2.1.121
#   $ cd '~/u-boot'                               → PS1 만 변경 (vtopia 노출 차단)
#   $ claude                                      → fake-claude.sh interactive
#   Welcome + > prompt 박스
#   사용자: 이 저장소가 어떤 프로젝트인지...
#   Claude: 응답
#   /exit
#
Output ../recordings/V11-install.mp4

Set FontSize 20
Set Width 1920
Set Height 1080
Set Theme "Catppuccin Mocha"
Set TypingSpeed 45ms
Set PlaybackSpeed 1.0

# Setup — 모든 가짜 명령을 한 줄에 정의
Hide
Type `cd /tmp/lecture-demo`
Enter
Type `export PS1='nand-dev@u-boot:~$ '; npm() { sleep 1; echo "added 142 packages in 18s"; }; cd() { export PS1='nand-dev@u-boot:'"$1"'$ '; }; claude() { if [ "$1" = "--version" ]; then echo "claude-code 2.1.121"; else ./fake-claude.sh ./.claude-resp/V11.txt interactive; fi; }`
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

# Scene 3: 작업트리 진입 (PS1 만 변경)
Type@40ms `cd '~/u-boot'`
Sleep 300ms
Enter
Sleep 800ms

# Scene 4: claude 인터랙티브 모드
Type@40ms `claude`
Sleep 300ms
Enter
Sleep 1800ms

# Scene 5: prompt
Type@45ms `이 저장소가 어떤 프로젝트인지 30초로 요약해줘. CLAUDE.md 도 5줄 만들어줘.`
Sleep 500ms
Enter

Sleep 30s

Type@50ms `/exit`
Sleep 300ms
Enter
Sleep 2s
