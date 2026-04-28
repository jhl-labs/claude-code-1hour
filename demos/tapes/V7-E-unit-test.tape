# V7-E : 단위 테스트 자동 생성 (vhs 시나리오, ~70초)
Output ../recordings/V7-E-unit-test.mp4

Set FontSize 22
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
Type `alias claude='_c(){ sleep 2; cat .claude-resp/E.txt; }; _c'`
Enter
Type `clear`
Enter
Sleep 300ms
Show

Type@40ms `grep -l davinci_nand test/dm/ 2>/dev/null || echo '(no tests yet — 0 단위테스트)'`
Sleep 400ms
Enter
Sleep 1500ms

Type@45ms `claude '이 함수의 unit test를 sandbox에서 돌릴 수 있게 작성. 정상 + 경계 조건(타임아웃·잘못된 명령·ECC 비트 1~3개 에러). test/dm/ 패턴 따라서.'`
Sleep 500ms
Enter

Sleep 55s
