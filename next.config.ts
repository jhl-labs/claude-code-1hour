import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remotion 일부 모듈은 서버에서 번들 제외
  serverExternalPackages: ["@remotion/renderer"],
  // 라이브 강의에서 좌측 하단 N 인디케이터를 숨김
  devIndicators: false,
  // 부모 디렉토리의 lockfile로 인한 워크스페이스 루트 추론 워닝 차단
  outputFileTracingRoot: __dirname,
};

export default nextConfig;
