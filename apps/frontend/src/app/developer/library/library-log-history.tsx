"use client";

import { useMemo } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

type LibraryLogHistoryProps = {
  componentName: string;
  version?: string;
  markdown?: string;
};

function parseHistory(markdown: string) {
  return markdown
    .split(/^##\s+/m)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [title, ...details] = entry.split("\n");
      return { title: title.trim(), details: details.join("\n").trim() };
    });
}

export function LibraryLogHistory({ componentName, version = "0.0", markdown }: LibraryLogHistoryProps) {
  const entries = useMemo(() => parseHistory(markdown ?? ""), [markdown]);

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
      <div className="flex items-center gap-2">
        <MaterialIcon name="history" size="sm" className="text-brand" />
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Log History</h3>
          <p className="text-[10px] text-slate-400">Riwayat perubahan {componentName} · versi {version}</p>
        </div>
      </div>
      {entries.length ? (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <article key={entry.title} className="rounded-xl border border-slate-100 bg-white px-3 py-2">
              <h4 className="text-xs font-semibold text-slate-700">{entry.title}</h4>
              {entry.details && <p className="mt-1 whitespace-pre-line text-[10px] leading-relaxed text-slate-500">{entry.details}</p>}
            </article>
          ))}
        </div>
      ) : (
        <p className="text-[10px] italic text-slate-400">Belum ada riwayat perubahan yang tercatat.</p>
      )}
    </section>
  );
}
