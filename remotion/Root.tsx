import React from "react";
import { Composition } from "remotion";
import { V9SavingsChart } from "./compositions/V9SavingsChart";

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
        id="V9-savings-chart"
        component={V9SavingsChart}
        durationInFrames={60 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
