import Image from "next/image";
import { MaterialIcon } from "@/components/material-icon";
import type { TableBriefRow } from "./table-brief-details";

type TableBriefPreviewProps = {
  category: string;
  product: string;
  packagingImageId: number | null;
  packagingImageName: string;
  rows: TableBriefRow[];
};

const emptyValue = "-";

export function TableBriefPreview({
  category,
  product,
  packagingImageId,
  packagingImageName,
  rows,
}: TableBriefPreviewProps) {
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <h2 className="text-sm font-bold text-slate-900">Detail Packaging</h2>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-slate-400">Kategori</dt>
            <dd className="mt-1 font-semibold text-slate-800">{category || emptyValue}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-400">Produk</dt>
            <dd className="mt-1 font-semibold text-slate-800">{product || emptyValue}</dd>
          </div>
          {packagingImageId && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-slate-400">Gambar Packaging</dt>
              <dd className="mt-2 flex items-center gap-3">
                <Image
                  src={`/api/v1/odds/uploads/${packagingImageId}/content`}
                  alt={packagingImageName || "Gambar packaging"}
                  width={72}
                  height={72}
                  unoptimized
                  className="size-[72px] rounded-lg border border-slate-200 object-cover"
                />
                <span className="break-all text-xs text-slate-600">{packagingImageName}</span>
              </dd>
            </div>
          )}
        </dl>
      </section>

      <section className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead className="bg-[#F1F9FF] text-xs font-bold text-[#04044A]">
            <tr>
              <th className="w-20 border-b border-r border-[#BDEAFF] px-3 py-3 text-center">Urutan gambar</th>
              <th className="w-[31%] border-b border-r border-[#BDEAFF] px-3 py-3 text-center">Deskripsi Gambar</th>
              <th className="w-[31%] border-b border-r border-[#BDEAFF] px-3 py-3 text-center">Ilustrasi Gambar</th>
              <th className="w-[38%] border-b border-[#BDEAFF] px-3 py-3 text-center">Keterangan Tambahan</th>
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
                <td className="border-r border-[#BDEAFF]/60 px-4 py-4">
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
                    <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-[#BDEAFF] text-xs text-slate-400">
                      <MaterialIcon name="image" size="sm" className="mr-2" /> Belum ada ilustrasi
                    </div>
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
