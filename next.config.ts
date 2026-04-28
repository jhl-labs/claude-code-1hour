import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Remotion 일부 모듈은 서버에서 번들 제외
    serverComponentsExternalPackages: ["@remotion/renderer"],
  },
};

export default nextConfig;
