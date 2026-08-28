export interface SummaryPillarsProps {
  score30: number;
  score50: number;
  hrdScore: number;
  finalScore: number;
}

export function SummaryPillars({ score30, score50, hrdScore, finalScore }: SummaryPillarsProps) {
  const pillars = [
    ["Collaborative Review", score30, 30, "text-[#6d46eb]"],
    ["Performance Review", score50, 50, "text-[#f18728]"],
    ["HRD Review", hrdScore, 20, "text-[#248235]"],
    ["Final Score", finalScore, 100, "text-[#6d46eb]"],
  ] as const;

  return (
    <section className="cu-style mt-5 grid gap-4 md:grid-cols-4">
      {pillars.map(([label, value, max, color]) => (
        <article
          key={label}
          className={`rounded-2xl border border-[#e8edf0] bg-white p-5 ${color}`}
        >
          <p className="text-sm font-semibold">{label}</p>
          <p className="mt-2 text-3xl font-bold">
            {value} <span className="text-lg">/ {max}</span>
          </p>
          <span
            className="mt-4 block h-1.5 rounded-full bg-current"
            style={{ width: `${(value / max) * 100}%` }}
          />
        </article>
      ))}
    </section>
  );
}
