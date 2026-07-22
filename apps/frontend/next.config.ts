import type { NextConfig } from "next";
import os from "node:os";

const apiHost = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://creativeuniverse.test";

const localDevOrigins = ["192.168.1.41", "192.168.137.1", "localhost", "127.0.0.1"];
try {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        localDevOrigins.push(net.address);
        localDevOrigins.push(`${net.address}:3000`);
      }
    }
  }
} catch {}

const nextConfig: NextConfig = {
  output: "export",
  // Allow phone/devices connected through LAN/Hotspot to use Next dev resources
  allowedDevOrigins: Array.from(new Set(localDevOrigins)),
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
