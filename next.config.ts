import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remotion 일부 모듈은 서버에서 번들 제외
  serverExternalPackages: ["@remotion/renderer"],
  // 부모 디렉토리의 lockfile로 인한 워크스페이스 루트 추론 워닝 차단
  outputFileTracingRoot: __dirname,
  // 사내망/외부 IP에서 dev 접속 허용 (라이브 강의 호스트 인터페이스)
  allowedDevOrigins: ["*"],
};

export default nextConfig;
