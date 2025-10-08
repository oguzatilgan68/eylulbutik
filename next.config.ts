import type { NextConfig } from "next";
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zbqvmfyxhpuihkgvmxhi.supabase.co",
        pathname: "/**",
      },
    ],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
