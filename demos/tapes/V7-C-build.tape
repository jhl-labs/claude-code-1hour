# V7-C : 빌드 시스템 다루기 (vhs 시나리오)
Output ../recordings/V7-C-build.mp4

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

Type@40ms "ls drivers/mtd/nand/raw/Kconfig drivers/mtd/nand/raw/Makefile configs/sandbox_defconfig"
Enter
Sleep 700ms

Type@40ms "claude 'CONFIG_NAND_DAVINCI_V2 Kconfig 옵션 추가. 관련 Makefile, defconfig까지 일관되게. sandbox 빌드가 깨지지 않게.'"
Enter
Sleep 1500ms

Type "cat ../outputs/C-build.txt"
Enter
Sleep 60s
