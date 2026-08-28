import { useCallback, useEffect, useRef, useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import type { TableBriefRow } from "@/features/odds/types";
import { downloadProtectedAttachment, openProtectedAttachment } from "@/core/api/client";
import { BriefPreviewFrame } from "@/features/odds/components/BriefDetails/BriefPreviewFrame/BriefPreviewFrame";

type TableBriefPreviewProps = {
  packagingImageId: number | null;
  packagingImageName: string;
  rows: TableBriefRow[];
  designerName: string;
  deadline: string;
  title: string;
};

const emptyValue = "-";

function ProtectedImage({ attachmentId, alt, className }: { attachmentId: number; alt: string; className?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    let objectUrl = "";
    void fetch(`/api/v1/odds/uploads/${attachmentId}/content`, {
      credentials: "include",
      headers: { Accept: "image/*" },
    }).then((response) => {
      if (!response.ok) throw new Error(`Gagal memuat gambar (${response.status})`);
      return response.blob();
    }).then((blob) => {
      if (!active) return;
      objectUrl = URL.createObjectURL(blob);
      setSrc(objectUrl);
    }).catch(() => setSrc(null));
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [attachmentId]);
  return src ? <img src={src} alt={alt} className={className} /> : <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">Memuat gambar...</div>;
}

function ImageMenu({ attachmentId, filename }: { attachmentId: number; filename: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);
  return <div ref={menuRef} className="absolute right-2 top-2 z-10">
    <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setOpen((value) => !value); }} className="flex size-7 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-white" aria-label="Opsi gambar">
      <MaterialIcon name="more_vert" size="sm" />
    </button>
    {open && <div className="absolute right-0 top-8 w-28 rounded-lg border border-slate-200 bg-white p-1 text-left text-xs shadow-lg">
      <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setOpen(false); void openProtectedAttachment(attachmentId); }} className="block w-full rounded px-2 py-1.5 text-left hover:bg-slate-50">Open</button>
      <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); setOpen(false); void downloadProtectedAttachment(attachmentId, filename || "referensi-odds"); }} className="block w-full rounded px-2 py-1.5 text-left hover:bg-slate-50">Download</button>
    </div>}
  </div>;
}

