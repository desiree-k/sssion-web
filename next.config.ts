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
  async headers() {
    return [
      {
        // Serve deep-link verification files as JSON. The AASA file has no
        // extension, so it would otherwise be sent as a generic type.
        source: '/.well-known/:path*',
        headers: [
          { key: 'Content-Type', value: 'application/json' },
        ],
      },
    ];
  },
};

export default nextConfig;
