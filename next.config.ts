import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
    ],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, // This tells Webpack to avoid bundling the 'fs' module on the client side.
      };
    }
    return config;
  },
};

export default nextConfig;
