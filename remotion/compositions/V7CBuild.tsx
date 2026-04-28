import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tokens } from "../tokens";
import { FadeSlide } from "../shared/FadeSlide";
import { DiffBlock, DiffLine } from "../shared/DiffBlock";
import { Terminal } from "../shared/Terminal";

const kconfig: DiffLine[] = [
  { type: "ctx", text: "config NAND_DENALI" },
  { type: "ctx", text: '    bool "Denali NAND controller"' },
  { type: "ctx", text: "    select SYS_NAND_SELF_INIT" },
  { type: "add", text: "" },
  { type: "add", text: "config NAND_DENALI_V2" },
  { type: "add", text: '    bool "Denali V2 (rev 5.x) extension"' },
  { type: "add", text: "    depends on NAND_DENALI" },
  { type: "add", text: "    help" },
  { type: "add", text: "      Adds support for Denali rev 5.x extra registers." },
];

const makefile: DiffLine[] = [
  { type: "ctx", text: "obj-$(CONFIG_NAND_DENALI) += denali.o" },
  { type: "add", text: "obj-$(CONFIG_NAND_DENALI_V2) += denali_v2.o" },
];

const defconfig: DiffLine[] = [
  { type: "ctx", text: "CONFIG_NAND_DENALI=y" },
  { type: "add", text: "CONFIG_NAND_DENALI_V2=y" },
];

export const V7CBuild: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const sceneBuild = interpolate(frame, [60 * fps, 62 * fps], [0, 1], {
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
          데모 C · 빌드 시스템 — 동시에·일관되게
        </h1>
        <p
          style={{
            fontFamily: tokens.fonts.sans,
            fontSize: 22,
            color: tokens.colors.inkSoft,
            marginTop: 4,
          }}
        >
          새 IP rev 추가 시 가장 자주 깜빡하는 3 파일을 한 번에
        </p>
      </FadeSlide>

      {/* 3개 diff 동시 (5~60s) */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 200,
          width: 870,
          opacity: 1 - sceneBuild,
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
          ① drivers/mtd/nand/raw/Kconfig
        </div>
        <DiffBlock
          lines={kconfig}
          startSec={5}
          perLineSec={0.4}
          width={870}
          fontSize={20}
        />
      </div>

      <div
        style={{
          position: "absolute",
          right: 64,
          top: 200,
          width: 870,
          opacity: 1 - sceneBuild,
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
          ② drivers/mtd/nand/raw/Makefile
        </div>
        <DiffBlock
          lines={makefile}
          startSec={20}
          perLineSec={0.6}
          width={870}
          fontSize={22}
        />

        <div
          style={{
            fontFamily: tokens.fonts.mono,
            fontSize: 20,
            color: tokens.colors.accent,
            marginTop: 32,
            marginBottom: 8,
          }}
        >
          ③ configs/sandbox_defconfig
        </div>
        <DiffBlock
          lines={defconfig}
          startSec={32}
          perLineSec={0.8}
          width={870}
          fontSize={22}
        />
      </div>

      {/* Scene Build: 60~90s */}
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 240,
          opacity: sceneBuild,
        }}
      >
        <Terminal width={1792} height={680}>
          <span style={{ color: tokens.colors.accentSoft }}>$ </span>
          <span>make sandbox_defconfig</span>
          {"\n"}
          {frame >= 64 * fps && (
            <>
              <span style={{ color: tokens.colors.inkSoft }}>
                {"  HOSTCC  scripts/basic/fixdep"}
              </span>
              {"\n"}
              <span style={{ color: tokens.colors.inkSoft }}>
                {"  YACC    scripts/kconfig/zconf.tab.c"}
              </span>
              {"\n"}
              <span style={{ color: tokens.colors.ok }}>#</span>
              {"\n"}
              <span style={{ color: tokens.colors.ok }}>
                # configuration written to .config
              </span>
              {"\n"}
            </>
          )}
          {frame >= 67 * fps && (
            <>
              <span style={{ color: tokens.colors.accentSoft }}>$ </span>
              <span>make -j$(nproc)</span>
              {"\n"}
            </>
          )}
          {frame >= 70 * fps && (
            <span style={{ color: tokens.colors.inkSoft }}>
              {"  CC      drivers/mtd/nand/raw/denali.o\n"}
              {"  CC      drivers/mtd/nand/raw/denali_v2.o\n"}
              {"  AR      drivers/mtd/nand/raw/built-in.o\n"}
              {"  ...\n"}
              {"  LD      u-boot\n"}
              {"  OBJCOPY u-boot.bin\n"}
            </span>
          )}
          {frame >= 80 * fps && (
            <span style={{ color: tokens.colors.ok, fontSize: 28 }}>
              {"\n✓ Build PASS — 21.4 MiB / 8.2 sec\n"}
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
          ✓ 디렉토리 흩어진 3 파일 동시 수정 — 가장 자주 깜빡하는 부분
        </p>
      </FadeSlide>
    </AbsoluteFill>
  );
};
