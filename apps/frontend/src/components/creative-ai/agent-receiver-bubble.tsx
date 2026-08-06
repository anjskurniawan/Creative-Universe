"use client";

import React, { useState, useEffect } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type AgentReceiverBubbleProps = {
  content: string;
  imageUrl?: string;
  timestamp?: string;
  animate?: boolean;
};

function parseInlineCode(text: string, keyPrefix: string): React.ReactNode[] {
  const codeParts = text.split(/(\`.*?\`)/g);
  return codeParts.map((part, cIdx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${keyPrefix}-code-${cIdx}`}
          className="px-1.5 py-0.5 rounded bg-white/10 text-xs font-mono text-orange-400 border border-white/5 mx-0.5"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

function parseInlineMarkdown(text: string): React.ReactNode[] {
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  return boldParts.flatMap((part, bIdx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return parseInlineCode(boldText, `bold-${bIdx}`);
    }
    return parseInlineCode(part, `text-${bIdx}`);
  });
}

export function AgentReceiverBubble({ content, imageUrl, animate = false }: AgentReceiverBubbleProps) {
  const [displayedContent, setDisplayedContent] = useState(animate ? "" : content);
  const isTypingActive = animate && displayedContent.length < content.length;

  useEffect(() => {
    if (!animate) {
      setDisplayedContent(content);
      return;
    }

    setDisplayedContent("");
    let index = 0;
    const interval = setInterval(() => {
      const chunkSize = 3;
      if (index < content.length) {
        setDisplayedContent(content.slice(0, index + chunkSize));
        index += chunkSize;
      } else {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [content, animate]);

  const parts = displayedContent.split("```");

  return (
    <div className="w-full flex flex-col gap-1 py-2">
      <div className="text-sm leading-relaxed text-white/90 space-y-4">
        {imageUrl && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg">
            <img
              src={imageUrl}
              alt="Hasil generate image"
              className="block h-auto max-h-[min(70vh,640px)] w-full object-contain"
            />
          </div>
        )}
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            // Code block
            const lines = part.split("\n");
            const firstLine = lines[0].trim();
            const hasLanguage = /^[a-zA-Z0-9_-]+$/.test(firstLine);
            const language = hasLanguage ? firstLine : "";
            const code = hasLanguage ? lines.slice(1).join("\n") : part;
            return (
              <pre
                key={index}
                className="my-3 p-4 rounded-xl bg-white/5 border border-white/10 overflow-x-auto text-xs font-mono text-white/90"
              >
                {language && (
                  <div className="text-[10px] text-white/40 uppercase mb-2 font-bold select-none">
                    {language}
                  </div>
                )}
                <code className="whitespace-pre">{code.trim()}</code>
              </pre>
            );
          } else {
            // Regular text paragraphs and line parsing
            const lines = part.split("\n");
            return (
              <div key={index} className="space-y-2">
                {lines.map((line, lIdx) => {
                  if (line.startsWith("### ")) {
                    return (
                      <h3 key={lIdx} className="text-base font-bold text-white mt-4 mb-2">
                        {parseInlineMarkdown(line.substring(4))}
                      </h3>
                    );
                  }
                  if (line.startsWith("## ")) {
                    return (
                      <h2 key={lIdx} className="text-lg font-bold text-white mt-5 mb-2">
                        {parseInlineMarkdown(line.substring(3))}
                      </h2>
                    );
                  }
                  if (line.startsWith("# ")) {
                    return (
                      <h1 key={lIdx} className="text-xl font-bold text-white mt-6 mb-3">
                        {parseInlineMarkdown(line.substring(2))}
                      </h1>
                    );
                  }
                  if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
                    const cleanLine = line.trim().substring(2);
                    return (
                      <li key={lIdx} className="ml-4 list-disc text-sm text-white/90 my-1">
                        {parseInlineMarkdown(cleanLine)}
                      </li>
                    );
                  }
                  if (!line.trim()) {
                    return null;
                  }
                  return (
                    <p key={lIdx} className="my-1">
                      {parseInlineMarkdown(line)}
                    </p>
                  );
                })}
              </div>
            );
          }
        })}
      </div>

      {/* Action Buttons */}
      {!isTypingActive && (
        <div
          className="flex items-center gap-1 mt-4 text-white/40"
          style={{
            animation: "fadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          <style>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(6px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
          <button
            type="button"
            aria-label="Copy response"
            className="flex size-8 items-center justify-center rounded-lg hover:bg-white/10 transition-all active:scale-95"
          >
            <MaterialIcon name="content_copy" size="xs" filled={false} />
          </button>
          <button
            type="button"
            aria-label="Rate response"
            className="flex size-8 items-center justify-center rounded-lg hover:bg-white/10 transition-all active:scale-95"
          >
            <MaterialIcon name="thumb_up" size="xs" filled={false} />
          </button>
          <button
            type="button"
            aria-label="Share"
            className="flex size-8 items-center justify-center rounded-lg hover:bg-white/10 transition-all active:scale-95"
          >
            <MaterialIcon name="share" size="xs" filled={false} />
          </button>
          <button
            type="button"
            aria-label="Try again"
            className="flex size-8 items-center justify-center rounded-lg hover:bg-white/10 transition-all active:scale-95"
          >
            <MaterialIcon name="refresh" size="xs" filled={false} />
          </button>
          <button
            type="button"
            aria-label="More action"
            className="flex size-8 items-center justify-center rounded-lg hover:bg-white/10 transition-all active:scale-95"
          >
            <MaterialIcon name="more_horiz" size="xs" filled={false} />
          </button>
        </div>
      )}
    </div>
  );
}
