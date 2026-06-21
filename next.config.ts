import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 修复 Turbopack 路径警告
  turbopack: {
    root: '.',
  },
};

export default nextConfig;
