# V11 : 설치 & 첫 명령 (vhs 시나리오, ~30초)
# V11.txt 자체가 prompt + 응답 전체 흐름을 담고 있어 단순 cat
Output ../recordings/V11-install.mp4

Set FontSize 22
Set Width 1920
Set Height 1080
Set Theme "Catppuccin Mocha"
Set TypingSpeed 50ms
Set PlaybackSpeed 1.0

Hide
Type `cd /tmp/lecture-demo`
Enter
Type `export PS1='nand-dev@u-boot:~$ '`
Enter
Type `clear`
Enter
Sleep 300ms
Show

Type@45ms `cat .claude-resp/V11.txt`
Sleep 400ms
Enter
Sleep 25s
