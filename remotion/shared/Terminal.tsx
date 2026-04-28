import React from "react";
import { tokens } from "../tokens";

type Props = {
  width?: number;
  height?: number;
  title?: string;
  children: React.ReactNode;
};

export const Terminal: React.FC<Props> = ({
  width = 1280,
  height = 760,
  title = "claude",
  children,
}) => {
  return (
    <div
      style={{
        width,
        height,
        background: "#101014",
        borderRadius: 12,
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        border: `1px solid ${tokens.colors.panel}`,
        overflow: "hidden",
        fontFamily: tokens.fonts.mono,
        color: tokens.colors.ink,
      }}
    >
      <div
        style={{
          height: 36,
          background: tokens.colors.panel,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 8,
        }}
      >
        <span
          style={{ width: 12, height: 12, borderRadius: 6, background: "#ff5f57" }}
        />
        <span
          style={{ width: 12, height: 12, borderRadius: 6, background: "#febc2e" }}
        />
        <span
          style={{ width: 12, height: 12, borderRadius: 6, background: "#28c840" }}
        />
        <span
          style={{
            marginLeft: 16,
            color: tokens.colors.inkSoft,
            fontSize: 13,
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          padding: 24,
          fontSize: 22,
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
        }}
      >
        {children}
      </div>
    </div>
  );
};
