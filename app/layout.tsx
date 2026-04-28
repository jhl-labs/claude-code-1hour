import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Claude Code 1시간 — 임베디드 엔지니어를 위한 강의",
  description: "메모리 컨트롤러 SW 엔지니어를 위한 60분 강의 교안",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`dark ${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
