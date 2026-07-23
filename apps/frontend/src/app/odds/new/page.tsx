"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/material-icon";
import { OddsGameboyFrame } from "@/components/odds/odds-gameboy-frame";
import { useOddsTheme } from "../odds-theme-context";
import { ModernWizard } from "@/features/odds/components/modern-wizard";
import { stripRichText } from "@/components/odds-rich-text-editor";
import { useAuth } from "@/providers/auth-provider";
import { briefWithReferenceAliases, extractOddsBriefReferences } from "@/features/odds/brief-references";
import {
  OddsCategory,
  OddsDesignerProfile,
  createOddsTask,
  getOddsCategories,
  getOddsDesignerProfiles,
  getOddsSystemRules,
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
        const [categoryData, designerData, rulesRes] = await Promise.all([
          getOddsCategories(),
          getOddsDesignerProfiles(),
          getOddsSystemRules(),
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

  const update = (field: keyof TaskForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const selectCategory = (category: OddsCategory) => {
    setForm((prev) => ({
      ...prev,
      category_id: String(category.id),
      preferred_designer_id: "",
    }));
  };

  const addAttachmentFiles = async (files: FileList | null) => {
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

  const { theme } = useOddsTheme();

  if (theme !== "retro") {
    return (
      <div ref={pageRef} className="relative min-h-0 w-full flex-1 flex flex-col p-4">
        {launchSequence !== "idle" && (
          <div ref={launchSplashRef} className={`absolute inset-0 z-50 flex items-center justify-center overflow-hidden rounded-2xl p-6 text-center backdrop-blur-md ${
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
        )}
        <ModernWizard
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
          recommendedDesignerId={recommendedDesigner ? String(recommendedDesigner.user_id) : null}
          uploadedAttachments={uploadedAttachments}
          uploadingAttachments={uploadingAttachments}
          addAttachmentFiles={addAttachmentFiles}
          onRemoveAttachment={(id) => setUploadedAttachments((items) => items.filter((item) => item.id !== id))}
          loading={loading}
          initializing={initializing}
          error={error}
          submit={submit}
        />
      </div>
    );
  }

  return (
    <div ref={pageRef} className="relative h-full min-h-0 w-full font-mono text-[#24252b] p-4">
      {launchSequence !== "idle" && (
        <div ref={launchSplashRef} className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden rounded-[30px] border-[3px] border-[#24252b] bg-[#24252b] p-6 text-center text-[#eceee6]">
          <span className="absolute inset-x-0 top-0 h-2 bg-[#ba0dcb]" />
          <span className="pointer-events-none absolute inset-0 opacity-20 [background:repeating-linear-gradient(0deg,transparent_0,transparent_3px,#eceee6_4px)]" />
          {launchSequence === "transmitting" ? (
            <div className="relative z-10 flex flex-col items-center">
              <MaterialIcon name="satellite_alt" size="lg" className="animate-pulse text-[#f2b8f6]" />
              <p className="mt-6 text-[10px] font-black uppercase tracking-[0.28em] text-[#c9ccc0]">Uploading quest data</p>
              <h2 className="mt-3 text-2xl font-black uppercase tracking-[0.08em] sm:text-4xl">Transmitting Request</h2>
              <div className="mt-7 flex h-9 items-end gap-2" aria-hidden="true">
                {Array.from({ length: 8 }, (_, index) => <span key={index} className="launch-bit h-full w-4 border-2 border-[#eceee6] bg-[#ba0dcb]" />)}
              </div>
              <p className="mt-5 animate-pulse text-[9px] font-black uppercase tracking-[0.2em]">Do not close this screen...</p>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center">
              <span className="launch-success-mark flex size-24 items-center justify-center border-[3px] border-[#eceee6] bg-[#ba0dcb] shadow-[6px_6px_0_#eceee6]"><MaterialIcon name="check" size="lg" className="scale-150" /></span>
              <p className="launch-success-copy mt-8 text-[10px] font-black uppercase tracking-[0.28em] text-[#f2b8f6]">Transmission complete</p>
              <h2 className="launch-success-copy mt-3 text-3xl font-black uppercase tracking-[0.08em] sm:text-5xl">Quest Registered</h2>
              <p className="launch-success-copy mt-5 text-[9px] font-black uppercase tracking-[0.18em] text-[#c9ccc0]">Opening all tasks...</p>
            </div>
          )}
        </div>
      )}
      <OddsGameboyFrame
        label={gameStarted ? "Odds Quest Builder" : "Ready Player"}
        action={<Link href="/odds" className="rounded-md border-2 border-[#24252b] bg-[#eceee6] px-3 py-1.5 shadow-[0_2px_0_#24252b] transition active:translate-y-0.5 active:shadow-none">Exit</Link>}
        className="h-full"
      >

        {error && <div className="mb-3 border-2 border-[#24252b] bg-[#f2b8f6] px-3 py-2 text-xs font-black uppercase">Error: {error}</div>}

        {!gameStarted ? (
          <WelcomeScreen
            onStart={() => setGameStarted(true)}
            playerName={playerName}
          />
        ) : (
        <form onSubmit={submit} className="game-stage-content min-h-0 flex-1">
          <div className="grid h-full min-h-0 gap-3 lg:grid-cols-[minmax(0,1fr)_190px]">
            <section className="game-stage-panel retro-scrollbar flex h-full min-w-0 flex-col overflow-y-auto rounded-xl border-[3px] border-[#24252b] bg-[#dfe2d3] p-3 shadow-[inset_0_0_0_3px_#b5b9ad] sm:p-4">
              <div className="mb-3 flex items-center justify-between border-b-2 border-[#24252b] pb-2 text-[10px] font-black uppercase tracking-[0.14em]">
                <span>Stage {String(currentStep).padStart(2, "0")} / {requestSteps[currentStep - 1].label}</span>
                <span>{syncPercent}% Sync</span>
              </div>
          {currentStep === 1 && <RequestTypeSelectStage onContinue={selectDesignRequest} />}

          {currentStep === 2 && (
            <CategoryInventoryStage
              categories={categories}
              selectedCategoryId={form.category_id}
              onSelect={selectCategory}
              onBack={previousStep}
              onContinue={nextStep}
            />
          )}

          {currentStep === 3 && (
            <DesignerCharacterSelectStage
              profiles={selectableDesigners}
              todayCapacity={todayCapacity}
              selectedUserId={form.preferred_designer_id}
              recommendedUserId={recommendedDesigner ? String(recommendedDesigner.user_id) : null}
              onSelect={(profile) => update("preferred_designer_id", String(profile.user_id))}
              onBack={previousStep}
              onContinue={() => { setBriefEntryStep(1); nextStep(); }}
            />
          )}

          {currentStep === 4 && (
            <MissionBriefStage
              initialStep={briefEntryStep}
              form={form}
              briefPlainText={briefPlainText}
              attachments={uploadedAttachments}
              uploading={uploadingAttachments}
              onUpdate={update}
              onUpload={addAttachmentFiles}
              onRemoveAttachment={(id) => setUploadedAttachments((items) => items.filter((item) => item.id !== id))}
              onBack={previousStep}
              onContinue={nextStep}
            />
          )}

          {currentStep === 5 && (
            <Panel step="5" title="Request Terminal" icon="terminal" fill>
              <div>
                <MissionScrollReview
                  title={form.design_purpose || "Untitled Mission"}
                  requestType="Design"
                  category={selectedCategory?.name || "-"}
                  designer={selectedDesignerName(form.preferred_designer_id, designerProfiles) || "-"}
                  priority={form.important_matrix}
                  deadline={form.deadline || "Automatic timing"}
                  brief={missionBriefText || "No mission transmission."}
                  references={briefReferences}
                  onEditType={() => setCurrentStep(1)}
                  onEditCategory={() => setCurrentStep(2)}
                  onEditDesigner={() => setCurrentStep(3)}
                  onEditMission={() => { setBriefEntryStep(4); setCurrentStep(4); }}
                />
              </div>

              <StepActions>
                <button type="button" onClick={() => { setBriefEntryStep(4); setCurrentStep(4); }} className={secondaryButtonClass}>Back</button>
                <button
                  type="submit"
                  disabled={loading || initializing || uploadingAttachments || !canSubmit}
                  className={primaryButtonClass}
                >
                  <MaterialIcon name="send" size="sm" />
                  {loading ? "Sending..." : "Launch Request"}
                </button>
              </StepActions>
            </Panel>
          )}
            </section>

            <aside className="game-stage-panel odds-scroll-hidden hidden h-full min-h-0 flex-col gap-3 overflow-y-auto font-mono lg:flex">
              <RetroHudRoute steps={requestSteps} currentStep={currentStep} syncPercent={syncPercent} onSelect={setCurrentStep} />
              <div className="rounded-lg border-2 border-[#24252b] bg-[#eceee6] p-2 shadow-[inset_0_0_0_2px_#c9ccc0]">
                <p className="mb-2 truncate text-center text-[9px] font-black uppercase tracking-[0.14em]" title={playerName}>{playerName}</p>
                <div className="flex min-h-28 items-center justify-center border-2 border-[#24252b] bg-[#dfe2d3] [image-rendering:pixelated]">
                  {selectedRequestType
                    ? <MaterialIcon name="brush" size="lg" className="scale-[1.8] text-[#ba0dcb]" />
                    : <span className="text-5xl font-black leading-none text-[#24252b]">?</span>}
                </div>
              </div>
              <div className="space-y-1 rounded-lg border-2 border-[#24252b] bg-[#eceee6] p-1.5 shadow-[inset_0_0_0_2px_#c9ccc0]">
                  <LoadoutRow label="Type" value={selectedRequestType ? "Design" : "???"} active={Boolean(selectedRequestType)} onClick={() => setCurrentStep(1)} />
                  <LoadoutRow label="Skill" value={selectedCategory?.name || "???"} active={Boolean(selectedCategory)} disabled={!selectedRequestType} onClick={() => setCurrentStep(2)} />
                  <LoadoutRow label="Talent" value={selectedDesigner?.user?.name || "???"} active={Boolean(selectedDesigner)} disabled={!selectedCategory} onClick={() => setCurrentStep(3)} />
                  <LoadoutRow label="Quest" value={form.design_purpose || "???"} active={Boolean(form.design_purpose)} disabled={!selectedDesigner} onClick={() => setCurrentStep(4)} />
              </div>
            </aside>
          </div>
        </form>
        )}
        <p className="mt-4 text-center text-[9px] font-black uppercase tracking-[0.12em] text-[#555850]">{gameStarted ? "Select request type · Build your request · Press launch" : "Creative Universe · ODDS Edition"}</p>
      </OddsGameboyFrame>
    </div>
  );
}

const PIXEL_MASCOT = [
  "0011100",
  "0111110",
  "1101011",
  "1111111",
  "0111110",
  "0011100",
  "0111110",
  "1100011",
] as const;

function WelcomeScreen({
  onStart,
  playerName,
}: {
  onStart: () => void;
  playerName: string;
}) {
  const welcomeRef = useRef<HTMLDivElement>(null);
  const startTimelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const root = welcomeRef.current;
    if (!root) return;

    const media = gsap.matchMedia();
    media.add({
      motionAllowed: "(prefers-reduced-motion: no-preference)",
      reduceMotion: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      if (context.conditions?.reduceMotion) {
        gsap.set(".boot-screen", { autoAlpha: 0 });
        return;
      }

      const intro = gsap.timeline({ defaults: { duration: 0.45, ease: "power2.out" } });
      intro
        .fromTo(".boot-bar", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.75, ease: "steps(8)" })
        .to(".boot-screen", { autoAlpha: 0, duration: 0.15, ease: "none" }, "+=0.1")
        .from(".welcome-kicker", { autoAlpha: 0, y: -12 })
        .from(".welcome-title", { autoAlpha: 0, scale: 0.75, ease: "back.out(1.8)" }, "-=0.15")
        .from(".welcome-subtitle", { autoAlpha: 0, y: 8 }, "-=0.2")
        .from(".player-stage", { autoAlpha: 0, scale: 0.85, ease: "back.out(1.6)" }, "-=0.1")
        .from(".pixel-cell-active", { scale: 0, stagger: { amount: 0.35, from: "random" }, ease: "back.out(2)" }, "-=0.2")
        .fromTo(
          ".start-button",
          { autoAlpha: 0, y: 14, scale: 0.86 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.38,
            ease: "back.out(1.9)",
            clearProps: "transform,opacity,visibility",
          },
          "+=0.08",
        )
        .fromTo(
          ".press-start",
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, duration: 0.22, ease: "steps(3)" },
          "+=0.06",
        );

      const spriteTravel = context.conditions?.mobile ? 24 : 42;
      const spriteJump = context.conditions?.mobile ? -9 : -14;

      gsap.timeline({ repeat: -1, repeatDelay: 0.25 })
        .set(".sprite-unit", { x: -spriteTravel, scaleX: 1 })
        .to(".sprite-unit", { x: spriteTravel, duration: 1.45, ease: "steps(8)" })
        .set(".sprite-unit", { scaleX: -1 })
        .to(".sprite-unit", { x: -spriteTravel, duration: 1.45, ease: "steps(8)" })
        .set(".sprite-unit", { scaleX: 1 });
      gsap.to(".player-sprite", { y: spriteJump, duration: 0.32, repeat: -1, repeatDelay: 0.55, yoyo: true, ease: "steps(3)" });
      gsap.to(".sprite-shadow", { scaleX: 0.68, autoAlpha: 0.38, duration: 0.32, repeat: -1, yoyo: true, ease: "steps(1)" });
      gsap.fromTo(".sprite-fx", { y: 8, autoAlpha: 0 }, { y: -26, autoAlpha: 1, duration: 1.1, repeat: -1, stagger: { each: 0.24, from: "random" }, ease: "steps(4)" });
      gsap.to(".scanline", { yPercent: 900, duration: 3.2, repeat: -1, ease: "none" });
      gsap.to(".spark-pixel", { y: -9, duration: 0.7, repeat: -1, yoyo: true, stagger: { each: 0.11, from: "random" }, ease: "power1.inOut" });
      gsap.to(".press-start", { autoAlpha: 0.2, duration: 0.65, delay: intro.duration() + 0.1, repeat: -1, yoyo: true, ease: "none" });
    }, root);

    return () => {
      startTimelineRef.current?.kill();
      media.revert();
    };
  }, []);

  const handleStart = () => {
    if (starting) return;

    const root = welcomeRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onStart();
      return;
    }

    setStarting(true);
    const select = gsap.utils.selector(root);
    startTimelineRef.current?.kill();
    startTimelineRef.current = gsap.timeline({ defaults: { ease: "power2.inOut" } })
      .to(select(".start-button"), {
        y: 4,
        scale: 0.94,
        boxShadow: "0 1px 0 #24252b",
        duration: 0.1,
        ease: "steps(2)",
      })
      .to(select(".start-button"), {
        y: 0,
        scale: 1,
        boxShadow: "0 5px 0 #24252b",
        duration: 0.1,
        ease: "steps(2)",
      })
      .set(select(".stage-transition"), { autoAlpha: 1 })
      .to(select(".welcome-content"), { autoAlpha: 0.18, scale: 0.97, duration: 0.24 }, "<")
      .fromTo(
        select(".stage-transition-bar"),
        {
          scaleY: 0,
          transformOrigin: (index) => index % 2 === 0 ? "top center" : "bottom center",
        },
        { scaleY: 1, duration: 0.22, stagger: 0.035, ease: "steps(4)" },
        "<",
      )
      .fromTo(
        select(".stage-transition-copy"),
        { autoAlpha: 0, scale: 0.78 },
        { autoAlpha: 1, scale: 1, duration: 0.28, ease: "steps(4)" },
        ">-0.04",
      )
      .to(select(".stage-transition-copy"), {
        autoAlpha: 0.35,
        duration: 0.12,
        repeat: 3,
        yoyo: true,
        ease: "steps(1)",
      })
      .call(onStart, [], "+=0.18");
  };

  return (
    <div ref={welcomeRef} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-xl border-[3px] border-[#24252b] bg-[#dfe2d3] p-5 shadow-[inset_0_0_0_3px_#b5b9ad]">
      <div className="boot-screen absolute inset-0 z-30 flex items-center justify-center bg-[#24252b] p-8 text-[#dfe2d3]">
        <div className="w-full max-w-xs text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em]">Loading ODDS Quest</p>
          <div className="mt-4 border-2 border-[#dfe2d3] p-1"><div className="boot-bar h-3 bg-[#ba0dcb]" /></div>
          <p className="mt-3 text-[9px] font-black uppercase tracking-[0.16em] text-[#c9ccc0]">Initializing player...</p>
        </div>
      </div>
      <div className="stage-transition pointer-events-none invisible absolute inset-0 z-40 opacity-0" aria-hidden="true">
        <div className="absolute inset-0 flex">
          {Array.from({ length: 10 }, (_, index) => (
            <span key={index} className="stage-transition-bar h-full flex-1 bg-[#24252b]" />
          ))}
        </div>
        <div className="stage-transition-copy invisible absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-[#dfe2d3] opacity-0">
          <span className="mb-4 grid grid-cols-3 gap-1" aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => (
              <span key={index} className={`size-2 ${index % 2 === 0 ? "bg-[#ba0dcb]" : "bg-[#dfe2d3]"}`} />
            ))}
          </span>
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#c9ccc0]">Entering</p>
          <p className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-[#ba0dcb] sm:text-5xl">Stage 01</p>
          <p className="mt-3 border-y-2 border-[#dfe2d3] px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em]">Request Builder</p>
        </div>
      </div>
      <div className="scanline pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-[#24252b]/20" />
      <span className="spark-pixel absolute left-[8%] top-[18%] size-2 bg-[#ba0dcb]" />
      <span className="spark-pixel absolute right-[9%] top-[25%] size-1.5 bg-[#24252b]" />
      <span className="spark-pixel absolute bottom-[18%] left-[14%] size-1.5 bg-[#24252b]" />
      <span className="spark-pixel absolute bottom-[23%] right-[16%] size-2 bg-[#ba0dcb]" />
      <div className="welcome-content relative z-10 flex h-full w-full max-w-3xl flex-col items-center justify-between text-center sm:block sm:h-auto">
        <div className="shrink-0">
        <p className="welcome-kicker text-[10px] font-black uppercase tracking-[0.24em]">Creative Universe Presents</p>
        <h1 className="welcome-title mt-3 text-3xl font-black uppercase leading-none tracking-[-0.06em] sm:text-5xl">Odds Quest</h1>
        <p className="welcome-subtitle mt-2 text-xs font-black uppercase tracking-[0.18em]">Build Your Creative Request</p>
        </div>

        <div className="flex min-h-0 w-full flex-1 items-center justify-center py-3 sm:my-6 sm:block sm:py-0">
          <div className="player-stage mx-auto flex aspect-square w-full max-w-[210px] flex-col items-center justify-start overflow-hidden border-[3px] border-[#24252b] bg-[#eceee6] p-3 shadow-[4px_4px_0_#24252b] sm:aspect-auto sm:min-h-52 sm:max-w-[240px] sm:justify-center sm:p-4 sm:shadow-[5px_5px_0_#24252b]">
            <div className="relative flex min-h-0 w-full flex-1 items-center justify-center border-b-2 border-[#24252b] bg-[#dfe2d3] px-3 sm:h-44 sm:flex-none sm:items-end sm:pb-4 sm:pt-8">
              <span className="sprite-fx absolute left-[18%] top-[62%] size-2 bg-[#ba0dcb]" />
              <span className="sprite-fx absolute right-[20%] top-[55%] size-1.5 bg-[#24252b]" />
              <span className="sprite-fx absolute left-[28%] top-[42%] size-1 bg-[#24252b]" />
              <span className="sprite-fx absolute right-[28%] top-[38%] size-2 bg-[#ba0dcb]" />
              <div className="sprite-unit relative flex items-end justify-center pb-2 sm:pb-3">
                <span className="sprite-shadow absolute bottom-0 h-1.5 w-12 bg-[#24252b]/45 sm:bottom-1 sm:h-2 sm:w-20" />
                <div className="player-sprite relative z-10 grid grid-cols-7 gap-0 [image-rendering:pixelated]" aria-label="ODDS pixel character" role="img">
                  {PIXEL_MASCOT.flatMap((row, rowIndex) => row.split("").map((pixel, columnIndex) => (
                    <span
                      key={`${rowIndex}-${columnIndex}`}
                      className={`size-[9px] sm:size-3.5 ${pixel === "1" ? `pixel-cell-active ${rowIndex < 2 ? "bg-[#ba0dcb]" : "bg-[#24252b]"}` : "bg-transparent"}`}
                    />
                  )))}
                </div>
              </div>
            </div>
            <span className="mt-3 max-w-full truncate border-2 border-[#24252b] bg-[#c9ccc0] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] sm:mt-4">{playerName}</span>
          </div>
        </div>

        <div className="shrink-0">
        <button type="button" onClick={handleStart} disabled={starting} aria-busy={starting} className="start-button group inline-flex min-w-48 cursor-pointer items-center justify-center gap-2 rounded-lg border-[3px] border-[#24252b] bg-[#ba0dcb] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white shadow-[0_5px_0_#24252b] transition-[transform,box-shadow,background-color] duration-150 ease-out hover:-translate-y-1 hover:bg-[#a80cba] hover:shadow-[0_7px_0_#24252b] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ba0dcb]/40 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:cursor-wait">
          <span className="text-base transition-transform duration-150 group-hover:translate-x-1 group-hover:scale-125">▶</span>
          {starting ? "Loading Stage" : "Start Game"}
        </button>
        <p className="press-start mt-4 text-[9px] font-black uppercase tracking-[0.18em] text-[#555850]">Press start to continue</p>
        </div>
      </div>
    </div>
  );
}

function RequestTypeSelectStage({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="class-select-stage relative flex h-auto max-w-4xl w-full mx-auto my-auto flex-col overflow-hidden border-2 border-[#24252b] bg-[#c9ccc0] p-2 shadow-[inset_0_0_0_2px_#eceee6] sm:p-3 rounded-lg">
      <span className="pointer-events-none absolute -left-8 -top-8 size-20 rotate-45 border-[12px] border-[#ba0dcb] opacity-40" />
      <span className="pointer-events-none absolute -bottom-10 -right-10 size-28 rotate-45 border-[14px] border-[#24252b] opacity-10" />

      <header className="relative flex shrink-0 flex-col items-center justify-center gap-1 border-b-2 border-[#24252b] bg-[#24252b] px-3 py-2 text-center text-[#dfe2d3] sm:px-4 sm:py-3 rounded-t">
        <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#f2b8f6]">Request Type Select</p>
        <h2 className="text-sm font-black uppercase tracking-[0.04em] text-[#dfe2d3] sm:text-2xl sm:tracking-[0.06em]">Mau buat project apa hari ini ?</h2>
      </header>

      <div className="retro-scrollbar relative mt-2 flex flex-col items-center justify-center gap-4 p-1 sm:mt-3 sm:gap-6 md:flex-row md:overflow-visible">
        <div className="group relative flex w-full max-w-sm flex-col overflow-hidden border-[3px] border-[#24252b] bg-[#dfe2d3] text-left shadow-[5px_5px_0_#24252b] transition-transform duration-150 hover:-translate-y-1" role="option" aria-selected="true">
          <div className="flex items-center justify-between border-b-2 border-[#24252b] bg-[#ba0dcb] px-3 py-2 text-white">
            <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em]"><span className="animate-pulse">▶</span> Option 01</span>
            <span className="border border-white/70 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em]">Available</span>
          </div>

          <div
            className="relative flex min-h-0 items-center justify-center overflow-hidden border-b-2 border-[#24252b] py-8 sm:min-h-48"
            style={{
              backgroundImage: "linear-gradient(rgba(36,37,43,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(36,37,43,0.08) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          >
            <span className="absolute left-3 top-3 border-2 border-[#24252b] bg-[#eceee6] px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em]">Type 01</span>
            <span className="absolute right-3 top-3 text-[8px] font-black uppercase tracking-[0.14em]">Ready</span>
            <RetroRequestTypeIcon icon="brush" label="Design brush icon" />
          </div>

          <div className="flex shrink-0 items-end justify-between gap-2 bg-[#eceee6] p-2 sm:gap-3 sm:p-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#6b6e67]">Request Type</p>
              <h3 className="mt-0.5 text-lg font-black uppercase tracking-[-0.04em] sm:mt-1 sm:text-2xl">Design</h3>
              <p className="hidden text-[9px] font-black uppercase tracking-[0.1em] text-[#555850] sm:mt-1 sm:block">Static Visual Asset</p>
            </div>
            <button type="button" onClick={onContinue} className="group/select flex min-h-10 min-w-28 cursor-pointer items-center justify-between gap-3 border-2 border-[#24252b] bg-[#ba0dcb] px-3 py-2 text-[9px] font-black uppercase tracking-[0.14em] text-white shadow-[0_3px_0_#24252b] transition-[transform,background-color,box-shadow] duration-150 hover:-translate-y-0.5 hover:bg-[#a80cba] hover:shadow-[0_4px_0_#24252b] active:translate-y-0.5 active:shadow-none">
              Select <span className="transition-transform group-hover/select:translate-x-1">▶</span>
            </button>
          </div>
        </div>

        <div className="relative flex w-full max-w-sm cursor-not-allowed flex-col overflow-hidden border-[3px] border-[#24252b] bg-[#aeb1a7] text-left text-[#555850] shadow-[3px_3px_0_#24252b]" aria-label="Video type locked" aria-disabled="true">
          <span className="absolute inset-0 z-10 opacity-15" style={{ backgroundImage: "repeating-linear-gradient(135deg, #24252b 0 2px, transparent 2px 10px)" }} />
          <div className="relative z-20 flex items-center justify-between border-b-2 border-[#24252b] bg-[#8f938a] px-3 py-2">
            <span className="text-[9px] font-black uppercase tracking-[0.16em]">Option 02</span>
            <span className="border border-[#24252b] bg-[#d4d7cc] px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.14em]">Locked</span>
          </div>
          <div className="relative flex min-h-0 items-center justify-center overflow-hidden border-b-2 border-[#24252b] py-8 sm:min-h-48">
            <span className="absolute left-3 top-3 border-2 border-[#24252b] bg-[#d4d7cc] px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em]">Type 02</span>
            <RetroRequestTypeIcon icon="videocam" label="Video camera icon" muted />
            <span className="absolute bottom-4 right-4 z-20 border-2 border-[#24252b] bg-[#24252b] px-3 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-[#dfe2d3]">Future Update</span>
          </div>
          <div className="relative z-20 flex shrink-0 items-end justify-between gap-2 bg-[#b9bdb1] p-2 sm:gap-3 sm:p-4">
            <span>
              <span className="block text-[9px] font-black uppercase tracking-[0.18em] text-[#6b6e67]">Request Type</span>
              <span className="mt-0.5 block text-lg font-black uppercase tracking-[-0.04em] sm:mt-1 sm:text-2xl">Video</span>
              <span className="mt-1 hidden text-[9px] font-black uppercase tracking-[0.1em] sm:block">Motion Visual Asset</span>
            </span>
            <button type="button" disabled className="min-h-10 min-w-28 cursor-not-allowed border-2 border-[#24252b] bg-[#d4d7cc] px-3 py-2 text-[8px] font-black uppercase tracking-[0.14em] text-[#777a72]">Locked</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function RetroRequestTypeIcon({ icon, label, muted = false }: { icon: "brush" | "videocam"; label: string; muted?: boolean }) {
  return (
    <span className={`relative z-20 flex size-20 items-center justify-center border-[3px] border-[#24252b] bg-[#eceee6] shadow-[4px_4px_0_#24252b] transition-transform duration-150 group-hover:-translate-y-2 group-hover:rotate-[-2deg] sm:size-32 sm:border-[4px] sm:shadow-[7px_7px_0_#24252b] ${muted ? "opacity-60 grayscale" : ""}`} aria-label={label} role="img">
      <span className="absolute inset-1 border-2 border-[#24252b]/20" />
      <MaterialIcon name={icon} size="lg" className={`scale-[1.8] sm:scale-[2.6] ${muted ? "text-[#666961]" : "text-[#ba0dcb]"}`} />
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[#24252b]/20" />
    </span>
  );
}

function CategoryInventoryStage({
  categories,
  selectedCategoryId,
  onSelect,
  onBack,
  onContinue,
}: {
  categories: OddsCategory[];
  selectedCategoryId: string;
  onSelect: (category: OddsCategory) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const selectedCategory = categories.find((category) => String(category.id) === selectedCategoryId) ?? null;
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const categoryDragRef = useRef({ pointerId: -1, startY: 0, scrollTop: 0, moved: false });
  const [categoryScrollbar, setCategoryScrollbar] = useState({ visible: false, top: 0, height: 48 });

  const syncCategoryScrollbar = () => {
    const element = categoryScrollRef.current;
    if (!element) return;

    const scrollRange = element.scrollHeight - element.clientHeight;
    const height = Math.max(48, element.clientHeight * (element.clientHeight / element.scrollHeight));
    const top = scrollRange > 0 ? (element.scrollTop / scrollRange) * (element.clientHeight - height) : 0;
    setCategoryScrollbar({ visible: scrollRange > 1, top, height });
  };

  useEffect(() => {
    const element = categoryScrollRef.current;
    if (!element) return;

    syncCategoryScrollbar();
    const observer = new ResizeObserver(syncCategoryScrollbar);
    observer.observe(element);
    window.addEventListener("resize", syncCategoryScrollbar);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncCategoryScrollbar);
    };
  }, [categories.length]);

  const startCategoryDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") return;
    categoryDragRef.current = {
      pointerId: event.pointerId,
      startY: event.clientY,
      scrollTop: event.currentTarget.scrollTop,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveCategoryDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = categoryDragRef.current;
    if (drag.pointerId !== event.pointerId) return;
    const distance = event.clientY - drag.startY;
    if (Math.abs(distance) > 4) drag.moved = true;
    event.currentTarget.scrollTop = drag.scrollTop - distance;
  };

  const finishCategoryDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (categoryDragRef.current.pointerId !== event.pointerId) return;
    categoryDragRef.current.pointerId = -1;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section className="category-inventory-stage relative flex h-full min-h-0 flex-1 flex-col overflow-hidden border-2 border-[#24252b] bg-[#c9ccc0] p-2 shadow-[inset_0_0_0_2px_#eceee6] sm:min-h-[440px] sm:p-3">
      <span className="pointer-events-none absolute -right-7 -top-7 size-20 rotate-45 border-[11px] border-[#ba0dcb] opacity-30" />

      <header className="relative flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#24252b] bg-[#24252b] px-3 py-2 text-[#dfe2d3] sm:items-end sm:gap-3 sm:px-4 sm:py-3">
        <div className="min-w-0">
          <p className="hidden text-[9px] font-black uppercase tracking-[0.22em] text-[#f2b8f6] sm:block">Skill Inventory</p>
          <h2 className="whitespace-nowrap text-xs font-black uppercase tracking-[0.02em] text-[#dfe2d3] min-[360px]:text-sm min-[360px]:tracking-[0.04em] sm:mt-1 sm:text-2xl sm:tracking-[0.06em]">Equip Category</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.08em] sm:gap-2 sm:text-[9px] sm:tracking-[0.12em]"><span className="size-2 bg-[#ba0dcb]" /><span className="sm:hidden">{categories.length}</span><span className="hidden sm:inline">{categories.length} Slots</span></div>
      </header>

      {categories.length > 0 ? (
        <div className="relative mt-2 min-h-0 flex-1 sm:mt-3">
        <div
          ref={categoryScrollRef}
          onScroll={syncCategoryScrollbar}
          onPointerDown={startCategoryDrag}
          onPointerMove={moveCategoryDrag}
          onPointerUp={finishCategoryDrag}
          onPointerCancel={finishCategoryDrag}
          className={`retro-scrollbar grid h-full touch-none auto-rows-max grid-cols-1 gap-2 overflow-y-auto overscroll-contain p-1 sm:touch-pan-y sm:grid-cols-3 sm:gap-3 lg:grid-cols-5 2xl:grid-cols-6 ${categoryScrollbar.visible ? "pr-7" : "pr-2"}`}
        >
          {categories.map((category) => {
            const selected = selectedCategoryId === String(category.id);

            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  if (categoryDragRef.current.moved) {
                    categoryDragRef.current.moved = false;
                    return;
                  }
                  onSelect(category);
                }}
                className={`group relative flex min-h-16 min-w-0 touch-manipulation items-center justify-start overflow-hidden border-[3px] border-[#24252b] px-4 py-3 text-left shadow-[3px_3px_0_#24252b] transition-[transform,background-color,box-shadow] duration-150 hover:-translate-y-1 hover:shadow-[5px_5px_0_#24252b] active:translate-y-0.5 active:shadow-[1px_1px_0_#24252b] sm:aspect-square sm:justify-center sm:p-4 sm:text-center ${selected ? "bg-[#ba0dcb] text-white" : "bg-[#eceee6] text-[#24252b]"}`}
              >
                {selected && <span className="absolute right-2 top-2 border border-white/70 px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.12em] text-white">Selected</span>}
                <span className="line-clamp-2 pr-20 text-base font-black uppercase leading-tight tracking-[-0.02em] sm:line-clamp-4 sm:pr-0 sm:text-lg">{category.name}</span>
              </button>
            );
          })}
        </div>

        {categoryScrollbar.visible && (
          <div className="pointer-events-none absolute inset-y-0 right-0 w-4 border-2 border-[#24252b] bg-[#8f938a] shadow-[inset_0_0_0_2px_#c9ccc0]" aria-hidden="true">
            <span className="absolute inset-x-0 top-0 h-3 border-b-2 border-[#24252b] bg-[#c9ccc0] text-center text-[7px] font-black leading-[10px] text-[#24252b]">▲</span>
            <span className="absolute inset-x-0 bottom-0 h-3 border-t-2 border-[#24252b] bg-[#c9ccc0] text-center text-[7px] font-black leading-[10px] text-[#24252b]">▼</span>
            <span
              className="absolute left-0.5 right-0.5 border-2 border-[#24252b] bg-[#ba0dcb] shadow-[inset_0_0_0_2px_#dfe2d3] transition-transform duration-75"
              style={{ height: `${Math.max(24, categoryScrollbar.height - 24)}px`, transform: `translateY(${categoryScrollbar.top + 12}px)` }}
            >
              <span className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 gap-0.5"><span className="size-0.5 bg-[#24252b]" /><span className="size-0.5 bg-[#24252b]" /><span className="size-0.5 bg-[#24252b]" /></span>
            </span>
          </div>
        )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center border-x-2 border-b-2 border-[#24252b] bg-[#dfe2d3] p-6 text-center text-[10px] font-black uppercase tracking-[0.12em]">No active categories available.</div>
      )}

      <div className="relative mt-3 flex items-center justify-end gap-2">
        <button type="button" onClick={onBack} className={secondaryButtonClass}>Back</button>
        <button type="button" onClick={onContinue} disabled={!selectedCategory} className={primaryButtonClass}>Next <MaterialIcon name="arrow_forward" size="sm" /></button>
      </div>
    </section>
  );
}

function DesignerCharacterSelectStage({
  profiles,
  todayCapacity,
  selectedUserId,
  recommendedUserId,
  onSelect,
  onBack,
  onContinue,
}: {
  profiles: OddsDesignerProfile[];
  todayCapacity: number;
  selectedUserId: string;
  recommendedUserId: string | null;
  onSelect: (profile: OddsDesignerProfile) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const availableCount = profiles.filter((profile) => profile.status === "available").length;
  const rosterScrollRef = useRef<HTMLDivElement>(null);
  const [rosterScrollbar, setRosterScrollbar] = useState({ visible: false, top: 0, height: 48 });

  const syncRosterScrollbar = () => {
    const element = rosterScrollRef.current;
    if (!element) return;

    const scrollRange = element.scrollHeight - element.clientHeight;
    const height = Math.max(48, element.clientHeight * (element.clientHeight / element.scrollHeight));
    const top = scrollRange > 0 ? (element.scrollTop / scrollRange) * (element.clientHeight - height) : 0;
    setRosterScrollbar({ visible: scrollRange > 1, top, height });
  };

  useEffect(() => {
    const element = rosterScrollRef.current;
    if (!element) return;

    syncRosterScrollbar();
    const observer = new ResizeObserver(syncRosterScrollbar);
    observer.observe(element);
    window.addEventListener("resize", syncRosterScrollbar);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncRosterScrollbar);
    };
  }, [profiles.length]);

  return (
    <section className="designer-character-stage relative flex min-h-[440px] flex-1 flex-col overflow-hidden border-2 border-[#24252b] bg-[#c9ccc0] p-2 shadow-[inset_0_0_0_2px_#eceee6] sm:p-3">
      <span className="pointer-events-none absolute -left-8 -top-8 size-20 rotate-45 border-[12px] border-[#ba0dcb] opacity-30" />

      <header className="relative flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#24252b] bg-[#24252b] px-3 py-2 text-[#dfe2d3] sm:items-end sm:gap-3 sm:px-4 sm:py-3">
        <div className="min-w-0">
          <p className="hidden text-[9px] font-black uppercase tracking-[0.22em] text-[#f2b8f6] sm:block">Creative Roster</p>
          <h2 className="whitespace-nowrap text-xs font-black uppercase tracking-[0.02em] text-[#dfe2d3] min-[360px]:text-sm min-[360px]:tracking-[0.04em] sm:mt-1 sm:text-2xl sm:tracking-[0.06em]">Choose Your Creative</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 text-[8px] font-black uppercase tracking-[0.08em] sm:block sm:text-right sm:tracking-[0.12em]"><span className="size-2 bg-[#ba0dcb] sm:hidden" /><span className="text-[#f2b8f6] sm:block sm:text-[#ba0dcb]">{availableCount}<span className="hidden sm:inline"> Ready</span></span><span className="hidden text-[#969a90] sm:mt-1 sm:block">{profiles.length} Roster</span></div>
      </header>

      {profiles.length > 0 ? (
        <div className="relative mt-3 min-h-0 flex-1">
          <div ref={rosterScrollRef} onScroll={syncRosterScrollbar} className={`retro-scrollbar grid h-full auto-rows-max grid-cols-2 gap-3 overflow-y-auto p-3 sm:grid-cols-3 lg:grid-cols-6 ${rosterScrollbar.visible ? "pr-7" : ""}`}>
            {profiles.map((profile) => {
            const name = profile.user?.name ?? `User #${profile.user_id}`;
            const avatar = profile.user?.avatar ?? profile.user?.avatar_path;
            const available = profile.status === "available";
            const selected = selectedUserId === String(profile.user_id);
            const recommended = recommendedUserId === String(profile.user_id);

              return (
              <button
                key={profile.id}
                type="button"
                disabled={!available}
                aria-pressed={selected}
                aria-label={`${name}, ${available ? "available" : "locked"}${recommended ? ", recommended" : ""}`}
                onClick={() => available && onSelect(profile)}
                className={`group relative aspect-[4/5] min-w-0 origin-center border-[3px] border-[#24252b] bg-[#eceee6] shadow-[3px_3px_0_#24252b] transition-[transform,filter,box-shadow] duration-150 ${
                  available ? "cursor-pointer hover:z-30 hover:scale-110 hover:shadow-[5px_5px_0_#24252b]" : "cursor-not-allowed grayscale"
                } ${selected ? "z-20 scale-105 ring-4 ring-[#ba0dcb] ring-offset-2 ring-offset-[#c9ccc0]" : ""} ${recommended ? "ring-2 ring-[#ba0dcb] ring-offset-2 ring-offset-[#c9ccc0]" : ""}`}
              >
                <span className="absolute inset-x-0 top-0 bottom-9 overflow-hidden bg-[#b9bdb1]">
                  {avatar ? (
                    <span className="absolute inset-0 bg-cover bg-center transition-transform duration-200 group-hover:scale-110" style={{ backgroundImage: `url("${avatar}")` }} role="img" aria-label={`Foto ${name}`} />
                  ) : (
                    <span className={`absolute inset-0 flex items-center justify-center text-4xl font-black ${available ? "bg-[#dfe2d3] text-[#ba0dcb]" : "bg-[#8f938a] text-[#555850]"}`}>{name.slice(0, 1).toUpperCase()}</span>
                  )}

                  <span className={`absolute inset-x-0 bottom-0 z-20 bg-[#24252b]/95 px-2 py-2 text-left text-[#dfe2d3] transition-transform duration-150 ${selected ? "translate-y-0" : "translate-y-full group-hover:translate-y-0"}`}>
                    <span className="block text-[7px] font-black uppercase tracking-[0.12em] text-[#f2b8f6]">{profile.status.replace("_", " ")}</span>
                    <span className="mt-1 block text-[7px] font-black uppercase tracking-[0.08em]">Status: {capacityLabel(profile, todayCapacity)}</span>
                  </span>

                  {!available && (
                    <span className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#24252b]/65 text-[#dfe2d3]">
                      <span className="flex size-9 items-center justify-center border-2 border-[#dfe2d3] bg-[#555850]"><MaterialIcon name="lock" size="sm" /></span>
                      <span className="mt-2 text-[7px] font-black uppercase tracking-[0.12em]">Unavailable</span>
                    </span>
                  )}
                </span>

                <span className={`absolute inset-x-0 bottom-0 flex h-9 items-center justify-center border-t-2 border-[#24252b] px-1 ${selected ? "bg-[#ba0dcb] text-white" : available ? "bg-[#eceee6] text-[#24252b]" : "bg-[#8f938a] text-[#555850]"}`}>
                  <span className="block max-w-full truncate text-[8px] font-black uppercase tracking-[0.04em]" title={name}>{name}</span>
                </span>

                {recommended && available && (
                  <span className="group/recommend absolute left-1 top-1 z-40 border-2 border-[#24252b] bg-[#ba0dcb] px-1.5 py-0.5 text-[7px] font-black uppercase tracking-[0.1em] text-white shadow-[2px_2px_0_#24252b]">
                    ★ Rec
                    <span role="tooltip" className="pointer-events-none absolute left-0 top-full mt-1 w-32 border-2 border-[#24252b] bg-[#eceee6] px-2 py-1.5 text-left text-[7px] font-black uppercase leading-3 tracking-[0.08em] text-[#24252b] opacity-0 shadow-[3px_3px_0_#24252b] transition-opacity group-hover/recommend:opacity-100">Best match for this category</span>
                  </span>
                )}

                {selected && <span className="absolute right-1 top-1 z-40 flex size-6 items-center justify-center border-2 border-[#24252b] bg-[#eceee6] text-[#ba0dcb] shadow-[2px_2px_0_#24252b]"><MaterialIcon name="check" size="sm" /></span>}
              </button>
              );
            })}
          </div>

          {rosterScrollbar.visible && (
            <div className="pointer-events-none absolute inset-y-0 right-0 w-4 border-2 border-[#24252b] bg-[#8f938a] shadow-[inset_0_0_0_2px_#c9ccc0]" aria-hidden="true">
              <span className="absolute inset-x-0 top-0 h-3 border-b-2 border-[#24252b] bg-[#c9ccc0] text-center text-[7px] font-black leading-[10px] text-[#24252b]">▲</span>
              <span className="absolute inset-x-0 bottom-0 h-3 border-t-2 border-[#24252b] bg-[#c9ccc0] text-center text-[7px] font-black leading-[10px] text-[#24252b]">▼</span>
              <span
                className="absolute left-0.5 right-0.5 border-2 border-[#24252b] bg-[#ba0dcb] shadow-[inset_0_0_0_2px_#dfe2d3] transition-transform duration-75"
                style={{ height: `${Math.max(24, rosterScrollbar.height - 24)}px`, transform: `translateY(${rosterScrollbar.top + 12}px)` }}
              >
                <span className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 gap-0.5"><span className="size-0.5 bg-[#24252b]" /><span className="size-0.5 bg-[#24252b]" /><span className="size-0.5 bg-[#24252b]" /></span>
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-[10px] font-black uppercase tracking-[0.12em]">No creatives available for this category.</div>
      )}

      <div className="relative mt-3 flex items-center justify-end gap-2">
        <button type="button" onClick={onBack} className={secondaryButtonClass}>Back</button>
        <button type="button" onClick={onContinue} disabled={!selectedUserId} className={primaryButtonClass}>Next <MaterialIcon name="arrow_forward" size="sm" /></button>
      </div>
    </section>
  );
}

function matchesSpecialization(profile: OddsDesignerProfile, categoryId: string): boolean {
  if (!categoryId) return true;

  const specializations = profile.specializations ?? [];
  return specializations.length === 0
    || specializations.includes(Number(categoryId))
    || specializations.includes(categoryId);
}

function capacityLabel(profile: OddsDesignerProfile, todayCapacity: number): string {
  const todayStr = new Date().toLocaleDateString("en-CA");
  if (profile.leave_dates?.includes(todayStr)) return "Sedang Cuti";
  if (profile.current_load_minutes >= todayCapacity) return "Full Load Today";
  return "Available";
}

function designerSort(left: OddsDesignerProfile, right: OddsDesignerProfile, todayCapacity: number): number {
  const leftOff = left.status === "off" ? 1 : 0;
  const rightOff = right.status === "off" ? 1 : 0;
  const leftLeave = capacityLabel(left, todayCapacity) === "Sedang Cuti" ? 1 : 0;
  const rightLeave = capacityLabel(right, todayCapacity) === "Sedang Cuti" ? 1 : 0;
  const leftFull = capacityLabel(left, todayCapacity) === "Full Load Today" ? 1 : 0;
  const rightFull = capacityLabel(right, todayCapacity) === "Full Load Today" ? 1 : 0;

  return leftOff - rightOff
    || leftLeave - rightLeave
    || leftFull - rightFull;
}

function recommendDesigner(profiles: OddsDesignerProfile[], category: OddsCategory | null | undefined): OddsDesignerProfile | null {
  const todayStr = new Date().toLocaleDateString("en-CA");
  const matching = profiles
    .filter((profile) => profile.is_active && profile.status === "available" && !profile.leave_dates?.includes(todayStr))
    .filter((profile) => matchesSpecialization(profile, category ? String(category.id) : ""))
    .sort((left, right) => designerSort(left, right, 420));

  return matching[0] ?? null;
}

function selectedDesignerName(userId: string, profiles: OddsDesignerProfile[]): string | null {
  const profile = profiles.find((item) => String(item.user_id) === userId);
  return profile?.user?.name ?? (profile ? `User #${profile.user_id}` : null);
}

function LoadoutRow({ label, value, active, disabled = false, onClick }: { label: string; value: string; active: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="group flex w-full items-center gap-2 border border-transparent px-2 py-1.5 text-left transition hover:border-[#24252b] hover:bg-[#dfe2d3] disabled:cursor-not-allowed disabled:hover:border-transparent disabled:hover:bg-transparent">
      <span className={`size-2 shrink-0 border border-[#24252b] ${active ? "bg-[#ba0dcb]" : "bg-[#b9bdb1]"}`} />
      <span className="min-w-0 flex-1">
        <span className="block text-[8px] font-black uppercase tracking-[0.14em] text-[#666961]">{label}</span>
        <span className={`mt-0.5 block truncate text-[10px] font-black uppercase ${active ? "text-[#24252b]" : "text-[#777a72]"}`}>{value}</span>
      </span>
      <span className={`text-xs font-black ${disabled ? "opacity-30" : ""}`}>›</span>
    </button>
  );
}

function RetroHudRoute({
  steps,
  currentStep,
  syncPercent,
  onSelect,
}: {
  steps: ReadonlyArray<{ label: string; detail: string }>;
  currentStep: number;
  syncPercent: number;
  onSelect: (step: number) => void;
}) {
  return (
    <nav className="overflow-hidden rounded-lg border-2 border-[#24252b] bg-[#24252b] text-[#dfe2d3] shadow-[inset_0_0_0_2px_#555850]" aria-label={`Rute quest, tahap ${currentStep} dari ${steps.length}`}>
      <div className="flex items-end justify-between border-b border-[#dfe2d3]/40 px-3 py-2">
        <span>
          <span className="block text-[7px] font-black uppercase tracking-[0.18em] text-[#f2b8f6]">Quest Route</span>
          <span className="mt-0.5 block text-[9px] font-black uppercase tracking-[0.12em]">Stage {String(currentStep).padStart(2, "0")}</span>
        </span>
        <span className="text-lg font-black leading-none text-[#ba0dcb]">{String(currentStep).padStart(2, "0")}<span className="text-[9px] text-[#dfe2d3]">/{String(steps.length).padStart(2, "0")}</span></span>
      </div>

      <div className="px-3 py-2">
        {steps.map((item, index) => {
          const step = index + 1;
          const completed = step < currentStep;
          const active = step === currentStep;
          const available = step <= currentStep;

          return (
            <div key={item.label} className="relative flex min-h-8 gap-2">
              <div className="relative flex w-5 shrink-0 justify-center">
                {index < steps.length - 1 && <span className={`absolute left-1/2 top-5 h-[calc(100%-12px)] w-0.5 -translate-x-1/2 ${step < currentStep ? "bg-[#ba0dcb]" : "bg-[#666961]"}`} />}
                <button
                  type="button"
                  disabled={!available}
                  onClick={() => available && onSelect(step)}
                  aria-current={active ? "step" : undefined}
                  aria-label={`${completed ? "Complete" : active ? "Active" : "Locked"}: ${item.label}`}
                  className={`relative z-10 mt-0.5 flex size-5 items-center justify-center border text-[8px] font-black transition-transform ${
                    active
                      ? "animate-pulse border-[#dfe2d3] bg-[#ba0dcb] text-white shadow-[2px_2px_0_#dfe2d3]"
                      : completed
                        ? "cursor-pointer border-[#dfe2d3] bg-[#dfe2d3] text-[#24252b] hover:scale-110"
                        : "cursor-not-allowed border-[#777a72] bg-[#3d3f45] text-[#969a90]"
                  }`}
                >
                  {completed ? "✓" : active ? "●" : "?"}
                </button>
              </div>
              <span className={`min-w-0 flex-1 pb-2 ${active ? "text-[#dfe2d3]" : completed ? "text-[#c9ccc0]" : "text-[#777a72]"}`}>
                <span className="block truncate text-[8px] font-black uppercase tracking-[0.1em]">{active || completed ? item.label : "???"}</span>
                {active && <span className="mt-0.5 block truncate text-[7px] font-black uppercase tracking-[0.08em] text-[#f2b8f6]">{item.detail}</span>}
              </span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-[#dfe2d3]/40 px-3 py-2">
        <div className="mb-1 flex items-center justify-between text-[7px] font-black uppercase tracking-[0.12em]"><span>Sync</span><span>{syncPercent}%</span></div>
        <div className="h-2 border border-[#dfe2d3] bg-[#555850] p-px"><div className="h-full bg-[#ba0dcb] transition-[width] duration-300" style={{ width: `${syncPercent}%` }} /></div>
      </div>
    </nav>
  );
}

function MissionBriefStage({
  initialStep,
  form,
  briefPlainText,
  attachments,
  uploading,
  onUpdate,
  onUpload,
  onRemoveAttachment,
  onBack,
  onContinue,
}: {
  initialStep: number;
  form: TaskForm;
  briefPlainText: string;
  attachments: OddsTaskAttachment[];
  uploading: boolean;
  onUpdate: (field: keyof TaskForm, value: string) => void;
  onUpload: (files: FileList | null) => Promise<OddsTaskAttachment[]>;
  onRemoveAttachment: (id: number) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [missionStep, setMissionStep] = useState(initialStep);
  const [assetMode, setAssetMode] = useState<"add" | "skip" | null>(null);
  const missionNamed = Boolean(form.design_purpose.trim());
  const briefReady = Boolean(briefPlainText.trim());
  const canAdvanceMission = missionStep === 1
    ? missionNamed
    : missionStep === 4
      ? briefReady
      : true;

  const dateFromNow = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString("en-CA");
  };

  const deadlineOptions = [
    { label: "Tomorrow", value: dateFromNow(1) },
    { label: "+3 Days", value: dateFromNow(3) },
  ];
  const operatorMessage = [
    missionNamed ? "MISSION NAME SAVED. CHECK MATRIX LEVEL." : "ENTER A MISSION NAME TO BEGIN.",
    `${(form.important_matrix || "Q4").toUpperCase()} MATRIX LEVEL ASSIGNED.`,
    form.deadline ? "TARGET DATE LOCKED. KEEP MOVING." : "WE WILL SET THE BEST TIME AUTOMATICALLY.",
    briefReady ? "TRANSMISSION RECEIVED. OPEN THE MISSION SCROLL." : "WRITE A CLEAR BRIEF FOR THE CREATIVE.",
  ][missionStep - 1];

  return (
    <section className="mission-brief-stage relative flex h-full min-h-0 flex-col overflow-hidden border-2 border-[#24252b] bg-[#c9ccc0] p-2 text-[#24252b] shadow-[inset_0_0_0_2px_#eceee6] sm:min-h-[560px] sm:p-3">
      <span className="pointer-events-none absolute -right-7 -top-7 size-20 rotate-45 border-[11px] border-[#ba0dcb] opacity-30" />
      <header className="relative mb-2 flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#24252b] bg-[#24252b] px-3 py-2 text-[#dfe2d3] sm:mb-3 sm:items-end sm:gap-3 sm:px-4 sm:py-3">
        <div className="min-w-0">
          <span className="hidden text-[10px] font-black uppercase tracking-[0.2em] text-[#f2b8f6] sm:block">Mission 0{missionStep}/04</span>
          <h2 className="whitespace-nowrap text-xs font-black uppercase tracking-[0.02em] text-[#dfe2d3] min-[360px]:text-sm min-[360px]:tracking-[0.04em] sm:mt-1 sm:text-3xl sm:tracking-[0.06em]">{["Name The Mission", "Important Matrix", "Set Mission Timer", "Transmit The Brief"][missionStep - 1]}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {[1, 2, 3, 4].map((step) => <span key={step} className={`size-2 border border-[#eceee6] transition-colors sm:h-3 sm:w-10 ${step <= missionStep ? "bg-[#ba0dcb]" : "bg-[#555850]"}`} />)}
        </div>
      </header>

      <div className="grid h-full min-h-0 flex-1 grid-cols-1 items-stretch gap-3">
        <div className={`${missionStep === 1 || missionStep === 2 || missionStep === 4 ? "flex" : "hidden"} h-full min-h-0 flex-col justify-center bg-transparent`}>
          <div className={`${missionStep === 1 || missionStep === 2 ? "grid" : "hidden"} mx-auto w-full shrink-0 gap-2 border-2 border-[#24252b] bg-[#eceee6] p-3 shadow-[2px_2px_0_#24252b] sm:gap-5 sm:border-[3px] sm:p-8 sm:shadow-[3px_3px_0_#24252b] ${missionStep === 2 ? "max-w-5xl md:grid-cols-3" : "max-w-3xl grid-cols-1"}`}>
            <label className={`${missionStep === 1 ? "block" : "hidden"} group`}>
              <span className="mb-2 flex items-center justify-between gap-2 text-[9px] font-black uppercase tracking-[0.08em] sm:mb-3 sm:text-xs sm:tracking-[0.12em]">
                <span className="whitespace-nowrap"><span className="sm:hidden">Mission Name</span><span className="hidden sm:inline">01 / Mission Name</span></span>
                <span className={`shrink-0 border-2 border-[#24252b] px-2 py-0.5 text-[8px] tracking-[0.08em] sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-[0.1em] ${missionNamed ? "bg-[#ba0dcb] text-white" : "bg-[#dfe2d3] text-[#555850]"}`}>{missionNamed ? "Data OK" : "Required"}</span>
              </span>
              <textarea
                value={form.design_purpose}
                onChange={(event) => onUpdate("design_purpose", event.target.value)}
                placeholder="ENTER MISSION NAME_"
                rows={3}
                className="odds-scroll-hidden min-h-24 w-full resize-none overflow-y-auto border-2 border-[#24252b] bg-[#eceee6] px-4 py-3 text-lg font-black uppercase leading-7 tracking-[0.04em] outline-none shadow-[inset_2px_2px_0_#c9ccc0] placeholder:text-[#969a90] focus:border-[#ba0dcb] focus:bg-white sm:hidden"
              />
              <input
                value={form.design_purpose}
                onChange={(event) => onUpdate("design_purpose", event.target.value)}
                placeholder="ENTER MISSION NAME_"
                className="hidden h-20 w-full border-2 border-[#24252b] bg-[#eceee6] px-5 text-3xl font-black uppercase tracking-[0.05em] outline-none shadow-[inset_3px_3px_0_#c9ccc0] placeholder:text-[#969a90] focus:border-[#ba0dcb] focus:bg-white sm:block"
              />
            </label>

            {(() => {
              const matrixKey = (form.important_matrix || "Q4").toUpperCase();
              const quadranDesc = 
                matrixKey === "Q1" ? "Quadran I: Mendesak & Penting (High Priority)" :
                matrixKey === "Q2" ? "Quadran II: Penting (Strategic Task)" :
                matrixKey === "Q3" ? "Quadran III: Mendesak (Daily Queue)" :
                "Quadran IV: Normal (Standard Timeline)";

              return (
                <div className={`${missionStep === 2 ? "flex" : "hidden"} min-h-40 flex-col items-center justify-center gap-3 border-[3px] border-[#24252b] bg-[#ba0dcb] p-6 text-center text-white shadow-[3px_3px_0_#24252b]`}>
                  <span className="text-3xl font-black tracking-widest">{matrixKey} THREAT MATRIX</span>
                  <p className="text-xs font-bold text-white/90">{quadranDesc}</p>
                  <p className="text-[10px] uppercase text-white/70">Matrix level is automatically locked by selected category</p>
                </div>
              );
            })()}
          </div>

          <div className={`${missionStep === 4 ? "flex" : "hidden"} min-h-0 flex-1 flex-col border border-[#24252b] bg-[#24252b] sm:min-h-[360px]`}>
            <div className="flex shrink-0 items-center justify-between gap-2 px-2 py-1.5 text-[#eceee6] sm:px-3 sm:py-2">
              <span className="whitespace-nowrap text-[8px] font-black uppercase tracking-[0.08em] sm:text-[9px] sm:tracking-[0.16em]">Mission Transmission</span>
              <span className={`flex shrink-0 items-center gap-1 text-[7px] font-black uppercase sm:gap-1.5 sm:text-[8px] ${briefReady ? "text-[#f2b8f6]" : "text-[#969a90]"}`}><span className={`size-1.5 sm:size-2 ${briefReady ? "animate-pulse bg-[#ba0dcb]" : "bg-[#666961]"}`} /><span className="sm:hidden">{briefReady ? "Ready" : "Empty"}</span><span className="hidden sm:inline">{briefReady ? "Signal Clear" : "No Signal"}</span></span>
            </div>
            <RetroBriefEditor value={form.brief_text} onChange={(value) => onUpdate("brief_text", value)} onUploadImage={onUpload} />
          </div>
        </div>

        <aside className={`${missionStep === 3 ? "flex" : "hidden"} h-full min-h-0 flex-col justify-center gap-3`}>
          <div className={`${missionStep === 3 ? "flex" : "hidden"} relative mx-auto h-full w-full max-w-3xl flex-col justify-center border-2 border-[#24252b] bg-[#eceee6] p-3 shadow-[2px_2px_0_#24252b] sm:block sm:h-auto sm:border-[3px] sm:p-8 sm:shadow-[3px_3px_0_#24252b]`}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-[0.16em]">Mission Timer</span>
              <MaterialIcon name="timer" size="sm" />
            </div>
            <p className="mb-3 text-[9px] font-bold leading-4 text-[#666961] sm:mb-4 sm:text-sm sm:leading-6">Leave this empty to let us choose the best timing automatically for your request.</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {deadlineOptions.map((option) => (
                <button key={option.label} type="button" onClick={() => onUpdate("deadline", option.value)} className={`border-2 border-[#24252b] px-2 py-2 text-[8px] font-black uppercase transition sm:py-3 sm:text-[9px] ${form.deadline === option.value ? "bg-[#ba0dcb] text-white hover:bg-[#a80cba]" : "bg-[#dfe2d3] hover:bg-white"}`}>{option.label}</button>
              ))}
            </div>
            <RetroDatePicker value={form.deadline} onChange={(value) => onUpdate("deadline", value)} />
          </div>

          <div className={`${missionStep === 99 && assetMode !== "add" ? "grid" : "hidden"} mx-auto w-full max-w-4xl gap-5 border-[3px] border-[#24252b] bg-[#eceee6] p-8 shadow-[3px_3px_0_#24252b] md:grid-cols-2`}>
            <div className="md:col-span-2">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[#666961]">Optional Mission Data</span>
              <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.04em]">Do you have references?</h3>
              <p className="mt-2 text-sm font-bold text-[#666961]">References can help the creative understand your direction, but they are not required.</p>
            </div>
            <button type="button" onClick={() => setAssetMode("add")} className="group flex min-h-48 flex-col border-[3px] border-[#24252b] bg-[#dfe2d3] p-5 text-left shadow-[3px_3px_0_#777a72] transition hover:-translate-y-1 hover:bg-white hover:shadow-[5px_5px_0_#24252b]">
              <span className="flex size-12 items-center justify-center border-2 border-[#24252b] bg-[#ba0dcb] text-white"><MaterialIcon name="add_photo_alternate" size="lg" /></span>
              <span className="mt-5 text-xl font-black uppercase">Yes, I Have</span>
              <span className="mt-2 text-xs font-bold leading-5 text-[#666961]">Add links, files, or visual notes to the mission.</span>
              <span className="mt-auto pt-4 text-[9px] font-black uppercase text-[#ba0dcb]">Open Inventory ›</span>
            </button>
            <button type="button" onClick={() => setAssetMode("skip")} className={`group flex min-h-48 flex-col border-[3px] border-[#24252b] p-5 text-left transition hover:-translate-y-1 hover:shadow-[5px_5px_0_#24252b] ${assetMode === "skip" ? "bg-[#ba0dcb] text-white shadow-[3px_3px_0_#24252b]" : "bg-[#dfe2d3] shadow-[3px_3px_0_#777a72] hover:bg-white"}`}>
              <span className={`flex size-12 items-center justify-center border-2 border-[#24252b] ${assetMode === "skip" ? "bg-white text-[#ba0dcb]" : "bg-[#c9ccc0]"}`}><MaterialIcon name="fast_forward" size="lg" /></span>
              <span className="mt-5 text-xl font-black uppercase">No Reference</span>
              <span className={`mt-2 text-xs font-bold leading-5 ${assetMode === "skip" ? "text-white/85" : "text-[#666961]"}`}>Continue now and let the creative develop the direction.</span>
              <span className="mt-auto pt-4 text-[9px] font-black uppercase">{assetMode === "skip" ? "Selected" : "Continue Without Assets ›"}</span>
            </button>
          </div>

          <div className={`${missionStep === 99 && assetMode === "add" ? "block" : "hidden"} mx-auto w-full max-w-5xl border-[3px] border-[#24252b] bg-[#eceee6] p-6 shadow-[3px_3px_0_#24252b]`}>
            <div className="mb-5 flex items-end justify-between border-b-2 border-[#24252b] pb-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.16em] text-[#ba0dcb]">Optional Reference Kit</span>
                <h3 className="mt-1 text-2xl font-black uppercase tracking-[0.04em]">Build The Asset Pack</h3>
              </div>
              <span className="border-2 border-[#24252b] bg-[#dfe2d3] px-3 py-1.5 text-[9px] font-black uppercase">{attachments.length} / 8 Files</span>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(240px,2fr)]">
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em]"><span className="flex size-6 items-center justify-center bg-[#24252b] text-[8px] text-white">01</span> Reference Link</span>
                  <span className="flex h-12 items-center border-2 border-[#24252b] bg-[#dfe2d3] focus-within:border-[#ba0dcb] focus-within:bg-white">
                    <MaterialIcon name="link" size="sm" className="ml-3 shrink-0 text-[#666961]" />
                    <input value={form.reference_visual} onChange={(event) => onUpdate("reference_visual", event.target.value)} placeholder="Figma, Drive, Pinterest, or website URL" className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs font-bold outline-none placeholder:text-[#777a72]" />
                  </span>
                </label>

                <div>
                  <span className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em]"><span className="flex size-6 items-center justify-center bg-[#24252b] text-[8px] text-white">02</span> Reference Files</span>
                  <div className="retro-scrollbar grid max-h-32 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-4">
                    {attachments.map((attachment) => (
                      <button key={attachment.id} type="button" onClick={() => onRemoveAttachment(attachment.id)} title={`Remove ${attachment.name}`} className="group relative flex h-16 min-w-0 items-center gap-2 overflow-hidden border-2 border-[#24252b] bg-[#dfe2d3] px-2 text-left hover:bg-[#f2b8f6]">
                        <MaterialIcon name="draft" size="sm" className="shrink-0" />
                        <span className="min-w-0 truncate text-[7px] font-black uppercase">{attachment.name}</span>
                        <span className="absolute inset-0 hidden items-center justify-center bg-[#24252b]/90 text-[8px] font-black uppercase text-white group-hover:flex">Remove</span>
                      </button>
                    ))}
                    <label className="flex h-16 cursor-pointer items-center justify-center gap-2 border-2 border-dashed border-[#24252b] bg-[#dfe2d3] px-3 transition hover:bg-white">
                      <MaterialIcon name={uploading ? "hourglass_top" : "upload_file"} size="sm" className={uploading ? "animate-spin" : ""} />
                      <span className="text-[8px] font-black uppercase">{uploading ? "Uploading" : "Add Files"}</span>
                      <input type="file" multiple disabled={uploading} onChange={(event) => void onUpload(event.target.files)} className="sr-only" />
                    </label>
                  </div>
                </div>
              </div>

              <label className="flex flex-col border-2 border-[#24252b] bg-[#dfe2d3] p-4">
                <span className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.12em]"><span className="flex items-center gap-2"><MaterialIcon name="sticky_note_2" size="sm" /> Quick Notes</span><span className="text-[8px] text-[#777a72]">Optional</span></span>
                <p className="mt-2 text-[9px] font-bold leading-4 text-[#666961]">Add access instructions, passwords, or a short visual direction.</p>
                <textarea value={form.attachment_notes} onChange={(event) => onUpdate("attachment_notes", event.target.value)} placeholder="Type a short note..." className="mt-3 h-24 resize-none border-2 border-[#24252b] bg-[#eceee6] p-3 text-xs font-bold leading-5 outline-none placeholder:text-[#777a72] focus:border-[#ba0dcb] focus:bg-white" />
                <span className="mt-2 text-right text-[8px] font-black uppercase text-[#777a72]">{form.attachment_notes.length} chars</span>
              </label>
            </div>
          </div>

        </aside>

      </div>

      <div className="mt-3 flex shrink-0 items-center justify-between border-t-2 border-[#24252b] pt-3">
        <RobotOperator message={operatorMessage} />
        <div className="ml-auto flex gap-2">
          <button type="button" onClick={missionStep === 1 ? onBack : () => setMissionStep((step) => step - 1)} className={secondaryButtonClass}>Back</button>
          {missionStep < 4 ? (
            <button type="button" onClick={() => setMissionStep((step) => step + 1)} disabled={!canAdvanceMission} className={primaryButtonClass}>{missionStep === 3 && !form.deadline ? "Continue Automatically" : "Next"} <MaterialIcon name="arrow_forward" size="sm" /></button>
          ) : (
            <button type="button" onClick={onContinue} disabled={!briefReady} className={primaryButtonClass}>Next <MaterialIcon name="arrow_forward" size="sm" /></button>
          )}
        </div>
      </div>
    </section>
  );
}

function RetroBriefEditor({ value, onChange, onUploadImage }: { value: string; onChange: (value: string) => void; onUploadImage: (files: FileList | null) => Promise<OddsTaskAttachment[]> }) {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [toolbarHint, setToolbarHint] = useState({ overflow: false, atEnd: false });
  const isEmpty = !stripRichText(value);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) editor.innerHTML = value;
  }, [value]);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;

    const syncToolbarHint = () => {
      const maxScroll = toolbar.scrollWidth - toolbar.clientWidth;
      setToolbarHint({ overflow: maxScroll > 2, atEnd: toolbar.scrollLeft >= maxScroll - 2 });
    };

    syncToolbarHint();
    const observer = new ResizeObserver(syncToolbarHint);
    observer.observe(toolbar);
    window.addEventListener("resize", syncToolbarHint);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncToolbarHint);
    };
  }, []);

  const tools = [
    { command: "bold", icon: "format_bold", label: "Bold" },
    { command: "italic", icon: "format_italic", label: "Italic" },
    { command: "underline", icon: "format_underlined", label: "Underline" },
    { command: "insertUnorderedList", icon: "format_list_bulleted", label: "Bullet list" },
    { command: "insertOrderedList", icon: "format_list_numbered", label: "Numbered list" },
    { command: "undo", icon: "undo", label: "Undo" },
    { command: "redo", icon: "redo", label: "Redo" },
  ];

  const syncActiveTools = () => {
    const statefulCommands = ["bold", "italic", "underline", "insertUnorderedList", "insertOrderedList"];
    setActiveTools(statefulCommands.filter((command) => {
      try {
        return document.queryCommandState(command);
      } catch {
        return false;
      }
    }));
  };

  const runCommand = (command: string, commandValue?: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand(command, false, commandValue);
    onChange(editor.innerHTML);
    syncActiveTools();
  };

  const rememberSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (!savedRangeRef.current) return;
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(savedRangeRef.current);
  };

  const insertLink = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const normalized = /^https?:\/\//i.test(linkUrl.trim()) ? linkUrl.trim() : `https://${linkUrl.trim()}`;
    if (!/^https?:\/\/[^\s]+$/i.test(normalized)) return;
    editor.focus();
    restoreSelection();
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      document.execCommand("createLink", false, normalized);
      const anchor = selection.anchorNode?.parentElement?.closest("a");
      anchor?.setAttribute("data-reference-type", "link");
      anchor?.setAttribute("target", "_blank");
      anchor?.setAttribute("rel", "noopener noreferrer");
    } else {
      document.execCommand("insertHTML", false, `<a href="${normalized}" data-reference-type="link" target="_blank" rel="noopener noreferrer">${normalized}</a>`);
    }
    onChange(editor.innerHTML);
    setLinkUrl("");
    setLinkPanelOpen(false);
  };

  const insertImages = async (files: FileList | null) => {
    const editor = editorRef.current;
    if (!editor || !files?.length) return;
    setImageUploading(true);
    rememberSelection();
    const uploaded = await onUploadImage(files);
    editor.focus();
    restoreSelection();
    uploaded.filter((file) => file.mime_type?.startsWith("image/")).forEach((file) => {
      const safeName = file.name.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
      document.execCommand("insertHTML", false, `<figure data-reference-type="image" data-attachment-id="${file.id}"><img src="/api/v1/odds/uploads/${file.id}/content" alt="${safeName}"><figcaption>${safeName}</figcaption></figure><p><br></p>`);
    });
    onChange(editor.innerHTML);
    setImageUploading(false);
  };

  const pastePlainTextAsParagraphs = (text: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    const escapeHtml = (input: string) => input.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
    const normalizedText = text
      .replace(/\r\n?/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n[ \t]+/g, "\n");
    const paragraphs = normalizedText
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim()
        ? `<p>${paragraph.split("\n").map(escapeHtml).join("<br>")}</p>`
        : "<p><br></p>")
      .join("<p><br></p>");
    document.execCommand("insertHTML", false, paragraphs || "<p><br></p>");
    onChange(editor.innerHTML);
  };

  return (
    <div className="mission-terminal-editor flex min-h-0 flex-1 flex-col bg-[#eceee6]">
      <div className="relative flex shrink-0 items-center border-b-2 border-[#24252b] bg-[#c9ccc0] p-1 sm:justify-between sm:gap-2 sm:p-2">
        <div ref={toolbarRef} onScroll={() => {
          const toolbar = toolbarRef.current;
          if (!toolbar) return;
          const maxScroll = toolbar.scrollWidth - toolbar.clientWidth;
          setToolbarHint({ overflow: maxScroll > 2, atEnd: toolbar.scrollLeft >= maxScroll - 2 });
        }} className="retro-scrollbar flex w-full flex-nowrap gap-1 overflow-x-auto p-0.5 sm:w-auto sm:flex-wrap sm:gap-1.5 sm:overflow-visible sm:p-0" role="toolbar" aria-label="Brief formatting tools">
          {tools.map((tool) => (
            <button
              key={tool.command}
              type="button"
              title={tool.label}
              aria-label={tool.label}
              aria-pressed={activeTools.includes(tool.command)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => runCommand(tool.command)}
              className={`flex size-8 shrink-0 items-center justify-center border-2 border-[#24252b] shadow-[2px_2px_0_#777a72] transition hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#24252b] active:translate-y-0 active:shadow-none sm:size-9 ${activeTools.includes(tool.command) ? "bg-[#ba0dcb] text-white" : "bg-[#eceee6] text-[#24252b] hover:bg-white"}`}
            >
              <MaterialIcon name={tool.icon} size="sm" />
            </button>
          ))}
          <span className="mx-1 hidden w-px bg-[#24252b]/40 sm:block" />
          <button type="button" title="Clear formatting" aria-label="Clear formatting" onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand("removeFormat")} className="flex size-8 shrink-0 items-center justify-center gap-1.5 border-2 border-[#24252b] bg-[#eceee6] text-[8px] font-black uppercase shadow-[2px_2px_0_#777a72] hover:bg-white active:shadow-none sm:h-9 sm:w-auto sm:px-3"><MaterialIcon name="format_clear" size="sm" /><span className="hidden sm:inline">Clear</span></button>
          <button type="button" title="Insert link" aria-label="Insert link" aria-pressed={linkPanelOpen} onMouseDown={(event) => { event.preventDefault(); rememberSelection(); }} onClick={() => setLinkPanelOpen((open) => !open)} className={`flex size-8 shrink-0 items-center justify-center gap-1.5 border-2 border-[#24252b] text-[8px] font-black uppercase shadow-[2px_2px_0_#777a72] sm:h-9 sm:w-auto sm:px-3 ${linkPanelOpen ? "bg-[#ba0dcb] text-white" : "bg-[#eceee6] hover:bg-white"}`}><MaterialIcon name="link" size="sm" /><span className="hidden sm:inline">Link</span></button>
          <label title="Insert image" aria-label="Insert image" className="flex size-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 border-2 border-[#24252b] bg-[#eceee6] text-[8px] font-black uppercase shadow-[2px_2px_0_#777a72] hover:bg-white sm:h-9 sm:w-auto sm:px-3">
            <MaterialIcon name={imageUploading ? "hourglass_top" : "image"} size="sm" className={imageUploading ? "animate-spin" : ""} /><span className="hidden sm:inline">{imageUploading ? "Uploading" : "Image"}</span>
            <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple disabled={imageUploading} onChange={(event) => void insertImages(event.target.files)} className="sr-only" />
          </label>
        </div>
        {toolbarHint.overflow && !toolbarHint.atEnd && <span className="pointer-events-none absolute bottom-1 right-1 top-1 flex items-center bg-gradient-to-l from-[#c9ccc0] via-[#c9ccc0] to-transparent pl-5 sm:hidden"><span className="animate-pulse border-2 border-[#24252b] bg-[#ba0dcb] px-1.5 py-1 text-[6px] font-black uppercase tracking-[0.08em] text-white shadow-[2px_2px_0_#24252b]">Swipe ›</span></span>}
        <span className="hidden text-[8px] font-black uppercase tracking-[0.12em] text-[#666961] lg:block">Ctrl+B · Ctrl+I · Ctrl+U</span>
      </div>

      {linkPanelOpen && (
        <div className="flex shrink-0 items-center gap-1 border-b-2 border-[#24252b] bg-[#dfe2d3] p-1 sm:gap-2 sm:p-2">
          <MaterialIcon name="link" size="sm" className="shrink-0" />
          <input value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), insertLink())} placeholder="https://figma.com/..." className="h-8 min-w-0 flex-1 border-2 border-[#24252b] bg-[#eceee6] px-2 text-[10px] font-bold outline-none focus:border-[#ba0dcb] sm:h-9 sm:px-3 sm:text-xs" autoFocus />
          <button type="button" onClick={insertLink} disabled={!linkUrl.trim()} aria-label="Insert link" className="flex size-8 items-center justify-center border-2 border-[#24252b] bg-[#ba0dcb] text-[8px] font-black uppercase text-white disabled:bg-[#a9aca2] sm:h-9 sm:w-auto sm:px-4"><MaterialIcon name="check" size="sm" /><span className="hidden sm:inline">Insert Link</span></button>
          <button type="button" onClick={() => setLinkPanelOpen(false)} aria-label="Close link panel" className="flex size-8 items-center justify-center border-2 border-[#24252b] bg-[#eceee6] sm:size-9"><MaterialIcon name="close" size="sm" /></button>
        </div>
      )}

      <div className="relative min-h-0 flex-1">
        {isEmpty && <span className="pointer-events-none absolute left-3 top-3 z-10 max-w-[calc(100%-24px)] text-xs font-bold leading-5 text-[#969a90] sm:left-5 sm:top-5 sm:max-w-xl sm:text-sm sm:leading-6">Describe the design need, dimensions, copy, channel, and final output...</span>}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Mission brief editor"
          onInput={(event) => {
            onChange(event.currentTarget.innerHTML);
            syncActiveTools();
          }}
          onKeyUp={() => { syncActiveTools(); rememberSelection(); }}
          onMouseUp={() => { syncActiveTools(); rememberSelection(); }}
          onKeyDown={rememberSelection}
          onFocus={syncActiveTools}
          onPaste={(event) => {
            event.preventDefault();
            pastePlainTextAsParagraphs(event.clipboardData.getData("text/plain"));
          }}
          className="retro-scrollbar h-full min-h-0 overflow-y-auto bg-[#eceee6] p-3 text-sm font-normal leading-6 text-[#24252b] outline-none [caret-color:#ba0dcb] focus:bg-white sm:min-h-[300px] sm:p-5 sm:leading-7 [&_a]:font-black [&_a]:text-[#ba0dcb] [&_a]:underline [&_figcaption]:border-x-2 [&_figcaption]:border-b-2 [&_figcaption]:border-[#24252b] [&_figcaption]:bg-[#c9ccc0] [&_figcaption]:px-3 [&_figcaption]:py-1 [&_figcaption]:text-[9px] [&_figcaption]:font-black [&_figcaption]:uppercase [&_figure]:my-4 [&_figure]:inline-block [&_figure]:max-w-md [&_figure]:align-top [&_img]:max-h-64 [&_img]:w-auto [&_img]:border-2 [&_img]:border-[#24252b] [&_img]:object-contain [&_li]:ml-6 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc"
        />
      </div>

    </div>
  );
}

function RobotOperator({ message }: { message: string }) {
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    let character = 0;
    let typing: number | undefined;
    const start = window.setTimeout(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTypedMessage(message);
        return;
      }

      setTypedMessage("");
      typing = window.setInterval(() => {
        character += 1;
        setTypedMessage(message.slice(0, character));
        if (character >= message.length && typing) window.clearInterval(typing);
      }, 28);
    }, 0);

    return () => {
      window.clearTimeout(start);
      if (typing) window.clearInterval(typing);
    };
  }, [message]);

  return (
    <div className="hidden h-8 min-w-0 items-center gap-2 sm:flex" aria-live="polite">
      <span className="relative flex size-7 shrink-0 animate-pulse items-center justify-center border-2 border-[#24252b] bg-[#ba0dcb] text-white shadow-[2px_2px_0_#24252b]">
        <MaterialIcon name="smart_toy" size="sm" />
        <span className="absolute -right-1 -top-1 size-2 animate-pulse border border-[#24252b] bg-[#dfe2d3]" />
      </span>
      <span className="flex h-7 min-w-0 items-center border-l-2 border-[#24252b] pl-2 text-[8px] font-black uppercase leading-none tracking-[0.12em] text-[#666961]">
        <span className="shrink-0 text-[#ba0dcb]">OP-04 ›&nbsp;</span><span className="truncate leading-none">{typedMessage}</span><span className="ml-1 inline-block h-3 w-1 shrink-0 animate-pulse bg-[#ba0dcb]" />
      </span>
    </div>
  );
}

function RetroDatePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const initialDate = value ? new Date(`${value}T00:00:00`) : new Date();
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });
  const formatDate = (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div className="mt-3 sm:relative">
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} className={`flex h-11 w-full min-w-0 items-center justify-between gap-2 border-2 border-[#24252b] px-3 text-left text-[9px] font-black uppercase shadow-[2px_2px_0_#777a72] transition hover:bg-white sm:h-14 sm:px-4 sm:text-xs ${open ? "bg-white ring-2 ring-[#ba0dcb]" : "bg-[#dfe2d3]"}`}>
        <span className="min-w-0 truncate">{value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Choose a specific date"}</span>
        <MaterialIcon name={open ? "expand_less" : "calendar_month"} size="sm" />
      </button>
      {open && (
        <div className="absolute inset-0 z-30 flex min-w-0 flex-col border-2 border-[#24252b] bg-[#eceee6] p-2 shadow-[3px_3px_0_#24252b] sm:inset-auto sm:left-auto sm:right-0 sm:top-[calc(100%+8px)] sm:block sm:w-full sm:min-w-[320px] sm:p-3 sm:shadow-[5px_5px_0_#24252b]">
          <div className="mb-2 flex items-center justify-between gap-2 border-b-2 border-[#24252b] pb-2 sm:hidden">
            <span className="min-w-0 truncate text-[9px] font-black uppercase tracking-[0.08em]">{viewDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
            <span className="flex shrink-0 items-center gap-1">
              <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} aria-label="Previous month" className="flex size-7 items-center justify-center border-2 border-[#24252b] bg-[#dfe2d3] hover:bg-white"><MaterialIcon name="chevron_left" size="sm" /></button>
              <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} aria-label="Next month" className="flex size-7 items-center justify-center border-2 border-[#24252b] bg-[#dfe2d3] hover:bg-white"><MaterialIcon name="chevron_right" size="sm" /></button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close calendar" className="flex size-7 items-center justify-center border-2 border-[#24252b] bg-[#24252b] text-[#eceee6] hover:bg-[#555850]"><MaterialIcon name="close" size="sm" /></button>
            </span>
          </div>
          <div className="mb-3 hidden items-center justify-between border-b-2 border-[#24252b] pb-3 sm:flex">
            <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="flex size-9 items-center justify-center border-2 border-[#24252b] bg-[#dfe2d3] font-black hover:bg-white">‹</button>
            <span className="text-[9px] font-black uppercase tracking-[0.08em] sm:text-xs sm:tracking-[0.12em]">{viewDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
            <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="flex size-9 items-center justify-center border-2 border-[#24252b] bg-[#dfe2d3] font-black hover:bg-white">›</button>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-7 gap-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`} className="py-1 text-[8px] font-black text-[#666961]">{day}</span>)}
            {cells.map((day, index) => day ? (
              <button key={day} type="button" onClick={() => { onChange(formatDate(day)); setOpen(false); }} className={`min-h-5 border text-[8px] font-black transition hover:border-[#24252b] hover:bg-[#f2b8f6] sm:aspect-square sm:text-[9px] ${value === formatDate(day) ? "border-[#24252b] !bg-[#ba0dcb] text-white shadow-[2px_2px_0_#24252b]" : `border-transparent ${index % 7 === 0 ? "!bg-[#b9bdb1] sm:!bg-[#dfe2d3]" : "bg-[#dfe2d3]"}`}`}>{day}</button>
            ) : <span key={`empty-${index}`} />)}
          </div>
          {value && <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="mt-2 w-full border-2 border-[#24252b] bg-[#dfe2d3] py-1.5 text-[7px] font-black uppercase hover:bg-white sm:mt-3 sm:py-2 sm:text-[8px]">Clear Date</button>}
        </div>
      )}
    </div>
  );
}

