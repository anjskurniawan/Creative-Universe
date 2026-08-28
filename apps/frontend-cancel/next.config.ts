import macros from "unplugin-parcel-macros";
import type { NextConfig } from "next";

// Share one macro instance between the server and client webpack builds.
const plugin = macros.webpack();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack(config) {
    config.plugins.push(plugin);

    // Keep S2 and style-macro CSS together to avoid duplicated atomic CSS
    // across route chunks.
    config.optimization.splitChunks ||= {};
    config.optimization.splitChunks.cacheGroups ||= {};
    config.optimization.splitChunks.cacheGroups.s2 = {
      name: "s2-styles",
      test(module: { type?: string; identifier(): string }) {
        return (
          (module.type === "css/mini-extract" &&
            module.identifier().includes("@react-spectrum/s2")) ||
          /macro-(.*?)\.css/.test(module.identifier())
        );
      },
      chunks: "all",
      enforce: true,
    };

    return config;
  },
};

export default nextConfig;
