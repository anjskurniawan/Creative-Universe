import { MaterialIcon } from "@/components/ui/material-icon";

export function DefaultPreviewPlaceholder({ componentName }: { componentName: string }) {
  return (
    <div className="flex min-h-[250px] w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-100 bg-slate-50 p-6 text-slate-400">
      <MaterialIcon name="visibility" size="md" className="text-slate-300" />
      <span className="text-xs font-medium">[ Area Pratinjau Visual Komponen: {componentName} ]</span>
      <span className="text-[10px] text-slate-400">Pratinjau visual interaktif belum didefinisikan untuk komponen ini.</span>
    </div>
  );
}
