"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/material-icon";
import { OddsRichTextEditor, stripRichText } from "@/components/odds-rich-text-editor";
import {
  OddsCategory,
  OddsDesignerProfile,
  createOddsTask,
  getOddsCategories,
  getOddsDesignerProfiles,
  oddsError,
} from "@/lib/odds";

type RequestStep = "category" | "designer" | "brief" | "validation";

type TaskForm = {
  request_type: "design";
  category_id: string;
  preferred_designer_id: string;
  design_purpose: string;
  brief_text: string;
  reference_visual: string;
  deadline: string;
  important_matrix: string;
  attachment_notes: string;
};

const emptyForm: TaskForm = {
  request_type: "design",
  category_id: "",
  preferred_designer_id: "",
  design_purpose: "",
  brief_text: "",
  reference_visual: "",
  deadline: "",
  important_matrix: "normal",
  attachment_notes: "",
};

const steps: Array<{
  id: RequestStep;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    id: "category",
    label: "Kategori",
    icon: "category",
    description: "Snapshot kategori dan SLA.",
  },
  {
    id: "designer",
    label: "Designer",
    icon: "person_search",
    description: "Rekomendasi dan preferensi.",
  },
  {
    id: "brief",
    label: "Brief",
    icon: "edit_note",
    description: "Detail request dan submit.",
  },
  {
    id: "validation",
    label: "Validasi Submit",
    icon: "verified",
    description: "Recheck sebelum create task.",
  },
];

const primaryButtonClass = "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-cu-info px-4 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50";
const secondaryButtonClass = "inline-flex h-10 items-center justify-center rounded-lg border border-cu-border px-4 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft";

