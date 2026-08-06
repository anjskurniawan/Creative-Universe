import { MaterialIcon } from "@/components/ui/material-icon";
import type { ComponentItem } from "./library.data";
import { VisualPreview } from "./visual-preview";

type LibraryPreviewProps = {
  category: string;
  component?: ComponentItem;
};

function EmptyPreview() {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-400 shadow-sm">
      <MaterialIcon name="category" size="md" className="text-slate-300" />
      <span className="text-xs">Silakan pilih komponen di sebelah kiri untuk melihat detail.</span>
    </div>
  );
}

function ComponentHeader({ category, component }: { category: string; component: ComponentItem }) {
  const componentPath = "@/components/" + category + "/" + component.file;
  const importPath = component.file.replace(".tsx", "");

  const copyComponentPath = () => {
    void navigator.clipboard.writeText(componentPath);
    window.dispatchEvent(new CustomEvent("show-toast", {
      detail: { status: "success", message: "Path komponen berhasil disalin ke papan klip!" },
    }));
  };

  return (
    <div className="flex flex-col gap-4 border-b border-slate-50 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-800">{component.name}</h2>
        <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-slate-400">
          <MaterialIcon name="code" size="xs" />
          <span>import &#123; {component.name} &#125; from "@/components/{category}/{importPath}"</span>
        </div>
      </div>
      <button type="button" onClick={copyComponentPath} title="Salin path komponen"
        className="flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
        <MaterialIcon name="content_copy" size="xs" />
        <span>{componentPath}</span>
      </button>
    </div>
  );
}

function ComponentInformation({ component }: { component: ComponentItem }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <h3 className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Deskripsi Fungsi</h3>
        <p className="text-xs leading-relaxed text-slate-600">{component.description}</p>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Design Tags</h3>
        <div className="flex flex-wrap gap-1.5">
          {component.tags?.length ? component.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-[#6d46eb]/10 bg-[#ede9fe]/45 px-2 py-0.5 text-[9px] font-medium text-[#6d46eb]">{tag}</span>
          )) : <span className="text-[10px] italic text-slate-400">Tidak ada tag</span>}
        </div>
      </div>
    </div>
  );
}

export function LibraryPreview({ category, component }: LibraryPreviewProps) {
  if (!component) return <EmptyPreview />;
  return (
    <div className="flex min-h-full flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <ComponentHeader category={category} component={component} />
      <ComponentInformation component={component} />
      <VisualPreview component={component} />
    </div>
  );
}