export function TableBriefPreview({
  packagingImageId,
  packagingImageName,
  rows,
  title,
}: TableBriefPreviewProps) {
  const [collapsedRows, setCollapsedRows] = useState<Record<string, boolean>>(() => Object.fromEntries(rows.map((row) => [row.id, true])));
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasMoreContent, setHasMoreContent] = useState(false);
  const updateScrollHint = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    setHasMoreContent(element.scrollTop + element.clientHeight < element.scrollHeight - 2);
  }, []);

  useEffect(() => {
    updateScrollHint();
  }, [rows, updateScrollHint]);

  return (
    <BriefPreviewFrame>
    <div className="relative h-full min-h-0 min-w-0 flex-1">
      <div ref={scrollRef} onScroll={updateScrollHint} className="absolute inset-0 space-y-5 overflow-y-auto pr-2">
        {packagingImageId && (
          <div className="w-full">
            <h2 className="mb-3 pr-10 text-base font-bold text-[#04044A] sm:text-lg">{title || "Detail Task"}</h2>
            <div className="relative h-40 w-full overflow-hidden rounded-xl border border-[#BDEAFF] bg-white sm:w-64">
              <ProtectedImage attachmentId={packagingImageId} alt={packagingImageName || "Referensi produk"} className="h-full w-full object-contain p-2" />
              <ImageMenu attachmentId={packagingImageId} filename={packagingImageName || "referensi-produk"} />
            </div>
          </div>
        )}

      <div className="space-y-3 sm:hidden">
        {rows.map((row, index) => (
          <section key={row.id} className="rounded-xl border border-slate-200 bg-white p-3">
            <button type="button" onClick={() => setCollapsedRows((current) => ({ ...current, [row.id]: !current[row.id] }))} aria-expanded={!collapsedRows[row.id]} className={`flex w-full items-center justify-between text-left ${collapsedRows[row.id] ? "pb-0" : "mb-3 border-b border-slate-100 pb-2"}`}>
              <span className="text-[11px] font-bold text-slate-700">Detail Deskripsi {index + 1}</span>
              <MaterialIcon name={collapsedRows[row.id] ? "expand_more" : "expand_less"} size="sm" className="text-slate-400" />
            </button>
            {!collapsedRows[row.id] && <div className="space-y-3 text-sm">
              <div>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Deskripsi</span>
                <div className="break-words text-slate-700 [&_p]:mb-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal" dangerouslySetInnerHTML={{ __html: row.image_description || emptyValue }} />
              </div>
              {row.image_illustration_id && <div>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Referensi</span>
                <a href="#" onClick={(event) => { event.preventDefault(); void openProtectedAttachment(row.image_illustration_id as number); }} className="relative block h-32 w-full overflow-hidden rounded-lg border border-[#BDEAFF] bg-white">
                  <ProtectedImage attachmentId={row.image_illustration_id} alt="Ilustrasi gambar" className="h-full w-full object-contain p-2" />
                </a>
              </div>}
              {row.additional_notes?.replace(/<[^>]*>/g, "").trim() && <div>
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Keterangan</span>
                <div className="break-words text-slate-700 [&_p]:mb-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal" dangerouslySetInnerHTML={{ __html: row.additional_notes }} />
              </div>}
            </div>}
          </section>
        ))}
      </div>

        <section className="hidden min-w-0 w-full overflow-hidden rounded-xl border border-slate-200 sm:block">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead className="bg-[#F1F9FF] text-xs font-bold text-[#04044A]">
            <tr>
              <th className="w-[6%] border-b border-r border-[#BDEAFF] px-2 py-3 text-center">No</th>
              <th className="w-[36%] border-b border-r border-[#BDEAFF] px-2 py-3 text-center">Deskripsi</th>
              <th className="w-[29%] border-b border-r border-[#BDEAFF] px-2 py-3 text-center">Referensi</th>
              <th className="w-[29%] border-b border-[#BDEAFF] px-2 py-3 text-center">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className="align-top border-b border-[#BDEAFF]/60 last:border-b-0">
                <td className="border-r border-[#BDEAFF]/60 px-3 py-4 text-center font-semibold text-slate-700">{index + 1}</td>
                <td className="border-r border-[#BDEAFF]/60 px-4 py-4">
                  <div
                    className="break-words text-slate-700 [&_p]:mb-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal"
                    dangerouslySetInnerHTML={{ __html: row.image_description || emptyValue }}
                  />
                </td>
                <td className="border-r border-[#BDEAFF]/60 px-4 py-4 text-center">
                  {row.image_illustration_id ? (
                    <a href="#" onClick={(event) => { event.preventDefault(); void openProtectedAttachment(row.image_illustration_id as number); }} className="group relative block h-40 w-full overflow-hidden rounded-lg border border-[#BDEAFF] bg-white">
                      <ProtectedImage attachmentId={row.image_illustration_id} alt="Ilustrasi gambar" className="h-full w-full object-contain p-2" />
                      <span className="absolute inset-x-0 bottom-0 bg-white/90 py-1 text-center text-[10px] font-semibold text-[#00A4FF] opacity-0 transition group-hover:opacity-100">Buka Gambar</span>
                    </a>
                  ) : (
                    <span className="text-slate-400 font-semibold">{emptyValue}</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div
                    className="break-words text-slate-700 [&_p]:mb-2 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal"
                    dangerouslySetInnerHTML={{ __html: row.additional_notes || emptyValue }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </section>
      </div>
      {hasMoreContent && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white via-white/75 to-transparent" aria-hidden="true" />}
    </div>
    </BriefPreviewFrame>
  );
}
