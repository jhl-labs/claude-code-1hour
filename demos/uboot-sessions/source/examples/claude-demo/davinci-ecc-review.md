# davinci_nand.c 1-bit ECC helper 추출 검토

기준 커밋: `127a42c7` "Prepare v2026.01" (검토 시점 워킹트리는 여기에 unstaged 변경 포함).

## 변경 요약
- `drivers/mtd/nand/raw/davinci_nand.c:200` `nand_davinci_calculate_ecc()` 내부의, raw 32비트에서 RESERVED 8비트(31:28, 15:12)를 제거해 24비트(3바이트)로 압축/반전/분해하는 로직(원래 인라인 코드, `git diff` 기준 10줄 삭제)을 `davinci_ecc_pack_1bit()` 함수 호출 한 줄로 대체.
- 새 파일 `drivers/mtd/nand/raw/davinci_ecc_pack.h`에 동일 로직을 `static inline`으로 추출, `#include "davinci_ecc_pack.h"`를 `davinci_nand.c:39` 부근에 추가.
- 비트 연산 자체(`tmp & 0x00000fff`, `>> 4`, `~tmp`, 바이트 분해)는 원본과 1:1 동일 — 로직 변경 없음, 함수 경계만 이동.

## 1-bit ECC 흐름 (davinci_nand.c 기준)
1. MMIO 읽기: `nand_davinci_readecc()` (davinci_nand.c:170-178)가 `davinci_emif_regs->nandfecc[CFG_SYS_NAND_CS-2]`를 `__raw_readl`로 읽음.
2. 호출부: `nand_davinci_calculate_ecc()` (davinci_nand.c:193-216)가 `tmp = nand_davinci_readecc(mtd)` 후 `davinci_ecc_pack_1bit(tmp, ecc_code)` 호출 (davinci_nand.c:198,200).
3. Packing: `davinci_ecc_pack_1bit()` (davinci_ecc_pack.h:24-33)가 RESERVED 비트(31:28, 15:12) 제거 후 12+12비트를 압축, 반전(`~tmp`), 3바이트로 분해.
4. Correct: `nand_davinci_correct_data()` (davinci_nand.c:218~)가 `read_ecc`/`calc_ecc` 3바이트를 다시 24비트로 합쳐 XOR로 비교/정정.

## 4-bit ECC 및 ready 경로는 별개
- 4-bit ECC 적재/정정 코드는 `nand4biteccload` 레지스터를 사용하는 별도 블록(davinci_nand.c:579 부근, `CONFIG_SYS_NAND_4BIT_HW_ECC_OOBFIRST` 하)이며 이번 변경과 무관, `davinci_ecc_pack_1bit()`를 호출하지 않음.
- `nand_davinci_dev_ready()` (davinci_nand.c:724-727)는 `nandfsr` 레지스터의 비트0만 읽는 독립 함수로, ECC packing과 무관.

## 테스트/빌드 명령
호스트 유닛테스트 (본 PC에서 이미 실행/검증 완료, 보드 실행용 테스트 아님):
```
python3 examples/claude-demo/run_mutant_check.py
```
`cc -std=c11 -Wall -Wextra -Werror -I drivers/mtd/nand/raw examples/claude-demo/ecc_pack_test.c`로 호스트 바이너리를 빌드해 baseline 통과 + mutant(mask 비트 1개 반전) SIGABRT만 확인하며, 실보드 NAND I/O는 거치지 않음.

실제 1-bit ECC 설정의 교차 컴파일 오브젝트 확인 (`build/da850-1bit-demo/.config`가 사전에 준비되어 `CONFIG_SYS_NAND_HW_ECC=y`인 것을 확인함):
```
make -j4 O=build/da850-1bit-demo CROSS_COMPILE=arm-linux-gnueabi- drivers/mtd/nand/raw/davinci_nand.o
```

## 확인 구분
- 소스 코드로 직접 확인: 위 함수 경계, 비트 마스크 값, include 위치, 4-bit/ready 코드와의 분리, 호스트 유닛테스트 결과.
- 데이터시트/보드 미확인: `nandfecc`/`nandfsr`/`nand4biteccload` 레지스터의 실제 SoC 주소, 비트필드 사양서 절 번호.
- 남은 보드 검증: 실보드에서 NAND read/write 및 오류 주입 테스트, 데이터시트 대조.
