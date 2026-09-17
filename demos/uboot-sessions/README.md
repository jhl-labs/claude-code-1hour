# U-Boot 실습 4편 · 실제 Claude Code 세션

2026-09-17, Claude Code 2.1.274 / Sonnet 5 (low effort). 공개 U-Boot v2026.01의 커밋 `127a42c7257a6ffbbd1575ed1cbaa8f5408a44b3`을 별도 임시 작업 디렉토리에 복제했다.

| 시연 | 실제 작업 | 편집본 |
|---|---|---|
| 분석 | git commit 확인, Read/Grep, ECC·ready 분석, sed로 원문 대조 | 36초 |
| 빌드 | da850evm_nand_defconfig, ARM GCC 11.4, davinci_nand.o 컴파일, .config·ELF 확인 | 29초 |
| 테스트 | 실제 helper 추출, 같은 헤더를 검사하는 호스트 테스트, mutation 검사, 생성 스크립트 리뷰·수정, 1-bit 변형 컴파일 | 103초 |
| 문서 | 소스·diff 근거 수집, Markdown 저장, 단위 오류 수정, 빌드 명령 대조·재검사 | 75초 |

각 `*-prompt.txt`는 최초 요청이다. 분석에서는 실제 192~209행·732~735행을 sed로 출력하도록 추가 요청했다. 테스트에서는 “컴파일 실패를 mutant 감지 성공으로 오인하지 말고, 실제 SIGABRT에만 성공 처리하며 core dump를 끄라”고 리뷰 후 추가 요청했다. 문서에서는 “12바이트”를 “24비트·3바이트”로 고치고, 호스트 검증과 보드 검증을 구분하고, 실제 O= 경로의 명령으로 재검사하도록 추가 요청했다. 생성 결과를 그대로 정답으로 취급하지 않는다.

## 실제 결과 재현

`davinci-ecc-demo.patch`는 기준 커밋에 적용 가능한 변경 전체다. `source/`에는 생성된 helper·테스트·문서 원문을 같은 경로 구조로 보존했다.

```sh
# U-Boot v2026.01의 별도 작업 사본에서 실행
# patch 경로는 이 저장소의 demos/uboot-sessions/davinci-ecc-demo.patch

git apply /path/to/davinci-ecc-demo.patch
python3 examples/claude-demo/run_mutant_check.py
```

실제 결과: baseline exit 0, mutant assertion 실패(SIGABRT, -6), 원본 helper 유지. 테스트는 고정 경계값 10개, reserved bit 불변성, 결정적 입력 5,000개를 검사한다. compile failure를 주입한 독립 확인에서도 mutant 감지 성공으로 오인하지 않고 exit 1을 반환했다.

기본 보드 설정은 **4-bit ECC**다. 이 설정의 object 컴파일 성공만으로 수정한 1-bit 분기를 검증했다고 주장하지 않는다.

```sh
make O=build/da850-demo CROSS_COMPILE=arm-linux-gnueabi- da850evm_nand_defconfig
make -j4 O=build/da850-demo CROSS_COMPILE=arm-linux-gnueabi- drivers/mtd/nand/raw/davinci_nand.o
file build/da850-demo/drivers/mtd/nand/raw/davinci_nand.o

# 별도의 1-bit 코드 컴파일 확인용 설정. 실제 보드 권장 설정이 아니다.
make O=build/da850-1bit-demo CROSS_COMPILE=arm-linux-gnueabi- da850evm_nand_defconfig
scripts/config --file build/da850-1bit-demo/.config --disable SYS_NAND_4BIT_HW_ECC_OOBFIRST --enable SYS_NAND_HW_ECC
make O=build/da850-1bit-demo CROSS_COMPILE=arm-linux-gnueabi- olddefconfig
grep '^CONFIG_SYS_NAND_HW_ECC=' build/da850-1bit-demo/.config
make -j4 O=build/da850-1bit-demo CROSS_COMPILE=arm-linux-gnueabi- drivers/mtd/nand/raw/davinci_nand.o
git diff --check
```

실습은 드라이버 object와 비트 포장 helper를 검사한다. 전체 펌웨어 링크·부팅·ECC 회로·NAND I/O·실보드 오류 주입은 수행하지 않았다. 문서 시연 마지막 make는 이미 만들어진 object의 재검사이며 새 컴파일이라고 표시하지 않는다.

## 녹화와 편집 근거

- `scripts/videos/capture-session.py`: 실제 대화형 CLI를 xterm에 띄우고 Xvfb 화면을 ffmpeg x11grab으로 캡처한다. 가짜 터미널 출력은 생성하지 않는다.
- 사용자 확장을 끄는 safe mode, Read/Grep/Glob/Bash/Edit/Write만 사용했다. 권한 우회 플래그는 사용하지 않았고 필요한 명령은 실제 승인 화면에서 확인했다.
- `edit-plan.json`: 원본의 보존 구간, 챕터와 자막. 긴 승인 대기·응답 후 정지를 제외하고 원래 순서와 1배속을 유지했다.
- 테스트 원본의 209~240초에는 계정 소유자 정보가 출력돼 해당 구간 전체를 가렸다. 편집본은 이 구간을 포함하지 않는다. 나머지 원본의 출력은 바꾸지 않았다.
- `public/videos/practice-demos.json`: 게시 편집본과 공개 원본의 SHA-256, 길이, 편집 구간, 실행 버전·소스 커밋.
- 원본과 편집본은 영상 아래 링크로 제공한다. 원본은 승인 대기 등을 포함하므로 학습용 기본 재생은 편집본을 사용한다.

게시 원본으로 재편집:

```sh
python scripts/videos/publish-practices.py demos/uboot-sessions/edit-plan.json --published-raw
```
