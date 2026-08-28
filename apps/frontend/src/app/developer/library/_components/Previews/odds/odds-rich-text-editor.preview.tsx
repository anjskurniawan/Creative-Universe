"use client";
import { useState } from "react";
import { OddsRichTextEditor } from "@/features/odds/components/OddsRichTextEditor/OddsRichTextEditor";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";
export function OddsRichTextEditorPreview() { const [value, setValue] = useState("<p>Tulis brief desain di sini.</p>"); return <PreviewWrapper width="full"><div className="w-full rounded-xl border border-slate-100 bg-slate-50 p-4"><OddsRichTextEditor value={value} onChange={setValue} /></div></PreviewWrapper>; }
