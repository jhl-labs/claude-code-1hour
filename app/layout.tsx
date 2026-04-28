import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Claude Code 1시간 — 임베디드 엔지니어를 위한 강의",
  description: "메모리 컨트롤러 SW 엔지니어를 위한 60분 강의 교안",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="dark">
      <body>{children}</body>
    </html>
  );
}
