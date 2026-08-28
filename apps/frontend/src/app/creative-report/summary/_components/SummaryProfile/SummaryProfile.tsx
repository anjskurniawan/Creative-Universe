export interface SummaryProfileProps {
  user: {
    name: string;
    position?: string | null;
  };
  group: {
    name: string;
  };
  monthLabel: string;
  final: number;
}

export function SummaryProfile({ user, group, monthLabel, final }: SummaryProfileProps) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <section className="cu-style mt-6 grid gap-6 rounded-2xl border border-[#e8edf0] bg-white p-6 shadow-sm lg:grid-cols-[1fr_auto]">
      <div className="flex items-center gap-5">
        {/* Singkatan Nama Berbentuk Lingkaran Avatar */}
        <span className="flex size-24 items-center justify-center rounded-full bg-[#ede9fe] text-3xl font-bold text-[#6d46eb]">
          {initials}
        </span>
        <div>
          <h2 className="text-2xl font-semibold text-[#222]">{user.name}</h2>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[#525e61]">
            <div>
              <dt className="text-xs text-[#7b868a]">Jabatan</dt>
              <dd>{user.position ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-[#7b868a]">Divisi</dt>
              <dd>{group.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-[#7b868a]">Periode</dt>
              <dd>{monthLabel}</dd>
            </div>
          </dl>
        </div>
      </div>
      {/* Nilai Akhir (Final Score) dengan Penilaian Kualitatif */}
      <div className="flex items-center gap-4">
        <div className="flex size-32 flex-col items-center justify-center rounded-full border-8 border-[#6d46eb] text-center">
          <b className="text-4xl text-[#222]">{final}</b>
          <span className="text-sm text-[#7b868a]">/ 100</span>
        </div>
        <span className="rounded-xl bg-[#edf9ee] px-4 py-3 text-sm font-semibold text-[#248235]">
          {final >= 85 ? "Excellent" : final >= 70 ? "Good" : "Needs Review"}
        </span>
      </div>
    </section>
  );
}
