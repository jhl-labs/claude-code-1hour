# V7-E : (인터랙티브 모드 vhs)
Output ../recordings/V7-E-unit-test.mp4

Set FontSize 20
Set Width 1920
Set Height 1080
Set Theme "Catppuccin Mocha"
Set TypingSpeed 45ms
Set PlaybackSpeed 1.0

Hide
Type `cd /tmp/lecture-demo`
Enter
Type `export PS1='nand-dev@u-boot:~/u-boot$ '; claude() { ./fake-claude.sh ./.claude-resp/E.txt interactive; }`
Enter
Type `clear`
Enter
Sleep 400ms
Show

# Scene A: 단위테스트 0개 확인
Type@40ms `grep -l davinci_nand test/dm/ 2>/dev/null || echo '(no tests yet — 0 단위테스트)'`
Sleep 400ms
Enter
Sleep 1500ms

# Scene B: claude 인터랙티브
Type@40ms `claude`
Sleep 300ms
Enter
Sleep 1800ms

Type@45ms `이 함수의 unit test를 sandbox에서 돌릴 수 있게 작성. 정상 + 경계 조건(타임아웃·잘못된 명령·ECC 비트 1~3개 에러). test/dm/ 패턴 따라서.`
Sleep 500ms
Enter

Sleep 38s

Type@50ms `/exit`
Sleep 300ms
Enter
Sleep 2s
