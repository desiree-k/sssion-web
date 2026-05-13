import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/polecon',
        destination: '/polecon-planner.html',
      },
    ];
  },
};

export default nextConfig;
