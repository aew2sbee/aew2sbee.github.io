import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",       // 静的エクスポート
  trailingSlash: true,    // GitHub Pages向けに推奨
  images: {
    unoptimized: true,    // 画像最適化オフ
  },
};

export default nextConfig;
