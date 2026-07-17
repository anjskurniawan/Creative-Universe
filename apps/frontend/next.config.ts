import type { NextConfig } from "next";

const apiHost = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://creativeuniverse.test";

const nextConfig: NextConfig = {
  output: "export",
  // Allow a phone connected through this PC's Windows hotspot to use Next dev
  // resources (notably Webpack HMR) without being rejected as cross-origin.
  allowedDevOrigins: ["192.168.137.1"],
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiHost}/api/v1/:path*`,
      },
      {
        source: "/sanctum/csrf-cookie",
        destination: `${apiHost}/sanctum/csrf-cookie`,
      },
      {
        source: "/broadcasting/auth",
        destination: `${apiHost}/broadcasting/auth`,
      },
      {
        source: "/broadcasting/auth/",
        destination: `${apiHost}/broadcasting/auth`,
      },
    ];
  },
};

export default nextConfig;
