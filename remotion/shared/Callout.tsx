import React from "react";
import { tokens } from "../tokens";

type Props = {
  children: React.ReactNode;
  color?: string;
  width?: number;
};

export const Callout: React.FC<Props> = ({
  children,
  color = tokens.colors.accent,
  width = 1100,
}) => {
  return (
    <div
      style={{
        width,
        padding: "20px 28px",
        background: `${color}1A`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 8,
        fontFamily: tokens.fonts.sans,
        fontSize: 28,
        color: tokens.colors.ink,
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
};
