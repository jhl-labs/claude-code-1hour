# V7-E : 단위 테스트 자동 생성 (vhs 시나리오)
Output ../recordings/V7-E-unit-test.mp4

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

Type@40ms "grep -l davinci_nand test/dm/ 2>/dev/null || echo '(no tests yet)'"
Enter
Sleep 700ms

Type@40ms "claude '이 함수의 unit test를 sandbox에서 돌릴 수 있게 작성. 정상 + 경계 조건(타임아웃·잘못된 명령·ECC 비트 1~3개 에러). test/dm/ 패턴 따라서.'"
Enter
Sleep 1500ms

Type "cat ../outputs/E-unit-test.txt"
Enter
Sleep 60s
