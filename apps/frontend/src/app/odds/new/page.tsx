"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/ui/material-icon";
import { RequestLaunchSequence } from "@/features/odds/components/request-builder/components/request-launch-sequence";
import { useOddsTheme } from "../odds-theme-context";
import {
  OddsRequestBuilder,
  type OddsRequestBuilderDraft,
} from "@/features/odds/components/request-builder";
import { matchesSpecialization, designerSort, recommendDesigner } from "@/features/odds/utils";
import { stripRichText } from "@/components/odds-rich-text-editor";
import { useAuth } from "@/providers/auth-provider";
import { briefWithReferenceAliases, extractOddsBriefReferences } from "@/features/odds/brief-references";
import {
  OddsCategory,
  OddsDesignerProfile,
  createOddsTask,
  createOddsTaskDraft,
  deleteOddsTaskDraft,
  getOddsTaskDraft,
  getOddsCategories,
  getOddsDesignerProfiles,
  getOddsSystemRules,
  getOddsProductCatalog,
  saveOddsProductCategory,
  saveOddsProduct,
  type OddsProductCatalogCategory,
  oddsError,
  type OddsTaskAttachment,
  updateOddsTaskDraft,
  uploadOddsTaskAttachment,
} from "@/features/odds/api";

import { type TaskForm } from "./types";

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

const secondaryButtonClass = "inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border-2 border-[#24252b] bg-[#eceee6] px-4 text-xs font-black uppercase tracking-wide text-[#24252b] shadow-[0_3px_0_#24252b] transition duration-150 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_4px_0_#24252b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ba0dcb] active:translate-y-0.5 active:shadow-[0_1px_0_#24252b]";
const primaryButtonClass = "inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border-2 border-[#24252b] bg-[#ba0dcb] px-5 text-xs font-black uppercase tracking-wide text-white shadow-[0_3px_0_#24252b] transition duration-150 hover:-translate-y-0.5 hover:brightness-90 hover:shadow-[0_4px_0_#24252b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ba0dcb] active:translate-y-0.5 active:shadow-[0_1px_0_#24252b] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-[#a9aca2] disabled:text-[#666961]";
const requestSteps = [
  { label: "Format", detail: "Choose a medium" },
  { label: "Category", detail: "Choose your need" },
  { label: "Talent", detail: "Choose a creative" },
  { label: "Brief", detail: "Describe your idea" },
  { label: "Review", detail: "Ready to launch" },
] as const;

