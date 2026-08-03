"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { downloadProtectedAttachment, openProtectedAttachment } from "@/core/api/client";
import { BriefPreviewFrame } from "./brief-preview-frame";

type StandardBriefPreviewProps = {
  html: string;
};

export function StandardBriefPreview({ html }: StandardBriefPreviewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasMoreContent, setHasMoreContent] = useState(false);
  const updateScrollHint = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    setHasMoreContent(element.scrollTop + element.clientHeight < element.scrollHeight - 2);
  }, []);

  useEffect(() => {
    updateScrollHint();
  }, [html, updateScrollHint]);

  const displayHtml = html.replace(/<img\b([^>]*\bsrc=["'])(\/api\/v1\/odds\/uploads\/(\d+)\/content)(["'][^>]*)>/gi, (_match, prefix, src, id, suffix) =>
    `<span class="relative inline-block max-w-full align-top"><img${prefix}${src}${suffix}><details class="absolute right-2 top-2 z-20"><summary class="flex size-7 cursor-pointer list-none items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-sm ring-1 ring-slate-200"><span class="material-symbols-rounded text-base">more_vert</span></summary><div class="absolute right-0 top-8 w-28 rounded-lg border border-slate-200 bg-white p-1 text-left text-xs shadow-lg"><button type="button" data-brief-action="open" data-attachment-id="${id}" class="block w-full rounded px-2 py-1.5 text-left hover:bg-slate-50">Open</button><button type="button" data-brief-action="download" data-attachment-id="${id}" class="block w-full rounded px-2 py-1.5 text-left hover:bg-slate-50">Download</button></div></details></span>`
  );

  return (
    <BriefPreviewFrame>
    <div className="relative h-full min-h-0 min-w-0 flex-1">
      <div ref={scrollRef} onScroll={updateScrollHint} onClick={(event) => {
        const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-brief-action]");
        if (!button) return;
        event.preventDefault();
        event.stopPropagation();
        const id = button.dataset.attachmentId;
        if (!id) return;
        const details = button.closest("details");
        if (details) details.open = false;
        if (button.dataset.briefAction === "open") void openProtectedAttachment(id);
        if (button.dataset.briefAction === "download") void downloadProtectedAttachment(id, "referensi-odds");
      }} className="prose absolute inset-0 max-w-none overflow-y-auto pr-2 text-sm leading-relaxed text-slate-800">
        <div
          className="min-h-[160px] pr-1 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_a]:font-bold [&_a]:text-[#00A4FF] [&_a]:underline [&_figure]:my-6 [&_img]:max-h-72 [&_img]:w-auto [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-100 [&_img]:shadow-md [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:text-slate-400"
          dangerouslySetInnerHTML={{ __html: displayHtml || "Tidak ada rincian brief." }}
        />
      </div>
      {hasMoreContent && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white via-white/75 to-transparent" aria-hidden="true" />}
    </div>
    </BriefPreviewFrame>
  );
}
