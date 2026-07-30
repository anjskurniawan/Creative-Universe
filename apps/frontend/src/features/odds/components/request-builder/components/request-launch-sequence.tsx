import { MaterialIcon } from "@/components/ui/material-icon";

export function RequestLaunchSequence({
  launchSequence,
  theme,
}: {
  launchSequence: "idle" | "transmitting" | "success";
  theme: "light" | "dark" | "retro";
}) {
  if (launchSequence === "idle") return null;

  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center overflow-hidden rounded-2xl p-6 text-center backdrop-blur-md ${
      theme === "dark" ? "bg-[#111413]/90 text-white" : "bg-white/95 text-slate-900"
    }`}>
      {launchSequence === "transmitting" ? (
        <div className="flex flex-col items-center">
          <MaterialIcon name="satellite_alt" size="lg" className={`animate-pulse ${theme === "dark" ? "text-[#b0ff5e]" : "text-[#00a4ff]"}`} />
          <p className="mt-4 text-xs font-semibold text-slate-400">Mengirim Request Data...</p>
          <h2 className="mt-2 text-xl font-bold">Transmitting Request</h2>
          <p className="mt-4 animate-pulse text-xs text-slate-500">Mohon tidak menutup halaman ini...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <span className={`flex size-20 items-center justify-center rounded-full text-white shadow-lg ${
            theme === "dark" ? "bg-[#b0ff5e]/90 text-[#181818]" : "bg-[#00a4ff]"
          }`}><MaterialIcon name="check" size="lg" className="scale-150" /></span>
          <p className="mt-6 text-xs font-semibold text-slate-400">Pengiriman Selesai</p>
          <h2 className="mt-2 text-2xl font-bold">Request Terdaftar!</h2>
          <p className="mt-4 text-xs text-slate-400">Membuka daftar tugas...</p>
        </div>
      )}
    </div>
  );
}
