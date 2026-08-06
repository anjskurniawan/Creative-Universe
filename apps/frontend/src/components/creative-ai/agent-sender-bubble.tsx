"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type AgentSenderBubbleProps = {
  content: string;
  timestamp?: string;
  userName?: string;
};

export function AgentSenderBubble({
  content,
}: AgentSenderBubbleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 400;

  const shouldTruncate = content.length > maxLength;
  const displayText = shouldTruncate && !isExpanded
    ? `${content.slice(0, maxLength)}...`
    : content;

  return (
    <div className="flex flex-col gap-1 max-w-[85%] ml-auto items-end">
      <div className="rounded-2xl px-4 py-2.5 text-sm leading-relaxed bg-[#27272a] text-white/90 rounded-tr-none flex flex-col items-start">
        <span className="whitespace-pre-wrap">{displayText}</span>
        {shouldTruncate && (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="flex items-center gap-0.5 text-xs text-orange-500 hover:text-orange-400 font-semibold focus:outline-none mt-1.5"
          >
            <span>{isExpanded ? "Show less" : "Show more"}</span>
            <MaterialIcon name={isExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"} size="xs" />
          </button>
        )}
      </div>
    </div>
  );
}
