import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://creativeuniverse.test/api/v1/:path*",
      },
      {
        source: "/sanctum/csrf-cookie",
        destination: "http://creativeuniverse.test/sanctum/csrf-cookie",
      },
      {
        source: "/broadcasting/auth",
        destination: "http://creativeuniverse.test/broadcasting/auth",
      },
      {
        source: "/broadcasting/auth/",
        destination: "http://creativeuniverse.test/broadcasting/auth",
      },
    ];
  },
};

export default nextConfig;
