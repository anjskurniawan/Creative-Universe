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
  type OddsTaskAttachment,
  uploadOddsTaskAttachment,
} from "@/features/odds/api";

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

const secondaryButtonClass = "inline-flex h-10 items-center justify-center rounded-lg border border-cu-border px-4 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft";

export default function NewOddsTaskPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<OddsCategory[]>([]);
  const [designerProfiles, setDesignerProfiles] = useState<OddsDesignerProfile[]>([]);
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedAttachments, setUploadedAttachments] = useState<OddsTaskAttachment[]>([]);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);

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

  const addAttachmentFiles = async (files: FileList | null) => {
    const nextFiles = Array.from(files ?? []);
    if (nextFiles.length === 0) return;
    setUploadingAttachments(true);
    setError(null);
    try {
      const uploaded = await Promise.all(nextFiles.slice(0, 8 - uploadedAttachments.length).map(uploadOddsTaskAttachment));
      setUploadedAttachments((current) => [...current, ...uploaded]);
    } catch (err) {
      setError(oddsError(err));
    } finally {
      setUploadingAttachments(false);
    }
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
        attachment_ids: uploadedAttachments.map((attachment) => attachment.id),
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
      <header className="flex items-start gap-3 border-b border-cu-border pb-5">
        <Link
          href="/odds"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-cu-border text-cu-ink transition hover:bg-cu-panel-soft"
          aria-label="Kembali"
        >
          <MaterialIcon name="arrow_back" size="sm" />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-cu-muted">One Dashboard Design System</p>
          <h1 className="mt-1 text-2xl font-semibold text-cu-ink">Buat Request Desain</h1>
          <p className="mt-1 text-sm text-cu-muted">Lengkapi kebutuhan Anda, lalu kirimkan untuk diproses.</p>
        </div>
      </header>

      {error && (
        <div className="rounded-lg border border-cu-danger/20 bg-cu-danger/10 px-4 py-3 text-sm text-cu-danger">
          {error}
        </div>
      )}

      <main>
        <form onSubmit={submit} className="min-w-0 space-y-6">
          {true && (
            <Panel title="Pilih Kategori" icon="category">
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
            </Panel>
          )}

          {true && (
            <Panel title="Pilih Designer" icon="person_search">
              {recommendedDesigner && (
                <div className="mb-4 rounded-lg border border-cu-info/30 bg-blue-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-cu-info">Rekomendasi</p>
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

            </Panel>
          )}

          {true && (
            <Panel title="Detail Request" icon="edit_note">
              <div className="grid gap-4 md:grid-cols-2">
                <SelectField
                  label="Prioritas"
                  value={form.important_matrix}
                  onChange={(value) => update("important_matrix", value)}
                  options={[
                    ["normal", "Normal"],
                    ["high", "High"],
                    ["urgent", "Urgent"],
                    ["Quadrant 1", "Quadrant 1"],
                    ["Quadrant 2", "Quadrant 2"],
                  ]}
                />
                <InputField
                  label="Deadline"
                  type="date"
                  value={form.deadline}
                  onChange={(value) => update("deadline", value)}
                />
                <InputField
                  label="Judul request"
                  value={form.design_purpose}
                  required
                  placeholder="Banner marketplace promo JETE"
                  onChange={(value) => update("design_purpose", value)}
                  className="md:col-span-2"
                />
                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-cu-ink">Brief Design</span>
                  <OddsRichTextEditor value={form.brief_text} onChange={(value) => update("brief_text", value)} />
                </label>
                <InputField
                  label="Link referensi (opsional)"
                  value={form.reference_visual}
                  placeholder="Link atau arahan visual"
                  onChange={(value) => update("reference_visual", value)}
                  className="md:col-span-2"
                />
                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-cu-ink">Upload file pendukung</span>
                  <div className="rounded-lg border border-dashed border-cu-border bg-cu-panel-soft p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-cu-ink">Lampiran file</p>
                      <span className="relative inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-cu-border bg-white px-4 text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft">
                        <MaterialIcon name="upload_file" size="sm" />
                        Upload
                        <input
                          type="file"
                          multiple
                          onChange={(event) => void addAttachmentFiles(event.target.files)}
                          className="absolute inset-0 cursor-pointer opacity-0"
                        />
                      </span>
                    </div>
                    {uploadedAttachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {uploadedAttachments.map((attachment) => (
                          <span key={attachment.id} className="inline-flex items-center gap-1 rounded-full border border-cu-border bg-white px-2.5 py-1 text-xs text-cu-muted">
                            {attachment.name}
                            <button type="button" onClick={() => setUploadedAttachments((items) => items.filter((item) => item.id !== attachment.id))} aria-label={`Hapus ${attachment.name}`}><MaterialIcon name="close" size="sm" /></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </label>
                <InputField
                  label="Catatan lampiran (opsional)"
                  value={form.attachment_notes}
                  placeholder="Google Drive, Figma, atau file internal"
                  onChange={(value) => update("attachment_notes", value)}
                  className="md:col-span-2"
                />
              </div>

            </Panel>
          )}

          {true && (
            <Panel title="Ringkasan Request" icon="verified">
              <div className="grid gap-3 md:grid-cols-2">
                <ValidationCard
                  ok={Boolean(selectedCategory)}
                  title="Kategori"
                  description={selectedCategory ? selectedCategory.name : "Pilih kategori"}
                />
                <ValidationCard
                  ok={Boolean(form.preferred_designer_id)}
                  title="Designer"
                  description={
                    selectedDesignerName(form.preferred_designer_id, designerProfiles)
                      ?? "Designer belum dipilih."
                  }
                />
                <ValidationCard
                  ok={Boolean(form.deadline || selectedCategory)}
                  title="Deadline"
                  description={form.deadline || (selectedCategory ? `SLA kategori: ${selectedCategory.sla_days} hari` : "Pilih kategori")}
                />
                <ValidationCard
                  ok={Boolean(form.design_purpose.trim())}
                  title="Judul"
                  description={form.design_purpose.trim() || "Masukkan judul request"}
                />
                <ValidationCard
                  ok={Boolean(stripRichText(form.brief_text))}
                  title="Brief"
                  description={stripRichText(form.brief_text) ? "Siap dikirim" : "Lengkapi brief"}
                />
              </div>

              <StepActions>
                <Link href="/odds" className={secondaryButtonClass}>Batal</Link>
                <button
                  type="submit"
                  disabled={loading || initializing || uploadingAttachments || !canSubmit}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-cu-info px-5 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-50"
                >
                  <MaterialIcon name="send" size="sm" />
                  {loading ? "Mengirim..." : "Kirim Request"}
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

function InputField({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
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
    </label>
  );
}
