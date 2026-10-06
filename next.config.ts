const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
 
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dqrtrklwnquiurrcqtsv.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
    ],
  },
} as any;

module.exports = withBundleAnalyzer(nextConfig);