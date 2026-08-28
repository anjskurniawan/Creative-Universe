import type { AssessmentHeader } from "../AssessmentTable.types";

export function AssessmentTableHeader({ groupTitles, headers }: { groupTitles: { collab: string; perf: string }; headers: AssessmentHeader[] }) {
  return (
    <thead>
      <tr className="bg-[#f7f5ff] text-xs font-semibold text-[#3b4446]">
        <th rowSpan={2} className="border-b border-r border-[#ded7fb] px-0.5 py-2 text-center text-[10px]">No</th>
        <th rowSpan={2} className="border-b border-r border-[#ded7fb] px-1 py-2 text-center text-[10px]">Nama</th>
        <th colSpan={6} className="border-b border-r border-[#ded7fb] px-2 py-3 text-center">{groupTitles.collab}</th>
        <th colSpan={6} className="border-b border-r border-[#f6c88d] bg-[#fff1df] px-2 py-3 text-center text-[#b65d08]">{groupTitles.perf}</th>
        <th colSpan={5} className="border-b border-r border-[#a9dcb0] bg-[#e8f7ea] px-2 py-3 text-center text-[#248235]">HRD Review (20%)</th>
        <th rowSpan={2} className="border-b border-[#ded7fb] px-0.5 py-2 text-center text-[10px]">Nilai akhir</th>
      </tr>
      <tr className="text-[11px] font-medium">
        {headers.map((aspect, index) => (
          <th key={`${aspect.name}-${index}`} className={`border-b px-0.5 py-1.5 text-center text-[9px] leading-tight break-words ${index < 6 ? "border-[#ece8fb] bg-[#fcfbff] text-[#6d46eb]" : index < 12 ? "border-[#fde2c1] bg-[#fff9f1] text-[#b65d08]" : "border-[#cfead3] bg-[#f4fbf5] text-[#248235]"} ${aspect.name === "Total nilai" ? "border-r font-bold" : ""}`}>
            <span className="block font-medium">{aspect.name}</span>
            {aspect.max !== null && <span className="mt-0.5 block text-[9px] font-semibold opacity-75">({aspect.max})</span>}
          </th>
        ))}
      </tr>
    </thead>
  );
}
