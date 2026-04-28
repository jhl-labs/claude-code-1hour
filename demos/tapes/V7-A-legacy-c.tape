# V7-A : 레거시 C 분석·리팩토링 (vhs 시나리오, ~70초)
#
# 핵심:
#   - 가짜 prompt: nand-dev@u-boot:~/u-boot$ — 사용자명/호스트명 노출 회피
#   - alias claude='cat .claude-resp/A.txt' — 실제 claude CLI 호출 차단
#   - cd /tmp/lecture-demo (사전 준비된 가상 작업트리)
#
Output ../recordings/V7-A-legacy-c.mp4

Set FontSize 22
Set Width 1920
Set Height 1080
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms
Set PlaybackSpeed 1.0

# Setup: 깨끗한 prompt + claude alias (Hide로 화면 안 보임)
Hide
Type `cd /tmp/lecture-demo`
Enter
Type `export PS1='nand-dev@u-boot:~/u-boot$ '`
Enter
Type `alias claude='_c(){ sleep 2; cat .claude-resp/A.txt; }; _c'`
Enter
Type `clear`
Enter
Sleep 300ms
Show

# Scene A: 코드 규모 확인
Type@40ms `wc -l drivers/mtd/nand/raw/davinci_nand.c`
Sleep 400ms
Enter
Sleep 1500ms

# Scene B: claude에 분석 요청
Type@45ms `claude '이 NAND 컨트롤러 드라이버의 함수별 책임을 정리하고, 명령 시퀀서·ECC·DMA 부분을 책임 단위로 분리할 수 있게 리팩토링을 제안해줘. 비트필드 매크로 가독성 개선 포함.'`
Sleep 500ms
Enter

# Claude 응답 + 사용자가 읽을 시간
Sleep 50s
