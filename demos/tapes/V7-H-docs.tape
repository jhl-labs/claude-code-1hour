# V7-H : 문서화 자동 생성 (vhs 시나리오, ~75초)
Output ../recordings/V7-H-docs.mp4

Set FontSize 20
Set Width 1920
Set Height 1080
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms
Set PlaybackSpeed 1.0

Hide
Type `cd /tmp/lecture-demo`
Enter
Type `export PS1='nand-dev@u-boot:~/u-boot$ '`
Enter
Type `alias claude='./fake-claude.sh ./.claude-resp/H.txt'`
Enter
Type `clear`
Enter
Sleep 300ms
Show

Type@40ms `find Documentation -name '*davinci*nand*' 2>/dev/null | wc -l`
Sleep 400ms
Enter
Sleep 1500ms

Type@45ms `claude '이 드라이버의 컨트롤러 레지스터 맵을 마크다운 표로(오프셋·비트필드·의미). NAND read page 명령 흐름을 Mermaid 시퀀스 다이어그램으로(CPU/컨트롤러/NAND chip).'`
Sleep 500ms
Enter

Sleep 35s
