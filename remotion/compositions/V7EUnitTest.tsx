import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { Terminal } from "../shared/Terminal";
import { TypeOn } from "../shared/TypeOn";

const testFile = `#include <dm.h>
#include <test/test.h>
#include <test/ut.h>
#include "nand_denali_mock.h"

static int dm_test_nand_denali_cmd(struct unit_test_state *uts)
{
    struct udevice *dev;

    ut_assertok(uclass_get_device(UCLASS_MTD, 0, &dev));
    ut_assertok(denali_nand_cmd(dev, NAND_CMD_READ_PAGE, 0));

    /* 경계: 타임아웃 */
    mock_set_irq_timeout();
    ut_asserteq(-ETIMEDOUT, denali_nand_cmd(dev, NAND_CMD_READ_PAGE, 0));

    /* 경계: ECC 1~3비트 에러 */
    for (int err = 1; err <= 3; err++) {
        mock_inject_ecc_error(err);
        ut_assertok(denali_nand_read_page(dev, page_buf));
    }
    return 0;
}
DM_TEST(dm_test_nand_denali_cmd, UTF_SCAN_FDT);
`;

export const V7EUnitTest: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const sceneRun = interpolate(frame, [55 * fps, 57 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: tokens.colors.bg,
        color: tokens.colors.ink,
        padding: 64,
      }}
    >
      <FadeSlide startSec={0} from="top">
        <h1
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          데모 E · 단위 테스트 — 보드 없이 회귀 검증
        </h1>
        <p
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 22,
            color: tokens.colors.inkSoft,
            marginTop: 4,
          }}
        >
          test/dm/ 패턴 + sandbox · 경계 조건(타임아웃, ECC 1~3비트 에러)까지
        </p>
      </FadeSlide>

      {/* Scene A: 새 테스트 파일 작성 (5~55s) */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 220,
          width: 1792,
          opacity: 1 - sceneRun,
        }}
      >
        <div
          style={{
            fontFamily: tokens.fonts.mono,
            fontSize: 20,
            color: tokens.colors.accent,
            marginBottom: 8,
          }}
        >
          ● Write — test/dm/nand_denali.c (신규)
        </div>
        <div
          style={{
            background: "#101014",
            border: `1px solid ${tokens.colors.ok}55`,
            borderRadius: 12,
            padding: 24,
            fontFamily: tokens.fonts.mono,
            fontSize: 22,
            lineHeight: 1.45,
            color: tokens.colors.ink,
            whiteSpace: "pre-wrap",
          }}
        >
          <TypeOn text={testFile} startSec={5} charsPerSec={50} cursor />
        </div>
      </div>

      {/* Scene B: 실행 + PASS (55~90s) */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 240,
          opacity: sceneRun,
        }}
      >
        <Terminal width={1792} height={680}>
          <span style={{ color: tokens.colors.accentSoft }}>$ </span>
          <span>./test/py/test.py --bd=sandbox -k nand</span>
          {"\n"}
          {frame >= 60 * fps && (
            <span style={{ color: tokens.colors.inkSoft }}>
              {"collected 12 items\n\n"}
            </span>
          )}
          {frame >= 62 * fps && (
            <span style={{ color: tokens.colors.ok }}>
              {"test/dm/nand.py::test_nand_basic                 PASSED [  8%]\n"}
            </span>
          )}
          {frame >= 64 * fps && (
            <span style={{ color: tokens.colors.ok }}>
              {"test/dm/nand.py::test_nand_denali_cmd            PASSED [ 16%]\n"}
            </span>
          )}
          {frame >= 66 * fps && (
            <span style={{ color: tokens.colors.ok }}>
              {"test/dm/nand.py::test_nand_denali_timeout        PASSED [ 25%]\n"}
            </span>
          )}
          {frame >= 68 * fps && (
            <span style={{ color: tokens.colors.ok }}>
              {"test/dm/nand.py::test_nand_denali_ecc_1bit       PASSED [ 33%]\n"}
            </span>
          )}
          {frame >= 70 * fps && (
            <span style={{ color: tokens.colors.ok }}>
              {"test/dm/nand.py::test_nand_denali_ecc_2bit       PASSED [ 41%]\n"}
            </span>
          )}
          {frame >= 72 * fps && (
            <span style={{ color: tokens.colors.ok }}>
              {"test/dm/nand.py::test_nand_denali_ecc_3bit       PASSED [ 50%]\n"}
            </span>
          )}
          {frame >= 74 * fps && (
            <span style={{ color: tokens.colors.ok }}>
              {"test/dm/nand.py::test_nand_denali_invalid_cmd    PASSED [ 58%]\n"}
            </span>
          )}
          {frame >= 76 * fps && (
            <span style={{ color: tokens.colors.ok }}>{"...\n"}</span>
          )}
          {frame >= 80 * fps && (
            <span style={{ color: tokens.colors.ok, fontSize: 28 }}>
              {"\n========== 12 passed in 1.43s ==========\n"}
            </span>
          )}
        </Terminal>
      </div>

      <FadeSlide startSec={86} from="bottom">
        <p
          style={{
            position: "absolute",
            left: 64,
            bottom: 48,
            fontFamily: tokens.fonts.sans,
            fontSize: 26,
            color: tokens.colors.accent,
          }}
        >
          ✓ Mock·픽스처 1분, 경계조건 + ECC 비트 에러까지 — 보드 없이도 안전망
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
