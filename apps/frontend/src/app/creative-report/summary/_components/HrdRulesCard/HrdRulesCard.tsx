export function HrdRulesCard() {
  return (
    <article className="cu-style rounded-2xl border border-[#e8edf0] bg-white p-5">
      <h2 className="font-semibold text-[#6d46eb]">Aturan Pengurangan HRD Review</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 text-center text-xs sm:grid-cols-3">
        <span>
          Cuti
          <br />
          <b>0</b>
        </span>
        <span>
          Izin App
          <br />
          <b>0</b>
        </span>
        <span>
          Bolos 1-2×
          <br />
          <b>-3 / kejadian</b>
        </span>
        <span>
          Bolos &gt;2×
          <br />
          <b>-5 / kejadian</b>
        </span>
        <span>
          Telat 1-2×
          <br />
          <b>-1 / kejadian</b>
        </span>
        <span>
          Telat &gt;2×
          <br />
          <b>-2 / kejadian</b>
        </span>
      </div>
    </article>
  );
}