export default function NewOddsTaskPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<OddsCategory[]>([]);
  const [designerProfiles, setDesignerProfiles] = useState<OddsDesignerProfile[]>([]);
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [activeStep, setActiveStep] = useState<RequestStep>("category");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [categoryData, designerData] = await Promise.all([
          getOddsCategories(),
          getOddsDesignerProfiles(),
        ]);
        const activeDesigners = designerData.filter(
          (profile) => profile.is_active && profile.status !== "off"
        );
        const firstCategoryId = categoryData[0] ? String(categoryData[0].id) : "";
        const recommended = recommendDesigner(activeDesigners, categoryData[0]);

        setCategories(categoryData);
        setDesignerProfiles(activeDesigners);
        setForm((prev) => ({
          ...prev,
          category_id: firstCategoryId,
          preferred_designer_id: recommended ? String(recommended.user_id) : "",
        }));
      } catch (err) {
        setError(oddsError(err));
      } finally {
        setInitializing(false);
      }
    };

    void load();
  }, []);

  const selectedCategory = useMemo(() => {
    return categories.find((category) => String(category.id) === form.category_id) ?? null;
  }, [categories, form.category_id]);

  const selectableDesigners = useMemo(() => {
    return designerProfiles
      .filter((profile) => matchesSpecialization(profile, form.category_id))
      .sort((left, right) => designerSort(left, right, selectedCategory));
  }, [designerProfiles, form.category_id, selectedCategory]);

  const recommendedDesigner = useMemo(() => {
    return recommendDesigner(selectableDesigners, selectedCategory);
  }, [selectableDesigners, selectedCategory]);

  const briefPlainText = stripRichText(form.brief_text);
  const canSubmit =
    Boolean(form.category_id)
    && Boolean(form.preferred_designer_id)
    && Boolean(form.design_purpose.trim())
    && Boolean(briefPlainText);

  const update = (field: keyof TaskForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const selectCategory = (category: OddsCategory) => {
    const recommended = recommendDesigner(designerProfiles, category);
    setForm((prev) => ({
      ...prev,
      category_id: String(category.id),
      preferred_designer_id: recommended ? String(recommended.user_id) : "",
    }));
  };

  const useRecommendedDesigner = () => {
    if (!recommendedDesigner) return;
    update("preferred_designer_id", String(recommendedDesigner.user_id));
  };

  const addAttachmentFiles = (files: FileList | null) => {
    const nextFiles = Array.from(files ?? []);
    if (nextFiles.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...nextFiles]);
    const fileNames = nextFiles.map((file) => `- ${file.name}`).join("\n");
    setForm((prev) => ({
      ...prev,
      attachment_notes: `${prev.attachment_notes}${prev.attachment_notes ? "\n" : ""}File terpilih:\n${fileNames}`,
    }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);

    try {
      const task = await createOddsTask({
        request_type: form.request_type,
        category_id: Number(form.category_id),
        preferred_designer_id: Number(form.preferred_designer_id),
        design_purpose: form.design_purpose,
        brief_text: form.brief_text,
        reference_visual: form.reference_visual || undefined,
        deadline: form.deadline || undefined,
        important_matrix: form.important_matrix,
        attachment_notes: form.attachment_notes || undefined,
      });
      router.push(`/odds/detail?id=${task.id}`);
    } catch (err) {
      setError(oddsError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 py-6">
      <header className="flex items-center gap-3 border-b border-cu-border pb-5">
        <Link
          href="/odds"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-cu-border text-cu-ink transition hover:bg-cu-panel-soft"
          aria-label="Kembali"
        >
          <MaterialIcon name="arrow_back" size="sm" />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cu-muted">ODDS</p>
          <h1 className="text-2xl font-semibold text-cu-ink">Tambah Permintaan</h1>
          <p className="mt-1 text-sm text-cu-muted">Alur request client untuk desain.</p>
        </div>
      </header>

      {error && (
        <div className="rounded-lg border border-cu-danger/20 bg-cu-danger/10 px-4 py-3 text-sm text-cu-danger">
          {error}
        </div>
      )}

      <main className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        <aside className="self-start rounded-lg border border-cu-border bg-white p-3 lg:sticky lg:top-24">
          <div className="mb-3 px-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-cu-muted">Request Flow</p>
            <p className="mt-1 text-sm text-cu-muted">Pilih langkah request.</p>
          </div>
          <nav className="space-y-1">
            {steps.map((step) => {
              const complete = isStepComplete(step.id, form);

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition ${
                    activeStep === step.id
                      ? "bg-cu-info text-white"
                      : "text-cu-ink hover:bg-cu-panel-soft"
                  }`}
                >
                  <MaterialIcon name={complete ? "check_circle" : step.icon} size="sm" className="mt-0.5 shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="text-sm font-semibold">{step.label}</span>
                    <span className={`mt-1 block text-xs leading-5 ${
                      activeStep === step.id ? "text-white/80" : "text-cu-muted"
                    }`}>
                      {step.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <form onSubmit={submit} className="min-w-0">
          {activeStep === "category" && (
            <Panel title="Kategori Desain" icon="category">
              <div className="grid gap-3 md:grid-cols-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => selectCategory(category)}
                    className={`rounded-lg border p-4 text-left transition ${
                      form.category_id === String(category.id)
                        ? "border-cu-info bg-blue-50"
                        : "border-cu-border bg-white hover:bg-cu-panel-soft"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-cu-ink">{category.name}</h3>
                      {form.category_id === String(category.id) && (
                        <MaterialIcon name="check_circle" size="sm" className="text-cu-info" />
                      )}
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-cu-muted">
                      <Info label="Bobot" value={category.score_weight} />
                      <Info label="Revisi" value={category.normal_revision_limit} />
                      <Info label="Workload" value={category.workload_point} />
                      <Info label="SLA" value={`${category.sla_days} hari`} />
                    </dl>
                  </button>
                ))}
              </div>
              {categories.length === 0 && (
                <EmptyState text="Belum ada kategori aktif. Root/SPV perlu mengaktifkan kategori lebih dulu." />
              )}
              {selectedCategory && (
                <div className="mt-4 rounded-lg border border-cu-border bg-cu-panel-soft p-4 text-sm text-cu-muted">
                  Snapshot kategori akan dikunci saat submit: bobot, batas revisi, workload point, dan SLA default.
                </div>
              )}
              <StepActions>
                <button
                  type="button"
                  disabled={!form.category_id}
                  onClick={() => setActiveStep("designer")}
                  className={primaryButtonClass}
                >
                  Lanjut
                </button>
              </StepActions>
            </Panel>
          )}

          {activeStep === "designer" && (
            <Panel title="Pilih Designer" icon="person_search">
              {recommendedDesigner && (
                <div className="mb-4 rounded-lg border border-cu-info/30 bg-blue-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-cu-info">Rekomendasi sistem</p>
                      <h3 className="mt-1 font-semibold text-cu-ink">
                        {recommendedDesigner.user?.name ?? `User #${recommendedDesigner.user_id}`}
                      </h3>
                      <p className="mt-1 text-sm text-cu-muted">{designerHint(recommendedDesigner, selectedCategory)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={useRecommendedDesigner}
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-cu-info px-4 text-sm font-semibold text-white"
                    >
                      Gunakan
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                {selectableDesigners.map((profile) => {
                  const selected = form.preferred_designer_id === String(profile.user_id);
                  const capacity = capacityLabel(profile, selectedCategory);

                  return (
                    <button
                      key={profile.id}
                      type="button"
                      onClick={() => update("preferred_designer_id", String(profile.user_id))}
                      className={`rounded-lg border p-4 text-left transition ${
                        selected ? "border-cu-info bg-blue-50" : "border-cu-border bg-white hover:bg-cu-panel-soft"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-cu-ink">{profile.user?.name ?? `User #${profile.user_id}`}</h3>
                          <p className="mt-1 text-xs capitalize text-cu-muted">{profile.status.replace("_", " ")}</p>
                        </div>
                        {selected && <MaterialIcon name="check_circle" size="sm" className="text-cu-info" />}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-cu-muted">
                        <Info label="Capacity" value={profile.daily_capacity_points} />
                        <Info label="Max active" value={profile.max_active_tasks} />
                        <Info label="Priority" value={profile.assignment_priority} />
                        <Info label="Status" value={capacity} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectableDesigners.length === 0 && (
                <EmptyState text="Tidak ada designer aktif yang cocok dengan kategori ini." />
              )}

              <StepActions>
                <button type="button" onClick={() => setActiveStep("category")} className={secondaryButtonClass}>Kembali</button>
                <button
                  type="button"
                  disabled={!form.preferred_designer_id}
                  onClick={() => setActiveStep("brief")}
                  className={primaryButtonClass}
                >
                  Lanjut
                </button>
              </StepActions>
            </Panel>
          )}

          {activeStep === "brief" && (
            <Panel title="Brief Request" icon="edit_note">
              <div className="grid gap-4 md:grid-cols-2">
                <SelectField
                  label="Important Matrix"
                  value={form.important_matrix}
                  onChange={(value) => update("important_matrix", value)}
                  options={[
                    ["normal", "Normal"],
                    ["high", "High"],
                    ["urgent", "Urgent"],
                    ["Quadrant 1", "Quadrant 1"],
                    ["Quadrant 2", "Quadrant 2"],
                  ]}
                  help="Dipakai untuk priority score antrean."
                />
                <InputField
                  label="Deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(value) => update("deadline", value)}
                  help="Kosongkan untuk memakai SLA default kategori."
                />
                <InputField
                  label="Judul task"
                  value={form.design_purpose}
                  required
                  placeholder="Banner marketplace promo JETE"
                  onChange={(value) => update("design_purpose", value)}
                  className="md:col-span-2"
                  help="Nama request yang mudah dikenali oleh SPV dan designer."
                />
                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-cu-ink">Brief Design</span>
                  <OddsRichTextEditor value={form.brief_text} onChange={(value) => update("brief_text", value)} />
                  <FieldHelp>Brief ini akan direview designer. Jika belum lengkap, designer bisa mengembalikannya ke client.</FieldHelp>
                </label>
                <InputField
                  label="Referensi visual"
                  value={form.reference_visual}
                  placeholder="Link atau arahan visual"
                  onChange={(value) => update("reference_visual", value)}
                  className="md:col-span-2"
                  help="Bisa berupa link drive, Figma, marketplace, atau arahan gaya visual."
                />
                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-cu-ink">Upload file pendukung</span>
                  <div className="rounded-lg border border-dashed border-cu-border bg-cu-panel-soft p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-cu-ink">Pilih file referensi</p>
                        <p className="mt-1 text-xs text-cu-muted">File dicatat sebagai attachment note untuk simulasi ODDS saat ini.</p>
                      </div>
                      <span className="relative inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-cu-border bg-white px-4 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft">
                        <MaterialIcon name="upload_file" size="sm" />
                        Upload
                        <input
                          type="file"
                          multiple
                          onChange={(event) => addAttachmentFiles(event.target.files)}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </span>
                    </div>
                    {selectedFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedFiles.map((file, index) => (
                          <span key={`${file.name}-${index}`} className="rounded-full border border-cu-border bg-white px-2.5 py-1 text-xs text-cu-muted">
                            {file.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </label>
                <InputField
                  label="Catatan attachment"
                  value={form.attachment_notes}
                  placeholder="Google Drive, Figma, atau file internal"
                  onChange={(value) => update("attachment_notes", value)}
                  className="md:col-span-2"
                  help="Catatan lokasi file pendukung bila ada."
                />
              </div>

              <div className="mt-5 rounded-lg border border-cu-border bg-cu-panel-soft p-4 text-sm text-cu-muted">
                Setelah brief lengkap, lanjut ke validasi submit. Backend tetap melakukan recheck anti race condition saat tombol kirim ditekan.
              </div>

              <StepActions>
                <button type="button" onClick={() => setActiveStep("designer")} className={secondaryButtonClass}>Kembali</button>
                <button
                  type="button"
                  disabled={!form.design_purpose.trim() || !stripRichText(form.brief_text)}
                  onClick={() => setActiveStep("validation")}
                  className={primaryButtonClass}
                >
                  Lanjut
                </button>
              </StepActions>
            </Panel>
          )}

          {activeStep === "validation" && (
            <Panel title="Validasi Submit" icon="verified">
              <div className="grid gap-3 md:grid-cols-2">
                <ValidationCard
                  ok={Boolean(selectedCategory)}
                  title="Kategori aktif"
                  description={selectedCategory ? `${selectedCategory.name} akan disnapshot saat submit.` : "Kategori belum dipilih."}
                />
                <ValidationCard
                  ok={Boolean(form.preferred_designer_id)}
                  title="Designer valid"
                  description={
                    selectedDesignerName(form.preferred_designer_id, designerProfiles)
                      ?? "Designer belum dipilih."
                  }
                />
                <ValidationCard
                  ok={Boolean(recommendedDesigner || form.preferred_designer_id)}
                  title="Kapasitas awal"
                  description="Backend akan recheck status, spesialisasi, workload, dan capacity sebelum create task."
                />
                <ValidationCard
                  ok={Boolean(form.design_purpose.trim())}
                  title="Judul task"
                  description={form.design_purpose.trim() ? form.design_purpose : "Judul task wajib diisi."}
                />
                <ValidationCard
                  ok={Boolean(stripRichText(form.brief_text))}
                  title="Brief"
                  description={stripRichText(form.brief_text) ? "Brief siap direview designer." : "Brief wajib diisi."}
                />
              </div>

              <div className="mt-5 rounded-lg border border-cu-border bg-cu-panel-soft p-4 text-sm text-cu-muted">
                Jika ada perubahan data setelah halaman ini dibuka, backend akan menolak request dengan pesan validasi yang sesuai.
              </div>

              <StepActions>
                <button type="button" onClick={() => setActiveStep("brief")} className={secondaryButtonClass}>Kembali</button>
                <Link href="/odds" className={secondaryButtonClass}>Batal</Link>
                <button
                  type="submit"
                  disabled={loading || initializing || !canSubmit}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-cu-info px-5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
                >
                  <MaterialIcon name="send" size="sm" />
                  {loading ? "Menyimpan..." : "Kirim"}
                </button>
              </StepActions>
            </Panel>
          )}
        </form>
      </main>
    </div>
  );
}

function matchesSpecialization(profile: OddsDesignerProfile, categoryId: string): boolean {
  if (!categoryId) return true;

  const specializations = profile.specializations ?? [];
  return specializations.length === 0
    || specializations.includes(Number(categoryId))
    || specializations.includes(categoryId);
}

function capacityLabel(profile: OddsDesignerProfile, category: OddsCategory | null): string {
  if (!category) return "Aman";
  if (Number(category.workload_point) > profile.daily_capacity_points) return "Beban penuh";
  if (profile.status === "semi_off") return "Estimasi lebih lama";
  return "Aman";
}

function designerSort(left: OddsDesignerProfile, right: OddsDesignerProfile, category: OddsCategory | null): number {
  const leftFull = capacityLabel(left, category) === "Beban penuh" ? 1 : 0;
  const rightFull = capacityLabel(right, category) === "Beban penuh" ? 1 : 0;
  const leftSemi = left.status === "semi_off" ? 1 : 0;
  const rightSemi = right.status === "semi_off" ? 1 : 0;

  return leftFull - rightFull
    || leftSemi - rightSemi
    || left.assignment_priority - right.assignment_priority
    || right.daily_capacity_points - left.daily_capacity_points;
}

function recommendDesigner(profiles: OddsDesignerProfile[], category: OddsCategory | null | undefined): OddsDesignerProfile | null {
  const matching = profiles
    .filter((profile) => profile.is_active && profile.status !== "off")
    .filter((profile) => matchesSpecialization(profile, category ? String(category.id) : ""))
    .sort((left, right) => designerSort(left, right, category ?? null));

  return matching[0] ?? null;
}

function designerHint(profile: OddsDesignerProfile, category: OddsCategory | null): string {
  const capacity = capacityLabel(profile, category);
  return `Status ${profile.status.replace("_", " ")}, capacity ${profile.daily_capacity_points}, max active ${profile.max_active_tasks}, ${capacity.toLowerCase()}.`;
}

function selectedDesignerName(userId: string, profiles: OddsDesignerProfile[]): string | null {
  const profile = profiles.find((item) => String(item.user_id) === userId);
  return profile?.user?.name ?? (profile ? `User #${profile.user_id}` : null);
}

function isStepComplete(step: RequestStep, form: TaskForm): boolean {
  if (step === "category") return Boolean(form.category_id);
  if (step === "designer") return Boolean(form.preferred_designer_id);
  if (step === "brief") return Boolean(form.design_purpose.trim()) && Boolean(stripRichText(form.brief_text));
  return Boolean(form.category_id)
    && Boolean(form.preferred_designer_id)
    && Boolean(form.design_purpose.trim())
    && Boolean(stripRichText(form.brief_text));
}

function Panel({ title, icon, children }: { title: string; icon: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-cu-border bg-white p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <MaterialIcon name={icon} size="sm" className="text-cu-info" />
        <h2 className="text-lg font-semibold text-cu-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <dt className="text-cu-muted">{label}</dt>
      <dd className="font-semibold text-cu-ink">{value}</dd>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-cu-border bg-cu-panel-soft p-4 text-sm text-cu-muted">
      {text}
    </div>
  );
}

function ValidationCard({ ok, title, description }: { ok: boolean; title: string; description: string }) {
  return (
    <div className={`rounded-lg border p-4 ${
      ok ? "border-cu-success/20 bg-cu-success/10" : "border-cu-danger/20 bg-cu-danger/10"
    }`}>
      <div className="flex items-start gap-2">
        <MaterialIcon name={ok ? "check_circle" : "error"} size="sm" className={ok ? "text-cu-success" : "text-cu-danger"} />
        <div>
          <h3 className="text-sm font-semibold text-cu-ink">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-cu-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}

function StepActions({ children }: { children: ReactNode }) {
  return <div className="mt-6 flex flex-wrap justify-end gap-2">{children}</div>;
}

function FieldHelp({ children }: { children: ReactNode }) {
  return <p className="mt-1 text-xs leading-5 text-cu-muted">{children}</p>;
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  help,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  help?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-cu-ink">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border border-cu-border px-3 text-sm outline-none focus:border-cu-info"
      />
      {help && <FieldHelp>{help}</FieldHelp>}
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  help,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  help?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-cu-ink">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-cu-border bg-white px-3 text-sm outline-none focus:border-cu-info"
      >
        {options.map(([optionValue, labelText]) => (
          <option key={optionValue} value={optionValue}>{labelText}</option>
        ))}
      </select>
      {help && <FieldHelp>{help}</FieldHelp>}
    </label>
  );
}
