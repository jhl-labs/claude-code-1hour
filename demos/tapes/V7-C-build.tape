# V7-C : (인터랙티브 모드 vhs)
Output ../recordings/V7-C-build.mp4

Set FontSize 20
Set Width 1920
Set Height 1080
Set Theme "Catppuccin Mocha"
Set TypingSpeed 45ms
Set PlaybackSpeed 1.0

Hide
Type `cd /tmp/lecture-demo`
Enter
Type `export PS1='nand-dev@u-boot:~/u-boot$ '; claude() { ./fake-claude.sh ./.claude-resp/C.txt interactive; }`
Enter
Type `touch drivers/mtd/nand/raw/Kconfig drivers/mtd/nand/raw/Makefile configs/sandbox_defconfig`
Enter
Type `clear`
Enter
Sleep 400ms
Show

# Scene A: 수정 대상 파일 확인
Type@40ms `ls drivers/mtd/nand/raw/Kconfig drivers/mtd/nand/raw/Makefile configs/sandbox_defconfig`
Sleep 400ms
Enter
Sleep 1500ms

# Scene B: claude 인터랙티브
Type@40ms `claude`
Sleep 300ms
Enter
Sleep 1800ms

# Scene C: prompt
Type@45ms `CONFIG_NAND_DAVINCI_V2 Kconfig 옵션 추가. 관련 Makefile, defconfig까지 일관되게. sandbox 빌드가 깨지지 않게.`
Sleep 500ms
Enter

Sleep 38s

Type@50ms `/exit`
Sleep 300ms
Enter
Sleep 2s
