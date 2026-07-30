import Image from "next/image";
import { MaterialIcon } from "@/components/ui/material-icon";
import type { TableBriefRow } from "./table-brief-details";

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
  designerName,
  deadline,
  title,
}: TableBriefPreviewProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-bold text-[#04044A]">{title || emptyValue}</h3>
      <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-slate-400">Designer</dt>
            <dd className="mt-1 font-semibold text-[#04044A]">{designerName || emptyValue}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-400">Deadline</dt>
            <dd className="mt-1 font-semibold text-[#04044A]">{deadline || emptyValue}</dd>
          </div>
        </dl>
      </section>

      {packagingImageId && (
        <div className="flex">
          <a
            href={`/api/v1/odds/uploads/${packagingImageId}/content`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <MaterialIcon name="visibility" size="sm" />
            Lihat File Packaging ({packagingImageName})
          </a>
        </div>
      )}

      <section className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead className="bg-[#F1F9FF] text-xs font-bold text-[#04044A]">
            <tr>
              <th className="w-20 border-b border-r border-[#BDEAFF] px-3 py-3 text-center">No</th>
              <th className="w-[31%] border-b border-r border-[#BDEAFF] px-3 py-3 text-center">Deskripsi</th>
              <th className="w-[31%] border-b border-r border-[#BDEAFF] px-3 py-3 text-center">Referensi</th>
              <th className="w-[38%] border-b border-[#BDEAFF] px-3 py-3 text-center">Keterangan</th>
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
                    <div className="relative h-40 w-full overflow-hidden rounded-lg border border-[#BDEAFF] bg-white">
                      <Image
                        src={`/api/v1/odds/uploads/${row.image_illustration_id}/content`}
                        alt="Ilustrasi gambar"
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 280px, 31vw"
                        className="object-contain p-2"
                      />
                    </div>
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
