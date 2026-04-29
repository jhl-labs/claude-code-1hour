# V7-A : 레거시 C 분석·리팩토링 (인터랙티브 모드 vhs, ~75초)
#
# 흐름:
#   $ claude              → fake-claude.sh interactive 진입
#   Welcome + > prompt 박스
#   사용자: 이 NAND 컨트롤러 ...    (.tape Type)
#   Claude: 응답 100줄 (함수 책임표 / diff / race condition / 다음 단계)
#   /exit                 → Goodbye
#
Output ../recordings/V7-A-legacy-c.mp4

Set FontSize 20
Set Width 1920
Set Height 1080
Set Theme "Catppuccin Mocha"
Set TypingSpeed 45ms
Set PlaybackSpeed 1.0

# Setup
Hide
Type `cd /tmp/lecture-demo`
Enter
Type `export PS1='nand-dev@u-boot:~/u-boot$ '; claude() { ./fake-claude.sh ./.claude-resp/A.txt interactive; }`
Enter
Type `clear`
Enter
Sleep 400ms
Show

# Scene A: 코드 규모 확인
Type@40ms `wc -l drivers/mtd/nand/raw/davinci_nand.c`
Sleep 400ms
Enter
Sleep 1500ms

# Scene B: claude 인터랙티브 모드 진입
Type@40ms `claude`
Sleep 300ms
Enter
Sleep 1800ms

# Scene C: 사용자 prompt (> 박스 안)
Type@45ms `이 NAND 컨트롤러 드라이버의 함수별 책임을 정리하고, 명령 시퀀서·ECC·DMA 부분을 책임 단위로 분리할 수 있게 리팩토링을 제안해줘. 비트필드 매크로 가독성 개선 포함.`
Sleep 500ms
Enter

# Scene D: Claude 응답 + 사용자 읽기 시간
Sleep 38s

# Scene E: /exit 종료
Type@50ms `/exit`
Sleep 300ms
Enter
Sleep 2s
