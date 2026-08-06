"use client";

import { useState } from "react";
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";
import { OddsRichTextEditor } from "@/components/odds-rich-text-editor";

export function OddsGameboyFramePreview() {
  return <div className="w-full"><OddsGameboyFrame label="ODDS PREVIEW"><div className="rounded-xl bg-[#24252b] p-6 text-center text-sm text-[#c9ccc0]">Retro task interface</div></OddsGameboyFrame></div>;
}

export function OddsRichTextEditorPreview() {
  const [value, setValue] = useState("<p>Tulis brief desain di sini.</p>");
  return <div className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4"><OddsRichTextEditor value={value} onChange={setValue} /></div>;
}
