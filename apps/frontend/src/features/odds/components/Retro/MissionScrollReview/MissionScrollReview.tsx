"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { OddsCategory, OddsDesignerProfile, OddsTaskAttachment } from "@/features/odds/api";
import { OddsGameboyFrame } from "@/features/odds/components/Retro/OddsGameboyFrame/OddsGameboyFrame";
import { extractOddsBriefReferences } from "@/features/odds/utils/brief-references";


export function MissionScrollReview({
  title,
  requestType,
  category,
  designer,
  priority,
  deadline,
  brief,
  references,
  onEditType,
  onEditCategory,
  onEditDesigner,
  onEditMission,
}: {
  title: string;
  requestType: string;
  category: string;
  designer: string;
  priority: string;
  deadline: string;
  brief: string;
  references: ReturnType<typeof extractOddsBriefReferences>;
  onEditType: () => void;
  onEditCategory: () => void;
  onEditDesigner: () => void;
  onEditMission: () => void;
}) {
  return (
    <article className="w-full bg-transparent p-5 font-mono text-sm leading-7 text-[#24252b] sm:p-8">
      <h2 className="break-words text-xl font-bold uppercase leading-8 sm:text-2xl">{title}</h2>
      <p>==============================</p>
      <br />
      <TextFileLine label="TYPE" value={requestType} onEdit={onEditType} />
      <TextFileLine label="CATEGORY" value={category} onEdit={onEditCategory} />
      <TextFileLine label="DESIGNER" value={designer} onEdit={onEditDesigner} />
      <TextFileLine label="PRIORITY" value={priority} onEdit={onEditMission} />
      <TextFileLine label="DEADLINE" value={deadline} onEdit={onEditMission} />
      <br />
      <div className="-mx-2 flex items-start gap-3 px-2 py-1 transition-colors has-[button:hover]:bg-[#24252b]/[0.07]">
        <p className="min-w-0 flex-1">BRIEF:</p>
        <EditMissionButton onClick={onEditMission} />
      </div>
      <p className="mt-1 whitespace-pre-wrap"><BriefWithReferencePreviews brief={brief} references={references} /></p>
      {references.length > 0 && (
        <>
          <br />
          <p>REFERENCES:</p>
          <div className="flex flex-wrap items-center gap-x-2">
            {references.map((reference, index) => {
              const sameTypeBefore = references.slice(0, index).filter((item) => item.type === reference.type).length;
              const alias = `${reference.type.toUpperCase()}-${sameTypeBefore + 1}`;
              return (
                <span key={`${reference.type}-${reference.type === "image" ? reference.attachmentId : reference.url}-${index}`} className="inline-flex items-center gap-2">
                  {index > 0 && <span>,</span>}
                  <ReferenceAliasPreview alias={alias} reference={reference} />
                </span>
              );
            })}
          </div>
        </>
      )}
    </article>
  );
}


export function BriefWithReferencePreviews({ brief, references }: { brief: string; references: ReturnType<typeof extractOddsBriefReferences> }) {
  return brief.split(/(\[(?:IMAGE|LINK)-\d+\])/gi).map((part, index) => {
    const match = part.match(/^\[(IMAGE|LINK)-(\d+)\]$/i);
    if (!match) return part;

    const type = match[1].toLowerCase() as "image" | "link";
    const typeIndex = Number(match[2]) - 1;
    const reference = references.filter((item) => item.type === type)[typeIndex];
    if (!reference) return part;

    return <ReferenceAliasPreview key={`${part}-${index}`} alias={`${match[1].toUpperCase()}-${match[2]}`} reference={reference} />;
  });
}


export function ReferenceAliasPreview({ alias, reference }: { alias: string; reference: ReturnType<typeof extractOddsBriefReferences>[number] }) {
  const [previewPinned, setPreviewPinned] = useState(false);
  const previewRef = useRef<HTMLButtonElement>(null);
  const labelClass = "mx-0.5 inline-flex border border-[#24252b] bg-[#c9ccc0] px-1.5 py-0.5 align-baseline text-[10px] font-black leading-none text-[#24252b] shadow-[1px_1px_0_#777a72]";

  useEffect(() => {
    if (!previewPinned) return;

    const closeOutside = (event: PointerEvent) => {
      if (!previewRef.current?.contains(event.target as Node)) setPreviewPinned(false);
    };

    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [previewPinned]);

  if (reference.type !== "image") return <span className={labelClass}>{alias}</span>;

  return (
    <button ref={previewRef} type="button" aria-expanded={previewPinned} onClick={() => setPreviewPinned((pinned) => !pinned)} className={`group/reference relative cursor-pointer ${labelClass}`}>
      {alias}
      <span className={`pointer-events-none absolute bottom-[calc(100%+10px)] left-0 z-30 w-56 border-2 border-[#24252b] bg-[#eceee6] p-2 text-[#24252b] shadow-[4px_4px_0_#24252b] ${previewPinned ? "block" : "hidden group-hover/reference:block"}`}>
        <span className="block aspect-video w-full border-2 border-[#24252b] bg-[#c9ccc0] bg-contain bg-center bg-no-repeat [image-rendering:auto]" style={{ backgroundImage: `url("${reference.url}")` }} />
        <span className="mt-2 block truncate text-[9px] font-black uppercase" title={reference.label}>{alias} · {reference.label}</span>
      </span>
    </button>
  );
}


export function TextFileLine({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="-mx-2 grid grid-cols-[88px_8px_minmax(0,1fr)_auto] items-start gap-x-2 px-2 py-1 transition-colors has-[button:hover]:bg-[#24252b]/[0.07] sm:grid-cols-[104px_8px_minmax(0,1fr)_auto]">
      <span>{label}</span>
      <span>:</span>
      <span className="min-w-0 break-words">{value}</span>
      <EditMissionButton onClick={onEdit} />
    </div>
  );
}


export function EditMissionButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-7 shrink-0 items-center gap-1.5 border-2 border-[#24252b] bg-[#eceee6] px-2.5 text-[9px] font-black uppercase text-[#24252b] shadow-[2px_2px_0_#777a72] transition hover:bg-white hover:text-[#ba0dcb] active:translate-y-0.5 active:shadow-none">
      <MaterialIcon name="edit" size="sm" /> Edit
    </button>
  );
}