function Panel({ step, title, icon, children, fill = false }: { step?: string; title: string; icon: string; children: ReactNode; fill?: boolean }) {
  return (
    <section className={`${fill ? "flex min-h-0 flex-1 flex-col p-1 sm:p-2" : "min-h-[420px] p-1 sm:p-2"} bg-[#dfe2d3]`} style={fill ? { paddingBottom: 14 } : undefined}>
      <div className={`${fill ? "mb-3 shrink-0" : "mb-5"} flex items-center gap-2 border-b-2 border-[#24252b] pb-3`}>
        {step && <span className="flex size-8 items-center justify-center border-2 border-[#24252b] bg-[#ba0dcb] text-xs font-black text-white shadow-[2px_2px_0_#24252b]">{step}</span>}
        <span className="flex size-8 items-center justify-center border-2 border-[#24252b] bg-[#eceee6]"><MaterialIcon name={icon} size="sm" /></span>
        <h2 className="text-base font-black uppercase tracking-[0.08em] text-[#24252b]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function MissionScrollReview({
  title,
  requestType,
  category,
  designer,
  priority,
  deadline,
  brief,
  references,
  onEditType,
  onEditCategory,
  onEditDesigner,
  onEditMission,
}: {
  title: string;
  requestType: string;
  category: string;
  designer: string;
  priority: string;
  deadline: string;
  brief: string;
  references: ReturnType<typeof extractOddsBriefReferences>;
  onEditType: () => void;
  onEditCategory: () => void;
  onEditDesigner: () => void;
  onEditMission: () => void;
}) {
  return (
    <article className="w-full bg-transparent p-5 font-mono text-sm leading-7 text-[#24252b] sm:p-8">
      <h2 className="break-words text-xl font-bold uppercase leading-8 sm:text-2xl">{title}</h2>
      <p>==============================</p>
      <br />
      <TextFileLine label="TYPE" value={requestType} onEdit={onEditType} />
      <TextFileLine label="CATEGORY" value={category} onEdit={onEditCategory} />
      <TextFileLine label="DESIGNER" value={designer} onEdit={onEditDesigner} />
      <TextFileLine label="PRIORITY" value={priority} onEdit={onEditMission} />
      <TextFileLine label="DEADLINE" value={deadline} onEdit={onEditMission} />
      <br />
      <div className="-mx-2 flex items-start gap-3 px-2 py-1 transition-colors has-[button:hover]:bg-[#24252b]/[0.07]">
        <p className="min-w-0 flex-1">BRIEF:</p>
        <EditMissionButton onClick={onEditMission} />
      </div>
      <p className="mt-1 whitespace-pre-wrap"><BriefWithReferencePreviews brief={brief} references={references} /></p>
      {references.length > 0 && (
        <>
          <br />
          <p>REFERENCES:</p>
          <div className="flex flex-wrap items-center gap-x-2">
            {references.map((reference, index) => {
              const sameTypeBefore = references.slice(0, index).filter((item) => item.type === reference.type).length;
              const alias = `${reference.type.toUpperCase()}-${sameTypeBefore + 1}`;
              return (
                <span key={`${reference.type}-${reference.type === "image" ? reference.attachmentId : reference.url}-${index}`} className="inline-flex items-center gap-2">
                  {index > 0 && <span>,</span>}
                  <ReferenceAliasPreview alias={alias} reference={reference} />
                </span>
              );
            })}
          </div>
        </>
      )}
    </article>
  );
}

