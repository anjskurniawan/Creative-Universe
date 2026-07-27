"use client";

import React from "react";

export type AppIconProps = {
  className?: string;
  theme?: "Light" | "Dark" | "Retro";
};

const IMG_LIGHT = "/images/icon-app/Logo_White.png";
const IMG_DARK = "/images/icon-app/Logo_White.png";

export default function AppIcon({
  className = "",
  theme = "Light",
}: AppIconProps) {
  const isDark = theme === "Dark";
  const isRetro = theme === "Retro";

  const bgClass = isDark ? "bg-black" : "bg-[#00a4ff]";
  const logoSrc = isDark ? IMG_DARK : IMG_LIGHT;
  const nodeId = isRetro ? "node-28_99" : isDark ? "node-28_92" : "node-28_85";
  const groupNodeId = isRetro ? "node-28_100" : isDark ? "node-28_93" : "node-28_86";

  return (
    <div
      className={`content-stretch flex items-center justify-center p-[4px] relative rounded-[8px] size-[32px] shrink-0 ${bgClass} ${className}`}
      id={nodeId}
      data-node-id={nodeId.replace("node-", "").replace("_", ":")}
    >
      <div
        className="h-[16px] relative shrink-0 w-[14.739px]"
        id={groupNodeId}
        data-node-id={groupNodeId.replace("node-", "").replace("_", ":")}
        data-name="Group"
      >
        <img
          alt="CREA logo"
          className="absolute block inset-0 max-w-none size-full object-contain"
          src={logoSrc}
        />
      </div>
    </div>
  );
}
