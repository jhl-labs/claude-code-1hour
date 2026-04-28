# V7-A : 레거시 C 분석/리팩토링 (vhs 시나리오)
# 실행: cd demos/tapes && vhs V7-A-legacy-c.tape  (요구: ttyd)
Output ../recordings/V7-A-legacy-c.mp4

Set FontSize 22
Set Width 1920
Set Height 1080
Set Theme "Catppuccin Mocha"
Set TypingSpeed 40ms
Set PlaybackSpeed 1.0

# 깔끔한 prompt — 호스트/유저 정보 노출 차단
Hide
Type "export PS1='$ '"
Enter
Type "clear"
Enter
Show

Type@40ms "wc -l drivers/mtd/nand/raw/davinci_nand.c"
Enter
Sleep 800ms

Type@40ms "claude '이 NAND 컨트롤러 드라이버의 함수별 책임을 정리하고, 명령 시퀀서·ECC·DMA 부분을 책임 단위로 분리할 수 있게 리팩토링을 제안해줘. 비트필드 매크로 가독성 개선 포함.'"
Enter
Sleep 1500ms

Type "cat ../outputs/A-legacy-c.txt"
Enter
Sleep 60s
