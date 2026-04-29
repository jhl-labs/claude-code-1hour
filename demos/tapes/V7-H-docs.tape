# V7-H : (인터랙티브 모드 vhs)
Output ../recordings/V7-H-docs.mp4

Set FontSize 20
Set Width 1920
Set Height 1080
Set Theme "Catppuccin Mocha"
Set TypingSpeed 45ms
Set PlaybackSpeed 1.0

Hide
Type `cd /tmp/lecture-demo`
Enter
Type `export PS1='nand-dev@u-boot:~/u-boot$ '; claude() { ./fake-claude.sh ./.claude-resp/H.txt interactive; }`
Enter
Type `clear`
Enter
Sleep 400ms
Show

# Scene A: 문서 0건 확인
Type@40ms `find Documentation -name '*davinci*nand*' 2>/dev/null | wc -l`
Sleep 400ms
Enter
Sleep 1500ms

# Scene B: claude 인터랙티브
Type@40ms `claude`
Sleep 300ms
Enter
Sleep 1800ms

Type@45ms `이 드라이버의 컨트롤러 레지스터 맵을 마크다운 표로(오프셋·비트필드·의미). NAND read page 명령 흐름을 Mermaid 시퀀스 다이어그램으로(CPU/컨트롤러/NAND chip).`
Sleep 500ms
Enter

Sleep 38s

Type@50ms `/exit`
Sleep 300ms
Enter
Sleep 2s
