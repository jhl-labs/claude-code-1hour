# V7-H : 문서화 자동 생성 (vhs 시나리오)
Output ../recordings/V7-H-docs.mp4

Set FontSize 22
Set Width 1920
Set Height 1080
Set Theme "Catppuccin Mocha"
Set TypingSpeed 40ms
Set PlaybackSpeed 1.0

Hide
Type "export PS1='$ '"
Enter
Type "clear"
Enter
Show

Type@40ms "find Documentation -name '*davinci*nand*' 2>/dev/null | wc -l"
Enter
Sleep 700ms

Type@40ms "claude '이 드라이버의 컨트롤러 레지스터 맵을 마크다운 표로(오프셋·비트필드·의미). NAND read page 명령 흐름을 Mermaid 시퀀스 다이어그램으로(CPU/컨트롤러/NAND chip).'"
Enter
Sleep 1500ms

Type "cat ../outputs/H-docs.txt"
Enter
Sleep 60s