function BriefWithReferencePreviews({ brief, references }: { brief: string; references: ReturnType<typeof extractOddsBriefReferences> }) {
  return brief.split(/(\[(?:IMAGE|LINK)-\d+\])/gi).map((part, index) => {
    const match = part.match(/^\[(IMAGE|LINK)-(\d+)\]$/i);
    if (!match) return part;

    const type = match[1].toLowerCase() as "image" | "link";
    const typeIndex = Number(match[2]) - 1;
    const reference = references.filter((item) => item.type === type)[typeIndex];
    if (!reference) return part;

    return <ReferenceAliasPreview key={`${part}-${index}`} alias={`${match[1].toUpperCase()}-${match[2]}`} reference={reference} />;
  });
}

function ReferenceAliasPreview({ alias, reference }: { alias: string; reference: ReturnType<typeof extractOddsBriefReferences>[number] }) {
  const [previewPinned, setPreviewPinned] = useState(false);
  const previewRef = useRef<HTMLButtonElement>(null);
  const labelClass = "mx-0.5 inline-flex border border-[#24252b] bg-[#c9ccc0] px-1.5 py-0.5 align-baseline text-[10px] font-black leading-none text-[#24252b] shadow-[1px_1px_0_#777a72]";

  useEffect(() => {
    if (!previewPinned) return;

    const closeOutside = (event: PointerEvent) => {
      if (!previewRef.current?.contains(event.target as Node)) setPreviewPinned(false);
    };

    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [previewPinned]);

  if (reference.type !== "image") return <span className={labelClass}>{alias}</span>;

  return (
    <button ref={previewRef} type="button" aria-expanded={previewPinned} onClick={() => setPreviewPinned((pinned) => !pinned)} className={`group/reference relative cursor-pointer ${labelClass}`}>
      {alias}
      <span className={`pointer-events-none absolute bottom-[calc(100%+10px)] left-0 z-30 w-56 border-2 border-[#24252b] bg-[#eceee6] p-2 text-[#24252b] shadow-[4px_4px_0_#24252b] ${previewPinned ? "block" : "hidden group-hover/reference:block"}`}>
        <span className="block aspect-video w-full border-2 border-[#24252b] bg-[#c9ccc0] bg-contain bg-center bg-no-repeat [image-rendering:auto]" style={{ backgroundImage: `url("${reference.url}")` }} />
        <span className="mt-2 block truncate text-[9px] font-black uppercase" title={reference.label}>{alias} · {reference.label}</span>
      </span>
    </button>
  );
}

function TextFileLine({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="-mx-2 grid grid-cols-[88px_8px_minmax(0,1fr)_auto] items-start gap-x-2 px-2 py-1 transition-colors has-[button:hover]:bg-[#24252b]/[0.07] sm:grid-cols-[104px_8px_minmax(0,1fr)_auto]">
      <span>{label}</span>
      <span>:</span>
      <span className="min-w-0 break-words">{value}</span>
      <EditMissionButton onClick={onEdit} />
    </div>
  );
}

function EditMissionButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-7 shrink-0 items-center gap-1.5 border-2 border-[#24252b] bg-[#eceee6] px-2.5 text-[9px] font-black uppercase text-[#24252b] shadow-[2px_2px_0_#777a72] transition hover:bg-white hover:text-[#ba0dcb] active:translate-y-0.5 active:shadow-none">
      <MaterialIcon name="edit" size="sm" /> Edit
    </button>
  );
}

function StepActions({ children }: { children: ReactNode }) {
  return <div className="relative bottom-[6px] mt-auto flex shrink-0 flex-wrap items-center justify-end gap-2 border-t-2 border-[#24252b] pt-3">{children}</div>;
}
