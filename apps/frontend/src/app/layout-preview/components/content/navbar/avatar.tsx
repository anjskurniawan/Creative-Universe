"use client";

import React from "react";

export type AvatarProps = {
  className?: string;
  avatarUrl?: string | null;
  initials?: string;
  state?: "Default" | "Focus";
};

export default function Avatar({
  className = "",
  avatarUrl,
  initials = "AK",
  state = "Default",
}: AvatarProps) {
  const isDefaultAndAvatar = state === "Default" && !!avatarUrl;
  const isDefaultAndNotAvatar = state === "Default" && !avatarUrl;
  const isFocusAndAvatar = state === "Focus" && !!avatarUrl;

  const borderClass = state === "Focus" ? "border border-[rgba(0,0,0,0.3)] border-solid" : "";

  if (avatarUrl) {
    return (
      <div
        className={`overflow-hidden relative rounded-[8px] size-[32px] shrink-0 ${borderClass} ${className}`}
        data-node-id={isDefaultAndAvatar ? "node-28_113" : "node-28_110"}
      >
        <img
          alt="User avatar"
          className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full"
          src={avatarUrl}
        />
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden relative rounded-[8px] size-[32px] shrink-0 bg-[#d9d9d9] flex items-center justify-center ${borderClass} ${className}`}
      data-node-id={isDefaultAndNotAvatar ? "node-28_111" : "node-28_108"}
    >
      <span className="font-sans font-semibold text-[11px] text-[#222] leading-none tracking-normal">
        {initials}
      </span>
    </div>
  );
}
