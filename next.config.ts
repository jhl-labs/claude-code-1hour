import type { NextConfig } from "next";

// GitHub Pages용 base path. CI에서 NEXT_PUBLIC_BASE_PATH=/claude-code-1hour 으로 주입.
// 로컬 dev 서버는 빈 문자열이라 영향 없음.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // GitHub Pages는 정적 호스팅이므로 next export 결과물(out/) 사용
  output: "export",
  // 정적 호스팅에서는 next/image 최적화 서버가 없음
  images: { unoptimized: true },
  // 디렉토리 인덱스 파일을 사용해 GitHub Pages 라우팅 친화적으로
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  // Remotion 일부 모듈은 서버에서 번들 제외
  serverExternalPackages: ["@remotion/renderer"],
  // 부모 디렉토리의 lockfile로 인한 워크스페이스 루트 추론 워닝 차단
  outputFileTracingRoot: __dirname,
  // 사내망/외부 IP에서 dev 접속 허용 (라이브 강의 호스트 인터페이스)
  allowedDevOrigins: ["*"],
};

export default nextConfig;
