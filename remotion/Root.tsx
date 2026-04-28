import React from "react";
import { Composition } from "remotion";
import { V0HeroLoop } from "./compositions/V0HeroLoop";
import { V1Timeline } from "./compositions/V1Timeline";
import { V2CliLoop } from "./compositions/V2CliLoop";
import { V3ClaudeMd } from "./compositions/V3ClaudeMd";
import { V4Tools } from "./compositions/V4Tools";
import { V5Mcp } from "./compositions/V5Mcp";
import { V6SkillsSubagentsHooks } from "./compositions/V6SkillsSubagentsHooks";
import { V8BeforeAfter } from "./compositions/V8BeforeAfter";
import { V9SavingsChart } from "./compositions/V9SavingsChart";
import { V7ALegacyC } from "./compositions/V7ALegacyC";
import { V7CBuild } from "./compositions/V7CBuild";
import { V7EUnitTest } from "./compositions/V7EUnitTest";
import { V7HDocs } from "./compositions/V7HDocs";

const Placeholder: React.FC = () => null;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="placeholder"
        component={Placeholder}
        durationInFrames={30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V0-hero-loop"
        component={V0HeroLoop}
        durationInFrames={15 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V1-timeline"
        component={V1Timeline}
        durationInFrames={90 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V2-cli-loop"
        component={V2CliLoop}
        durationInFrames={60 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V3-claude-md"
        component={V3ClaudeMd}
        durationInFrames={45 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V4-tools"
        component={V4Tools}
        durationInFrames={60 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V5-mcp"
        component={V5Mcp}
        durationInFrames={60 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V6-skills-subagents-hooks"
        component={V6SkillsSubagentsHooks}
        durationInFrames={90 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V8-before-after"
        component={V8BeforeAfter}
        durationInFrames={90 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V9-savings-chart"
        component={V9SavingsChart}
        durationInFrames={60 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V7-A-legacy-c"
        component={V7ALegacyC}
        durationInFrames={90 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V7-C-build"
        component={V7CBuild}
        durationInFrames={90 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V7-E-unit-test"
        component={V7EUnitTest}
        durationInFrames={90 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="V7-H-docs"
        component={V7HDocs}
        durationInFrames={90 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
