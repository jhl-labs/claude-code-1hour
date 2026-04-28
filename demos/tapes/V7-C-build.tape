# V7-C : 빌드 시스템 다루기 (vhs 시나리오, ~70초)
Output ../recordings/V7-C-build.mp4

Set FontSize 22
Set Width 1920
Set Height 1080
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms
Set PlaybackSpeed 1.0

Hide
Type `cd /tmp/lecture-demo`
Enter
Type `touch drivers/mtd/nand/raw/Kconfig drivers/mtd/nand/raw/Makefile configs/sandbox_defconfig`
Enter
Type `export PS1='nand-dev@u-boot:~/u-boot$ '`
Enter
Type `alias claude='_c(){ sleep 2; cat .claude-resp/C.txt; }; _c'`
Enter
Type `clear`
Enter
Sleep 300ms
Show

Type@40ms `ls drivers/mtd/nand/raw/Kconfig drivers/mtd/nand/raw/Makefile configs/sandbox_defconfig`
Sleep 400ms
Enter
Sleep 1500ms

Type@45ms `claude 'CONFIG_NAND_DAVINCI_V2 Kconfig 옵션 추가. 관련 Makefile, defconfig까지 일관되게. sandbox 빌드가 깨지지 않게.'`
Sleep 500ms
Enter

Sleep 50s
