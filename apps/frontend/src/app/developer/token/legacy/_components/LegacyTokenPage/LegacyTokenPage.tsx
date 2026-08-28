import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";

const colors = [
  { name: "Brand", value: "#ba0dcb", className: "bg-brand" },
  { name: "Info", value: "#2563eb", className: "bg-cu-info" },
  { name: "Success", value: "#16a34a", className: "bg-cu-success" },
  { name: "Warning", value: "#d97706", className: "bg-cu-warning" },
  { name: "Danger", value: "#dc2626", className: "bg-cu-danger" },
  { name: "Ink", value: "#0a0a0a", className: "bg-cu-ink" },
  { name: "Muted", value: "#6b7280", className: "bg-cu-muted" },
  { name: "Line", value: "#e5e7eb", className: "bg-cu-line" },
];

const rules = [
  "Gunakan token semantic seperti bg-brand, text-cu-ink, border-cu-line, dan text-cu-muted.",
  "Gunakan rounded-lg untuk control kecil, rounded-xl/rounded-2xl untuk card dan dialog.",
  "Gunakan shadow-sm untuk card biasa dan shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)] untuk panel melayang.",
  "Utamakan component reusable dari src/components/ui sebelum menulis markup atau styling baru.",
  "Preview Developer Library harus compact, memakai token yang sama, dan tidak membuat token lokal baru tanpa alasan.",
];

function TokenSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <MaterialIcon name={icon} size="sm" className="text-brand" />
        <h2 className="text-sm font-bold text-cu-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function DeveloperTokenPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-5 pb-12 lg:px-8 lg:py-8">
      <header className="mb-6 rounded-2xl border border-brand/10 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
            <MaterialIcon name="palette" size="sm" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-cu-ink">Design Token</h1>
            <p className="mt-1 max-w-3xl text-sm leading-6 text-cu-muted">Pondasi visual CreativeUniverse. Gunakan guide ini sebelum membuat component, halaman, atau preview baru agar seluruh aplikasi tetap konsisten.</p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <TokenSection icon="color_lens" title="Color Tokens">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {colors.map((color) => (
              <div key={color.name} className="overflow-hidden rounded-xl border border-slate-100 bg-white">
                <div className={`h-12 ${color.className}`} />
                <div className="p-2"><p className="text-xs font-semibold text-cu-ink">{color.name}</p><code className="text-[10px] text-cu-muted">{color.value}</code></div>
              </div>
            ))}
          </div>
        </TokenSection>

        <TokenSection icon="rounded_corner" title="Radius & Elevation">
          <div className="space-y-3 text-xs text-cu-muted">
            <div className="flex items-center justify-between rounded-lg border border-cu-line p-3"><span>Control kecil</span><code>rounded-lg · shadow-sm</code></div>
            <div className="flex items-center justify-between rounded-xl border border-cu-line p-3"><span>Card / dialog</span><code>rounded-xl</code></div>
            <div className="flex items-center justify-between rounded-2xl border border-cu-line p-3 shadow-sm"><span>Panel utama</span><code>rounded-2xl · shadow-sm</code></div>
          </div>
        </TokenSection>

        <TokenSection icon="format_size" title="Typography">
          <div className="space-y-3">
            <div><p className="text-2xl font-bold text-cu-ink">Heading / Display</p><code className="text-[10px] text-cu-muted">font-bold · tracking-tight</code></div>
            <div><p className="text-sm font-semibold text-cu-ink">Heading section</p><code className="text-[10px] text-cu-muted">text-sm · font-semibold</code></div>
            <div><p className="text-sm leading-6 text-cu-muted">Body text menggunakan warna muted dan line-height yang nyaman dibaca.</p><code className="text-[10px] text-cu-muted">text-sm · leading-6</code></div>
          </div>
        </TokenSection>

        <TokenSection icon="rule" title="Implementation Rules">
          <ul className="space-y-2 text-xs leading-5 text-cu-muted">
            {rules.map((rule) => <li key={rule} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />{rule}</li>)}
          </ul>
        </TokenSection>
      </div>

      <p className="mt-5 text-center text-[10px] text-cu-muted">Sumber token aktif: <code>apps/frontend/src/app/global.css</code> dan component primitives di <code>src/components/ui</code>.</p>
    </main>
  );
}
