import type { NextConfig } from "next";
import os from "node:os";
import macros from "unplugin-parcel-macros";

// One shared macro plugin instance is required for both server and client builds.
const spectrumMacros = macros.webpack();

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
  webpack(config) {
    config.plugins.push(spectrumMacros);
    // Macro CSS assets are virtual and held by the plugin instance, so they
    // must be regenerated for every webpack invocation.
    config.cache = false;

    config.optimization.splitChunks ||= {};
    config.optimization.splitChunks.cacheGroups ||= {};
    config.optimization.splitChunks.cacheGroups.s2 = {
      name: "s2-styles",
      test(module: { type?: string; identifier: () => string }) {
        return (
          (module.type === "css/mini-extract" && module.identifier().includes("@react-spectrum/s2")) ||
          /macro-(.*?)\.css/.test(module.identifier())
        );
      },
      chunks: "all",
      enforce: true,
    };

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/storage/:path*",
        destination: `${apiHost}/storage/:path*`,
      },
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
