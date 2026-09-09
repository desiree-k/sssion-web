import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Founding program is closed and the page is retired. Preserve inbound
        // links (Founding Sprint emails in Loops, the blog CTA) by sending them
        // to open signup instead of 404ing.
        source: '/founding',
        destination: '/signup',
        permanent: true,
      },
    ];
  },
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