export default function NewOddsTaskPage() {
  const router = useRouter();
  const { user } = useAuth();
  const pageRef = useRef<HTMLDivElement>(null);
  const launchSplashRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<OddsCategory[]>([]);
  const [designerProfiles, setDesignerProfiles] = useState<OddsDesignerProfile[]>([]);
  const [productCatalog, setProductCatalog] = useState<OddsProductCatalogCategory[]>([]);
  const [form, setForm] = useState<TaskForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadedAttachments, setUploadedAttachments] = useState<OddsTaskAttachment[]>([]);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [briefEntryStep, setBriefEntryStep] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [launchSequence, setLaunchSequence] = useState<"idle" | "transmitting" | "success">("idle");
  const [selectedRequestType, setSelectedRequestType] = useState<"design" | null>(null);
  const [todayCapacity, setTodayCapacity] = useState(420);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [draftState, setDraftState] = useState<OddsRequestBuilderDraft | null>(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);

  const playerName = useMemo(() => {
    const firstName = user?.name.trim().split(/\s+/)[0] ?? "";
    return firstName && firstName.length <= 10 ? firstName : user?.username || "Player";
  }, [user?.name, user?.username]);

  useEffect(() => {
    const root = pageRef.current;
    if (!gameStarted || !root) return;

    const media = gsap.matchMedia();
    media.add({
      motionAllowed: "(prefers-reduced-motion: no-preference)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
      mobile: "(max-width: 639px)",
    }, (context) => {
      if (context.conditions?.reduceMotion) {
        gsap.set(".game-stage-content", { autoAlpha: 1 });
        return;
      }

      gsap.timeline({ defaults: { ease: "power2.out" } })
        .fromTo(".game-stage-content", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.12 })
        .fromTo(
          ".game-stage-panel",
          { autoAlpha: 0, y: 18, scale: 0.985 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, stagger: 0.08 },
          "-=0.03",
        );
    }, root);

    return () => media.revert();
  }, [gameStarted]);

  useEffect(() => {
    const splash = launchSplashRef.current;
    if (!splash || launchSequence === "idle") return;

    const context = gsap.context(() => {
      if (launchSequence === "transmitting") {
        gsap.fromTo(splash, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18, ease: "steps(4)" });
        gsap.fromTo(".launch-bit", { scaleY: 0.25, opacity: 0.25 }, { scaleY: 1, opacity: 1, duration: 0.35, stagger: 0.07, repeat: -1, yoyo: true, ease: "steps(3)" });
      } else {
        gsap.fromTo(".launch-success-mark", { scale: 0.5, rotate: -8, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.45, ease: "back.out(2)" });
        gsap.fromTo(".launch-success-copy", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.08, ease: "steps(4)" });
      }
    }, splash);

    return () => context.revert();
  }, [launchSequence]);

  useEffect(() => {
    const load = async () => {
      try {
        const [categoryData, designerData, rulesRes, productCatalogData] = await Promise.all([
          getOddsCategories(),
          getOddsDesignerProfiles(),
          getOddsSystemRules(),
          getOddsProductCatalog(),
        ]);
        const activeDesigners = designerData.filter((profile) => profile.is_active);

        let todayCap = 420;
        const capRule = rulesRes.find((r) => r.key === 'global_daily_capacity');
        const calRule = rulesRes.find((r) => r.key === 'holiday_calendar');
        
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const holidays = (calRule?.value as any)?.dates || [];
        
        if (holidays.includes(dateStr)) {
          todayCap = 0;
        } else if (capRule?.value) {
          const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
          const todayName = days[now.getDay()];
          todayCap = (capRule.value as any)[todayName] ?? 0;
        }

        setTodayCapacity(todayCap);
        setCategories(categoryData);
        setDesignerProfiles(activeDesigners);
        setProductCatalog(productCatalogData);
      } catch (err) {
        setError(oddsError(err));
      } finally {
        setInitializing(false);
      }
    };

    void load();
  }, []);

  const commitProductCategory = async (name: string) => {
    const saved = await saveOddsProductCategory(name);
    const normalized = { ...saved, products: saved.products ?? [] };
    setProductCatalog((current) => current.some((item) => item.id === normalized.id)
      ? current.map((item) => item.id === normalized.id ? { ...item, name: normalized.name } : item)
      : [...current, normalized]);
  };

  const commitProduct = async (category: string, name: string) => {
    await saveOddsProduct(category, name);
    setProductCatalog(await getOddsProductCatalog());
  };

  useEffect(() => {
    const draftParam = new URLSearchParams(window.location.search).get("draft");
    if (!draftParam || !/^\d+$/.test(draftParam)) return;

    const loadDraft = async () => {
      setLoadingDraft(true);
      setError(null);
      try {
        const draft = await getOddsTaskDraft(draftParam);
        const payload = draft.payload as {
          form?: Partial<TaskForm>;
          attachments?: OddsTaskAttachment[];
          wizard?: OddsRequestBuilderDraft;
        };
        const draftForm = payload.form ?? {};
        setDraftId(draft.id);
        setForm({
          ...emptyForm,
          ...Object.fromEntries(
            Object.entries(draftForm).filter(([, value]) => typeof value === "string"),
          ),
        });
        setUploadedAttachments(Array.isArray(payload.attachments) ? payload.attachments : []);
        setDraftState(payload.wizard ?? null);
      } catch (err) {
        setError(oddsError(err));
      } finally {
        setLoadingDraft(false);
      }
    };

    void loadDraft();
  }, []);

  const selectedCategory = useMemo(() => {
    return categories.find((category) => String(category.id) === form.category_id) ?? null;
  }, [categories, form.category_id]);

  const selectableDesigners = useMemo(() => {
    return designerProfiles
      .filter((profile) => matchesSpecialization(profile, form.category_id, selectedCategory?.name))
      .sort((left, right) => designerSort(left, right, todayCapacity));
  }, [designerProfiles, form.category_id, selectedCategory]);

  const recommendedDesigner = useMemo(() => {
    return recommendDesigner(selectableDesigners, selectedCategory);
  }, [selectableDesigners, selectedCategory]);

  const selectedDesigner = useMemo(() => {
    return designerProfiles.find((profile) => String(profile.user_id) === form.preferred_designer_id) ?? null;
  }, [designerProfiles, form.preferred_designer_id]);

  const briefPlainText = stripRichText(form.brief_text);
  const missionBriefText = useMemo(() => briefWithReferenceAliases(form.brief_text) || briefPlainText, [form.brief_text, briefPlainText]);
  const briefReferences = useMemo(() => extractOddsBriefReferences(form.brief_text, uploadedAttachments), [form.brief_text, uploadedAttachments]);
  const canSubmit =
    Boolean(form.category_id)
    && Boolean(form.preferred_designer_id)
    && Boolean(form.design_purpose.trim())
    && Boolean(briefPlainText);
  const canContinueDetails = Boolean(form.design_purpose.trim()) && Boolean(briefPlainText);
  const syncPercent = (
    Number(Boolean(selectedRequestType))
    + Number(Boolean(selectedCategory))
    + Number(Boolean(selectedDesigner))
    + Number(canContinueDetails)
    + Number(currentStep === 5 && canSubmit)
  ) * 20;

  const nextStep = () => setCurrentStep((step) => Math.min(step + 1, 5));
  const previousStep = () => setCurrentStep((step) => Math.max(step - 1, 1));
  const selectDesignRequest = () => {
    setSelectedRequestType("design");
    nextStep();
  };

  const update = useCallback((field: keyof TaskForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const selectCategory = (category: OddsCategory) => {
    setForm((prev) => ({
      ...prev,
      category_id: String(category.id),
      preferred_designer_id: "",
    }));
  };

  const addAttachmentFiles = async (files: FileList | File[] | null) => {
    const nextFiles = Array.from(files ?? []);
    if (nextFiles.length === 0) return [];
    setUploadingAttachments(true);
    setError(null);
    try {
      const uploaded = await Promise.all(nextFiles.slice(0, 8 - uploadedAttachments.length).map(uploadOddsTaskAttachment));
      setUploadedAttachments((current) => [...current, ...uploaded]);
      return uploaded;
    } catch (err) {
      setError(oddsError(err));
      return [];
    } finally {
      setUploadingAttachments(false);
    }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setError(null);
    setLaunchSequence("transmitting");

    try {
      const extractTableBriefValue = (label: string) => {
        const match = form.brief_text.match(new RegExp(`<th>${label}<\\/th><td>([\\s\\S]*?)<\\/td>`, "i"));
        if (!match) return "";
        const element = document.createElement("div");
        element.innerHTML = match[1];
        return element.textContent?.trim() ?? "";
      };
      const tableCategory = extractTableBriefValue("Kategori");
      const tableProduct = extractTableBriefValue("Produk");
      if (tableCategory) await commitProductCategory(tableCategory);
      if (tableCategory && tableProduct) await commitProduct(tableCategory, tableProduct);

      await createOddsTask({
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
      if (draftId) await deleteOddsTaskDraft(draftId);
      setLaunchSequence("success");
      await new Promise((resolve) => window.setTimeout(resolve, 1600));
      router.push("/odds/?section=all_tasks");
    } catch (err) {
      setError(oddsError(err));
      setLaunchSequence("idle");
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = async (wizard: OddsRequestBuilderDraft) => {
    setSavingDraft(true);
    setError(null);
    try {
      const payload = {
        form,
        attachments: uploadedAttachments,
        wizard,
      };
      const draft = draftId
        ? await updateOddsTaskDraft(draftId, payload)
        : await createOddsTaskDraft(payload);
      setDraftId(draft.id);
      setDraftState(wizard);
      router.replace(`/odds/new?draft=${draft.id}`, { scroll: false });
    } catch (err) {
      setError(oddsError(err));
    } finally {
      setSavingDraft(false);
    }
  };

  const { theme } = useOddsTheme();

  return (
    <div ref={pageRef} className="relative min-h-0 w-full flex-1 flex flex-col p-0">
      {launchSequence !== "idle" && <RequestLaunchSequence launchSequence={launchSequence} theme={theme} />}
      <OddsRequestBuilder
        theme={theme}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        form={form}
        update={update}
        categories={categories}
        selectedCategory={selectedCategory ?? undefined}
        selectableDesigners={selectableDesigners}
        todayCapacity={todayCapacity}
        selectedDesigner={selectedDesigner ?? undefined}
        productCatalog={productCatalog}
        onProductCategoryCommit={commitProductCategory}
        onProductCommit={commitProduct}
        recommendedDesignerId={recommendedDesigner ? String(recommendedDesigner.user_id) : null}
        uploadedAttachments={uploadedAttachments}
        uploadingAttachments={uploadingAttachments}
        addAttachmentFiles={addAttachmentFiles}
        onRemoveAttachment={(id) => setUploadedAttachments((items) => items.filter((item) => item.id !== id))}
        loading={loading}
        savingDraft={savingDraft || loadingDraft}
        initialDraftState={draftState}
        onSaveDraft={(wizard) => void saveDraft(wizard)}
        initializing={initializing}
        submit={submit}
      />
    </div>
  );
}



