import Image from "next/image";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { TableBriefRow } from "./table-brief-details";
import { openProtectedAttachment } from "@/core/api/client";

type TableBriefPreviewProps = {
  packagingImageId: number | null;
  packagingImageName: string;
  rows: TableBriefRow[];
  designerName: string;
  deadline: string;
  title: string;
};

const emptyValue = "-";

export function TableBriefPreview({
  packagingImageId,
  packagingImageName,
  rows,
  title,
}: TableBriefPreviewProps) {
  const [collapsedRows, setCollapsedRows] = useState<Record<string, boolean>>({});

  return (
    <div className="min-w-0 space-y-5">
      {packagingImageId && (
        <div className="flex">
          <a
            href="#"
            onClick={(event) => { event.preventDefault(); void openProtectedAttachment(packagingImageId); }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <MaterialIcon name="visibility" size="sm" />
            Buka Gambar
          </a>
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
                  <Image src={`/api/v1/odds/uploads/${row.image_illustration_id}/content`} alt="Ilustrasi gambar" fill unoptimized sizes="100vw" className="object-contain p-2" />
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
                      <Image src={`/api/v1/odds/uploads/${row.image_illustration_id}/content`} alt="Ilustrasi gambar" fill unoptimized sizes="(max-width: 640px) 280px, 31vw" className="object-contain p-2" />
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
  );
}
