"use client";

import { type FormEvent, useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";
import { type OddsCategory, type OddsDesignerProfile, type OddsTaskAttachment } from "@/features/odds/api";
import { stripRichText } from "@/components/odds-rich-text-editor";

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

export type ModernWizardProps = {
  theme: "light" | "dark" | "retro";
  currentStep: number;
  setCurrentStep: (step: number) => void;
  form: TaskForm;
  update: (field: keyof TaskForm, value: string) => void;
  categories: OddsCategory[];
  selectedCategory: OddsCategory | undefined;
  selectableDesigners: OddsDesignerProfile[];
  todayCapacity: number;
  selectedDesigner: OddsDesignerProfile | undefined;
  recommendedDesignerId?: string | null;
  uploadedAttachments: OddsTaskAttachment[];
  uploadingAttachments: boolean;
  addAttachmentFiles: (files: FileList | null) => Promise<any[]>;
  onRemoveAttachment: (id: number) => void;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  submit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
};

const steps = [
  { step: 1, label: "Format", desc: "Medium" },
  { step: 2, label: "Kategori", desc: "Kebutuhan" },
  { step: 3, label: "Talent", desc: "Desainer" },
  { step: 4, label: "Brief", desc: "Detail Ide" },
  { step: 5, label: "Review", desc: "Kirim" }
];

const dateFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-CA");
};

export function ModernWizard({
  theme,
  currentStep,
  setCurrentStep,
  form,
  update,
  categories,
  selectedCategory,
  selectableDesigners,
  todayCapacity,
  selectedDesigner,
  recommendedDesignerId,
  uploadedAttachments,
  uploadingAttachments,
  addAttachmentFiles,
  onRemoveAttachment,
  loading,
  initializing,
  error,
  submit,
}: ModernWizardProps) {
  const dark = theme === "dark";

  // Search filter for Category step
  const [categorySearch, setCategorySearch] = useState("");
  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categories, categorySearch]);

  // Mini-step tracking for Step 4
  const [miniStep, setMiniStep] = useState(1);


  // Design Tokens matching Pattern_KV_Retail_Performance_Themes.md
  const containerClass = dark
    ? "bg-[#111413]/90 border border-white/10 shadow-2xl backdrop-blur-md rounded-3xl"
    : "bg-white/90 border border-[#BDEAFF] shadow-[0_16px_48px_rgba(4,4,74,0.08)] backdrop-blur-md rounded-3xl";

  const panelClass = dark
    ? "bg-[#171717] border border-white/5 rounded-2xl p-6"
    : "bg-[#F3FAFF] border border-[#BDEAFF] rounded-2xl p-6";

  const innerSurfaceClass = dark
    ? "bg-[#0E0E0E] rounded-2xl p-4 border border-white/5"
    : "bg-white rounded-2xl p-4 border border-[#BDEAFF]/60 shadow-sm";

  const emptySurfaceClass = dark
    ? "border border-dashed border-white/10 bg-transparent rounded-2xl p-4 opacity-40"
    : "border border-dashed border-[#BDEAFF] bg-transparent rounded-2xl p-4 opacity-50";

  const textTitle = dark ? "text-[#F1F1F1]" : "text-[#04044A]";
  const textBody = dark ? "text-[#B9B9B9]" : "text-[#04044A]/80";
  const textMuted = dark ? "text-[#B9B9B9]/60" : "text-[#04044A]/50";
  
  const inputClass = `w-full rounded-2xl border px-4 py-3 text-sm focus:outline-none transition ${
    dark
      ? "bg-[#0E0E0E] border-white/10 text-white focus:border-[#B0FF5E] focus:ring-1 focus:ring-[#B0FF5E]"
      : "bg-white border-[#BDEAFF] text-[#04044A] focus:border-[#00A4FF] focus:ring-1 focus:ring-[#00A4FF]"
  }`;

  const primaryBtnClass = `inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
    dark
      ? "bg-[#B0FF5E] text-[#181818] hover:bg-[#9ee54f] shadow-[0_4px_20px_rgba(176,255,94,0.25)]"
      : "bg-[#00A4FF] text-white hover:bg-[#008be5] shadow-[0_4px_20px_rgba(0,164,255,0.25)]"
  }`;

  const secondaryBtnClass = `inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold transition ${
    dark
      ? "bg-white/10 text-white hover:bg-white/20 border border-white/5"
      : "bg-[#F3FAFF] text-[#00A4FF] hover:bg-[#DFF6FF] border border-[#BDEAFF]"
  }`;



  const canGoNext = useMemo(() => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return !!form.category_id;
    if (currentStep === 3) return !!form.preferred_designer_id;
    if (currentStep === 4) {
      if (miniStep === 1) return !!form.design_purpose.trim();
      if (miniStep === 2) return true;
      if (miniStep === 3) return true;
      if (miniStep === 4) return !!stripRichText(form.brief_text).trim();
    }
    return true;
  }, [currentStep, miniStep, form]);

  const handleNextStep = () => {
    if (!canGoNext) return;
    if (currentStep === 4) {
      if (miniStep < 4) {
        setMiniStep(miniStep + 1);
      } else {
        setCurrentStep(5);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 4) {
      if (miniStep > 1) {
        setMiniStep(miniStep - 1);
      } else {
        setCurrentStep(3);
      }
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const tomorrowDate = useMemo(() => dateFromNow(1), []);
  const threeDaysDate = useMemo(() => dateFromNow(3), []);

  if (initializing) {
    return (
      <div className={`flex flex-col flex-1 items-center justify-center min-h-[500px] p-8 text-center relative overflow-hidden ${containerClass}`}>
        {/* Accent top line */}
        <span className={`absolute top-0 inset-x-0 h-1.5 ${
          dark ? "bg-[#B0FF5E]" : "bg-[#00A4FF]"
        }`} />
        
        {/* Loading lines background decorative */}
        <span className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05] [background:repeating-linear-gradient(0deg,transparent_0,transparent_3px,#000_4px)] dark:[background:repeating-linear-gradient(0deg,transparent_0,transparent_3px,#fff_4px)]" />

        <div className="relative z-10 flex flex-col items-center max-w-sm">
          <div className={`p-4 rounded-3xl animate-bounce mb-6 ${
            dark ? "bg-[#B0FF5E]/10 text-[#B0FF5E]" : "bg-[#00A4FF]/10 text-[#00A4FF]"
          }`}>
            <MaterialIcon name="satellite_alt" size="lg" className="animate-spin text-4xl" />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-[0.25em] ${textMuted}`}>Mengunduh Data ODDS</span>
          <h2 className={`mt-3 text-2xl font-extrabold tracking-tight ${textTitle}`}>Menghubungkan Ke Core...</h2>
          
          {/* Custom Modern Loading bits */}
          <div className="mt-8 flex gap-1.5 w-48 h-2 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full rounded-full animate-pulse w-full ${
              dark ? "bg-[#B0FF5E]" : "bg-[#00A4FF]"
            }`} style={{ animationDuration: "1.5s" }} />
          </div>
          <p className={`mt-5 text-[10px] font-medium animate-pulse ${textMuted}`}>Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full flex-col flex-1 min-h-0 ${dark ? "text-[#F1F1F1]" : "text-[#04044A]"}`}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-semibold tracking-tight ${textTitle}`}>Buat Request Baru</h1>
          <p className={`text-xs mt-1 ${textMuted}`}>Penuhi kebutuhan desain visual Anda melalui ODDS</p>
        </div>
        <Link href="/odds" className={secondaryBtnClass}>
          <MaterialIcon name="arrow_back" size="auto" className="text-lg" />
          <span>Kembali</span>
        </Link>
      </div>

      {/* Stepper Progress */}
      <div className={`mb-6 p-5 ${containerClass} overflow-x-auto`}>
        <div className="flex min-w-[600px] items-center justify-between">
          {steps.map((s, idx) => {
            const isCompleted = currentStep > s.step;
            const isActive = currentStep === s.step;
            return (
              <div key={s.step} className="flex flex-1 items-center last:flex-none">
                <button
                  type="button"
                  onClick={() => {
                    if (s.step === 4) setMiniStep(1);
                    if (s.step < currentStep) setCurrentStep(s.step);
                  }}
                  disabled={s.step > currentStep}
                  className="flex items-center gap-3 text-left focus:outline-none disabled:cursor-not-allowed group"
                >
                  <div
                    className={`flex size-9 items-center justify-center rounded-2xl text-xs font-bold transition-all duration-300 ${
                      isCompleted
                        ? dark
                          ? "bg-[#B0FF5E] text-[#181818] shadow-[0_0_12px_rgba(176,255,94,0.3)]"
                          : "bg-[#00A4FF] text-white shadow-[0_0_12px_rgba(0,164,255,0.3)]"
                        : isActive
                          ? dark
                            ? "bg-[#B0FF5E]/20 text-[#B0FF5E] border-2 border-[#B0FF5E]"
                            : "bg-[#00A4FF]/10 text-[#00A4FF] border-2 border-[#00A4FF]"
                          : dark
                            ? "bg-[#0E0E0E] border border-white/10 text-slate-500"
                            : "bg-white border border-[#BDEAFF] text-[#04044A]/40"
                    }`}
                  >
                    {isCompleted ? <MaterialIcon name="check" size="auto" className="text-sm font-bold" /> : s.step}
                  </div>
                  <div>
                    <p className={`text-xs font-bold tracking-tight transition-colors ${isActive ? textTitle : textMuted}`}>
                      {s.label}
                    </p>
                    <p className="text-[10px] opacity-60 leading-none mt-0.5">{s.desc}</p>
                  </div>
                </button>
                {idx < steps.length - 1 && (
                  <div
                    className={`mx-4 h-0.5 flex-1 rounded-full transition-all duration-300 ${
                      isCompleted
                        ? dark
                          ? "bg-[#B0FF5E]"
                          : "bg-[#00A4FF]"
                        : dark
                          ? "bg-white/10"
                          : "bg-[#BDEAFF]/50"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/5 p-4 text-sm text-red-500">
          <MaterialIcon name="error_outline" size="auto" className="mt-0.5 text-lg shrink-0" />
          <span>Error: {error}</span>
        </div>
      )}

      {/* Split Grid */}
      <form
        onSubmit={submit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && currentStep < 5) {
            const target = e.target as HTMLElement;
            if (target.tagName !== "TEXTAREA" && !target.isContentEditable) {
              e.preventDefault();
              handleNextStep();
            }
          }
        }}
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] flex-1 min-h-0"
      >
        {/* Form Body */}
        <div className={`p-6 sm:p-8 ${containerClass} flex flex-col min-h-[480px]`}>
          
          {/* STEP 1: Format Medium */}
          {currentStep === 1 && (
            <div className="space-y-5 flex-1 flex flex-col">
              <div>
                <h2 className={`text-xl font-bold tracking-tight ${textTitle}`}>Pilih Format Medium</h2>
                <p className={`text-xs ${textMuted} mt-0.5`}>Pilih jenis request visual yang ingin diajukan</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 flex-1 min-h-0">
                <button
                  type="button"
                  className={`group relative flex h-full flex-col items-start p-6 rounded-3xl border-2 text-left transition-all duration-300 ${
                    dark
                      ? "border-[#B0FF5E] bg-[#B0FF5E]/5 shadow-[0_8px_32px_rgba(176,255,94,0.08)] hover:bg-[#B0FF5E]/10"
                      : "border-[#00A4FF] bg-[#00A4FF]/5 shadow-[0_8px_32px_rgba(0,164,255,0.08)] hover:bg-[#00A4FF]/10"
                  }`}
                >
                  <div className={`absolute top-4 right-4 flex size-6 items-center justify-center rounded-full text-white shadow-md ${dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF]"}`}>
                    <MaterialIcon name="check" size="auto" className="text-xs font-bold" />
                  </div>
                  <div className={`p-4 rounded-2xl ${dark ? "bg-[#B0FF5E]/15 text-[#B0FF5E]" : "bg-[#00A4FF]/15 text-[#00A4FF]"}`}>
                    <MaterialIcon name="brush" size="lg" />
                  </div>
                  <h3 className={`font-bold text-lg mt-6 ${textTitle}`}>Graphic Design</h3>
                  <p className={`text-xs mt-2 leading-relaxed ${textBody}`}>Kebutuhan publikasi media sosial, banner promosi toko, brosur, materi marketing, ilustrasi, dll.</p>
                </button>

                <button
                  type="button"
                  disabled
                  className="relative flex h-full flex-col items-start p-6 rounded-3xl border border-dashed text-left opacity-35 cursor-not-allowed bg-black/[0.01] dark:bg-white/[0.01] border-black/10 dark:border-white/10"
                >
                  <div className="p-4 rounded-2xl bg-black/5 text-slate-400 dark:bg-white/5 dark:text-slate-500">
                    <MaterialIcon name="videocam" size="lg" />
                  </div>
                  <h3 className="font-bold text-lg mt-6 text-slate-400 dark:text-slate-500">Video Request</h3>
                  <span className="mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase bg-black/10 text-slate-400 dark:bg-white/10 dark:text-slate-500">
                    Segera Hadir
                  </span>
                  <p className="text-xs mt-2 leading-relaxed text-slate-400 dark:text-slate-500">Video editing, re-edit short video feed/reels/tiktok, serta basic motion graphic.</p>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Category */}
          {currentStep === 2 && (
            <div className="space-y-5 flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className={`text-xl font-bold tracking-tight ${textTitle}`}>Pilih Kategori Desain</h2>
                  <p className={`text-xs ${textMuted} mt-0.5`}>Pilih kategori spesifik yang mewakili request Anda</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <span className="absolute left-3.5 top-3 text-slate-400"><MaterialIcon name="search" size="xs" /></span>
                  <input
                    type="text"
                    placeholder="Cari kategori..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className={`pl-10 ${inputClass}`}
                  />
                </div>
              </div>

              {filteredCategories.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Kategori tidak ditemukan.</div>
              ) : (
                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 max-h-[420px] overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {filteredCategories.map((cat) => {
                    const isSelected = form.category_id === String(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => update("category_id", String(cat.id))}
                        className={`group relative p-4 pl-6 rounded-2xl border text-left transition-all duration-200 overflow-hidden flex items-center justify-between ${
                          isSelected
                            ? dark
                              ? "border-[#B0FF5E] bg-[#B0FF5E]/10 text-white"
                              : "border-[#00A4FF] bg-[#00A4FF]/5 text-[#00A4FF]"
                            : dark
                              ? "border-white/5 bg-[#171717] text-[#B9B9B9] hover:border-white/20"
                              : "border-[#BDEAFF] bg-[#F3FAFF]/40 text-[#04044A] hover:border-[#00A4FF]"
                        }`}
                      >
                        {/* Left visual accent bar */}
                        <span className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
                          isSelected
                            ? dark ? "bg-[#B0FF5E]" : "bg-[#00A4FF]"
                            : "bg-transparent"
                        }`} />
                        <span className="font-semibold text-xs truncate mr-2">{cat.name}</span>
                        {isSelected && <MaterialIcon name="check_circle" size="auto" className={`text-lg shrink-0 ${dark ? "text-[#B0FF5E]" : "text-[#00A4FF]"}`} />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Designer */}
          {currentStep === 3 && (
            <div className="space-y-5 flex-1 flex flex-col">
              <div>
                <h2 className={`text-xl font-bold tracking-tight ${textTitle}`}>Pilih Talent Desainer</h2>
                <p className={`text-xs ${textMuted} mt-0.5`}>Pilih desainer profesional untuk mengerjakan tugas ini</p>
              </div>

              {selectableDesigners.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-sm text-slate-400">Tidak ada desainer tersedia untuk kategori ini.</div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 max-h-[420px] overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {selectableDesigners.map((profile) => {
                    const isSelected = form.preferred_designer_id === String(profile.user_id);
                    const capacity = capacityLabel(profile, todayCapacity);
                    const isOff = profile.status === "off";
                    const isRecommended = recommendedDesignerId === String(profile.user_id);

                    // Workload calculation for display meter
                    const capacityMinutes = todayCapacity || 420;
                    const pointsFilled = Math.min(profile.current_load_minutes || 0, capacityMinutes);
                    const percentage = (pointsFilled / capacityMinutes) * 100;

                    return (
                      <button
                        key={profile.user_id}
                        type="button"
                        onClick={() => update("preferred_designer_id", String(profile.user_id))}
                        className={`relative p-5 rounded-3xl border-2 text-left transition-all duration-300 flex items-start gap-4 ${
                          isSelected
                            ? dark
                              ? "border-[#B0FF5E] bg-[#B0FF5E]/5 shadow-[0_8px_24px_rgba(176,255,94,0.08)]"
                              : "border-[#00A4FF] bg-[#00A4FF]/5 shadow-[0_8px_24px_rgba(0,164,255,0.08)]"
                            : dark
                              ? "border-white/5 bg-[#171717] hover:border-white/20"
                              : "border-[#BDEAFF] bg-[#F3FAFF]/40 hover:border-[#00A4FF]"
                        }`}
                      >
                        {/* Recommended Badge */}
                        {isRecommended && (
                          <span className={`absolute top-3 right-3 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                          }`}>
                            Paling Cocok
                          </span>
                        )}

                        <div className={`size-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                          dark
                            ? "bg-[#121614] text-[#B0FF5E] border border-[#B0FF5E]/30"
                            : "bg-gradient-to-tr from-[#00A4FF] to-[#00E7EF] text-white"
                        }`}>
                          {profile.user?.name.charAt(0).toUpperCase() ?? "D"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className={`font-bold text-sm truncate ${textTitle}`}>{profile.user?.name}</h4>
                          
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isOff
                                ? "bg-red-500/15 text-red-500"
                                : dark
                                  ? "bg-[#B0FF5E]/15 text-[#B0FF5E]"
                                  : "bg-[#00A4FF]/15 text-[#00A4FF]"
                            }`}>
                              {isOff ? "Off" : "Tersedia"}
                            </span>

                            <span className={`text-[9px] font-semibold ${
                              capacity === "Full Load Today" ? "text-red-500" : "text-green-500"
                            }`}>
                              {capacity === "Full Load Today" ? "Penuh Hari Ini" : "Kapasitas OK"}
                            </span>
                          </div>

                          {/* Capacity progress meter */}
                          <div className="mt-3.5">
                            <div className="flex items-center justify-between text-[9px] mb-1">
                              <span className={textMuted}>Kapasitas Harian</span>
                              <span className="font-semibold">{capacityMinutes} Menit</span>
                            </div>
                            <div className="w-full h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  dark ? "bg-[#B0FF5E]" : "bg-[#00A4FF]"
                                }`}
                                style={{ width: `${Math.max(percentage, 15)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Brief Details (Split into 4 sub-steps) */}
          {currentStep === 4 && (
            <div className="space-y-5 flex-1 flex flex-col min-h-0">
              {/* Mini step Header */}
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-3">
                <div>
                  <h2 className={`text-xl font-bold tracking-tight ${textTitle}`}>Detail Request Brief</h2>
                  <p className={`text-xs ${textMuted} mt-0.5`}>Lengkapi rincian kebutuhan desain secara bertahap</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  dark ? "bg-white/5 text-[#B0FF5E]" : "bg-[#F3FAFF] text-[#00A4FF] border border-[#BDEAFF]"
                }`}>
                  Langkah Brief {miniStep} / 4
                </span>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                {/* Mini Step 1: Purpose (Tujuan) */}
                {miniStep === 1 && (
                  <div className="space-y-5 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
                    <div className="text-center sm:text-left">
                      <h3 className={`text-lg font-semibold ${textTitle}`}>Tujuan / Judul Request</h3>
                      <p className={`text-xs ${textMuted} mt-1`}>Beri nama deskriptif untuk request visual Anda (misal: campaign promo, posting rutin)</p>
                    </div>
                    <div>
                      <input
                        id="purpose"
                        type="text"
                        placeholder="Contoh: Feed Promo Gajian Doran Gadget"
                        value={form.design_purpose}
                        onChange={(e) => update("design_purpose", e.target.value)}
                        className={inputClass}
                        autoFocus
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Mini Step 2: Priority (Prioritas) */}
                {miniStep === 2 && (
                  <div className="space-y-5 flex-1 flex flex-col justify-center w-full">
                    <div className="text-center sm:text-left">
                      <h3 className={`text-lg font-semibold ${textTitle}`}>Skala Prioritas</h3>
                      <p className={`text-xs ${textMuted} mt-1`}>Pilih tingkat urgensi pengerjaan tugas desain ini</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        { value: "normal", label: "Normal", desc: "SLA standar antrean biasa", icon: "schedule" },
                        { value: "high", label: "Penting (High)", desc: "Dikerjakan lebih awal", icon: "priority_high" },
                        { value: "urgent", label: "Mendesak (Urgent)", desc: "Prioritas utama tim kreatif", icon: "flash_on" },
                      ].map((opt) => {
                        const isChosen = form.important_matrix === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => update("important_matrix", opt.value)}
                            className={`p-5 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between min-h-[140px] ${
                              isChosen
                                ? dark
                                  ? "border-[#B0FF5E] bg-[#B0FF5E]/10 text-white"
                                  : "border-[#00A4FF] bg-[#00A4FF]/5 text-[#00A4FF]"
                                : dark
                                  ? "border-white/5 bg-[#171717] hover:border-white/10"
                                  : "border-[#BDEAFF] bg-[#F3FAFF]/40 hover:border-[#00A4FF]"
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className={`p-2 rounded-xl ${isChosen ? (dark ? "bg-[#B0FF5E]/20 text-[#B0FF5E]" : "bg-[#00A4FF]/25 text-[#00A4FF]") : "bg-black/5 dark:bg-white/5"}`}>
                                <MaterialIcon name={opt.icon} size="auto" className="text-sm font-bold" />
                              </span>
                              {isChosen && <MaterialIcon name="check_circle" size="auto" className="text-lg" />}
                            </div>
                            <div>
                              <h4 className={`font-bold text-xs ${textTitle}`}>{opt.label}</h4>
                              <p className={`text-[10px] mt-1 leading-normal ${textBody}`}>{opt.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mini Step 3: Deadline */}
                {miniStep === 3 && (
                  <div className="space-y-5 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
                    <div className="text-center sm:text-left">
                      <h3 className={`text-lg font-semibold ${textTitle}`}>Tenggat Waktu / Deadline</h3>
                      <p className={`text-xs ${textMuted} mt-1`}>Pilih tenggat waktu pengerjaan. Kami akan otomatis menjadwalkan jika dikosongkan.</p>
                    </div>

                    <div className="grid gap-3 grid-cols-2">
                      <button
                        type="button"
                        onClick={() => update("deadline", tomorrowDate)}
                        className={`p-4 rounded-2xl border text-center transition-all ${
                          form.deadline === tomorrowDate
                            ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                            : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
                        }`}
                      >
                        <span className="block text-xs font-bold">Besok</span>
                        <span className="text-[10px] opacity-75">{tomorrowDate}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => update("deadline", threeDaysDate)}
                        className={`p-4 rounded-2xl border text-center transition-all ${
                          form.deadline === threeDaysDate
                            ? dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
                            : dark ? "bg-white/5 hover:bg-white/10" : "bg-[#F3FAFF] hover:bg-[#DFF6FF] border-[#BDEAFF]"
                        }`}
                      >
                        <span className="block text-xs font-bold">+3 Hari</span>
                        <span className="text-[10px] opacity-75">{threeDaysDate}</span>
                      </button>
                    </div>

                    <div className="relative">
                      <label htmlFor="custom-deadline" className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-400">Atur Tanggal Kustom</label>
                      <input
                        id="custom-deadline"
                        type="date"
                        value={form.deadline}
                        onChange={(e) => update("deadline", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {/* Mini Step 4: WYSIWYG Brief Editor */}
                {miniStep === 4 && (
                  <div className="space-y-3 flex-1 flex flex-col min-h-0">
                    <label className="block text-xs font-bold mb-1">Deskripsi Ide / Brief Detail</label>
                    <ModernBriefEditor
                      value={form.brief_text}
                      onChange={(value) => update("brief_text", value)}
                      onUploadImage={async (files) => {
                        const uploaded = await addAttachmentFiles(files);
                        return uploaded || [];
                      }}
                      dark={dark}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Review & Kirim */}
          {currentStep === 5 && (
            <div className="space-y-6 flex-1 flex flex-col min-h-0">
              <div>
                <h2 className={`text-xl font-bold tracking-tight ${textTitle}`}>Tinjau Request Anda</h2>
                <p className={`text-xs ${textMuted} mt-0.5`}>Pastikan semua informasi sudah lengkap dan benar sebelum mengirim</p>
              </div>

              {/* Obsidian-style Preview Panel */}
              <div className="p-8 bg-white border border-slate-200 shadow-md rounded-2xl flex-1 flex flex-col min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="max-w-2xl mx-auto w-full space-y-6 font-mono text-xs">
                  
                  {/* Obsidian Document Header / File Name */}
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 text-slate-400">
                    <MaterialIcon name="description" size="auto" className="text-sm" />
                    <span>{form.design_purpose ? `${form.design_purpose.toLowerCase().replace(/\s+/g, "-")}.md` : "untitled-request.md"}</span>
                  </div>

                  {/* Obsidian Properties (YAML Frontmatter Style) */}
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3 font-sans">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1.5 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <MaterialIcon name="tune" size="auto" className="text-xs" />
                        <span>Properties / Frontmatter</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="text-slate-400 hover:text-[#00A4FF] transition"
                        title="Edit Properties"
                      >
                        <MaterialIcon name="edit" size="auto" className="text-xs" />
                      </button>
                    </div>

                    <div className="space-y-2 text-slate-600">
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-400 font-medium">medium</span>
                        <span className="col-span-2 font-semibold text-slate-900">Graphic Design</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-400 font-medium">category</span>
                        <span className="col-span-2 font-semibold text-slate-900">{selectedCategory?.name || "-"}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-400 font-medium">designer</span>
                        <span className="col-span-2 font-semibold text-slate-900">{selectedDesigner?.user?.name || "-"}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-400 font-medium">deadline</span>
                        <span className="col-span-2 font-semibold text-slate-900">{form.deadline || "Otomatis"}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-slate-400 font-medium">priority</span>
                        <span className={`col-span-2 font-semibold capitalize ${
                          form.important_matrix === "urgent" ? "text-red-500 font-bold" : form.important_matrix === "high" ? "text-orange-500 font-bold" : "text-slate-900"
                        }`}>{form.important_matrix}</span>
                      </div>
                    </div>
                  </div>

                  {/* Main Obsidian Document Content */}
                  <div className="space-y-4 pt-2 font-sans">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                        # {form.design_purpose || "Request Tanpa Judul"}
                      </h1>
                      <button
                        type="button"
                        onClick={() => { setMiniStep(4); setCurrentStep(4); }}
                        className="text-slate-400 hover:text-[#00A4FF] transition"
                        title="Edit Content"
                      >
                        <MaterialIcon name="edit" size="auto" className="text-sm" />
                      </button>
                    </div>

                    <div className="prose max-w-none text-sm leading-relaxed text-slate-800">
                      <div
                        className="min-h-[160px] overflow-y-visible pr-1 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_a]:font-bold [&_a]:text-[#00A4FF] [&_a]:underline [&_figure]:my-6 [&_img]:max-h-72 [&_img]:w-auto [&_img]:rounded-xl [&_img]:border [&_img]:border-slate-100 [&_img]:shadow-md [&_figcaption]:text-center [&_figcaption]:text-xs [&_figcaption]:text-slate-400 [&_figcaption]:mt-2"
                        dangerouslySetInnerHTML={{ __html: form.brief_text || "Tidak ada rincian brief." }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {/* Stepper Actions Footer */}
          <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5 flex justify-between">
            {currentStep > 1 ? (
              <button type="button" onClick={handlePrevStep} className={secondaryBtnClass}>
                <MaterialIcon name="chevron_left" size="auto" className="text-lg" />
                <span>Sebelumnya</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                key="next-btn"
                type="button"
                disabled={!canGoNext}
                onClick={handleNextStep}
                className={primaryBtnClass}
              >
                <span>Lanjutkan</span>
                <MaterialIcon name="chevron_right" size="auto" className="text-lg" />
              </button>
            ) : (
              <button
                key="submit-btn"
                type="submit"
                disabled={loading || initializing || uploadingAttachments}
                className={primaryBtnClass}
              >
                <MaterialIcon name="send" size="auto" className="text-lg" />
                <span>{loading ? "Mengirim..." : "Kirim Request"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Premium Preview Summary Panel (Visual Request Ticket) */}
        <div className={`p-6 ${containerClass} flex flex-col relative overflow-hidden`}>
          {/* Decorative Top Accent Bar */}
          <span className={`absolute top-0 inset-x-0 h-1.5 ${
            dark ? "bg-[#B0FF5E]" : "bg-gradient-to-r from-[#00A4FF] to-[#00E7EF]"
          }`} />

          <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/5 pb-4">
            <div className={`p-2 rounded-xl ${dark ? "bg-white/5 text-[#B0FF5E]" : "bg-[#F3FAFF] text-[#00A4FF]"}`}>
              <MaterialIcon name="receipt_long" size="auto" className="text-lg" />
            </div>
            <h3 className={`text-sm font-bold tracking-tight ${textTitle}`}>
              Tiket Request
            </h3>
          </div>

          <div className="mt-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Medium */}
              <div className={innerSurfaceClass}>
                <span className={`block text-[9px] font-bold uppercase tracking-wider ${textMuted}`}>Medium</span>
                <span className={`text-xs font-bold mt-1 block ${textTitle}`}>
                  {form.request_type ? "Graphic Design" : "Belum ditentukan"}
                </span>
              </div>

              {/* Kategori Desain */}
              {form.category_id ? (
                <div className={innerSurfaceClass}>
                  <span className={`block text-[9px] font-bold uppercase tracking-wider ${textMuted}`}>Kategori Desain</span>
                  <span className={`text-xs font-bold mt-1 block ${textTitle}`}>
                    {selectedCategory?.name || "-"}
                  </span>
                </div>
              ) : (
                <div className={emptySurfaceClass}>
                  <span className={`block text-[9px] font-bold uppercase tracking-wider ${textMuted}`}>Kategori Desain</span>
                  <span className="text-[10px] font-medium mt-1 block text-slate-400 dark:text-slate-500 italic">
                    Belum dipilih (Langkah 2)
                  </span>
                </div>
              )}

              {/* Desainer Pilihan */}
              {form.preferred_designer_id ? (
                <div className={innerSurfaceClass}>
                  <span className={`block text-[9px] font-bold uppercase tracking-wider ${textMuted}`}>Desainer Pilihan</span>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <div className={`size-6 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      dark
                        ? "bg-[#121614] text-[#B0FF5E] border border-[#B0FF5E]/30"
                        : "bg-gradient-to-tr from-[#00A4FF] to-[#00E7EF] text-white"
                    }`}>
                      {selectedDesigner?.user?.name.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <span className={`text-xs font-bold truncate ${textTitle}`}>
                      {selectedDesigner?.user?.name || "-"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className={emptySurfaceClass}>
                  <span className={`block text-[9px] font-bold uppercase tracking-wider ${textMuted}`}>Desainer Pilihan</span>
                  <span className="text-[10px] font-medium mt-1 block text-slate-400 dark:text-slate-500 italic">
                    Belum dipilih (Langkah 3)
                  </span>
                </div>
              )}

              {/* Tujuan Request */}
              {form.design_purpose.trim() ? (
                <div className={innerSurfaceClass}>
                  <span className={`block text-[9px] font-bold uppercase tracking-wider ${textMuted}`}>Tujuan Request</span>
                  <p className={`text-xs font-bold truncate mt-1 ${textTitle}`}>
                    {form.design_purpose}
                  </p>
                </div>
              ) : (
                <div className={emptySurfaceClass}>
                  <span className={`block text-[9px] font-bold uppercase tracking-wider ${textMuted}`}>Tujuan Request</span>
                  <span className="text-[10px] font-medium mt-1 block text-slate-400 dark:text-slate-500 italic">
                    Belum diisi (Langkah 4)
                  </span>
                </div>
              )}

              {/* Optional values (Priority & Attachments) */}
              {(uploadedAttachments.length > 0 || form.important_matrix !== "normal") && (
                <div className="grid grid-cols-2 gap-3">
                  {form.important_matrix !== "normal" && (
                    <div className={innerSurfaceClass}>
                      <span className={`block text-[9px] font-bold uppercase tracking-wider ${textMuted}`}>Prioritas</span>
                      <span className={`text-xs font-bold mt-1 block capitalize ${
                        form.important_matrix === "urgent" ? "text-red-500" : "text-orange-500"
                      }`}>
                        {form.important_matrix}
                      </span>
                    </div>
                  )}
                  {uploadedAttachments.length > 0 && (
                    <div className={innerSurfaceClass}>
                      <span className={`block text-[9px] font-bold uppercase tracking-wider ${textMuted}`}>Lampiran</span>
                      <span className={`text-xs font-bold mt-1 block ${textTitle}`}>
                        {uploadedAttachments.length} Aset
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dotted Ticket Divider */}
            <div className="my-6 border-t-2 border-dashed border-black/5 dark:border-white/10 relative">
              <span className={`absolute -left-7 -top-2.5 size-5 rounded-full border-r ${
                dark ? "bg-[#111413] border-white/5" : "bg-[#F3FAFF] border-slate-200"
              }`} />
              <span className={`absolute -right-7 -top-2.5 size-5 rounded-full border-l ${
                dark ? "bg-[#111413] border-white/5" : "bg-[#F3FAFF] border-slate-200"
              }`} />
            </div>

            {/* Ticket Footer Status */}
            <div className="flex items-center justify-between">
              <div className="text-left">
                <span className={`block text-[9px] font-bold uppercase tracking-wider ${textMuted}`}>Status Pengajuan</span>
                <span className={`text-[10px] font-bold flex items-center gap-1.5 mt-0.5 ${
                  currentStep === 5 ? "text-green-500" : textBody
                }`}>
                  <span className={`size-1.5 rounded-full ${currentStep === 5 ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
                  Langkah {currentStep} / 5
                </span>
              </div>
              <MaterialIcon name="qr_code_2" size="auto" className="text-3xl opacity-20" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function ModernBriefEditor({
  value,
  onChange,
  onUploadImage,
  dark,
}: {
  value: string;
  onChange: (value: string) => void;
  onUploadImage: (files: FileList | null) => Promise<OddsTaskAttachment[]>;
  dark: boolean;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const savedRangeRef = useRef<Range | null>(null);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const isEmpty = !stripRichText(value);

  // Sync value with contenteditable div
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value) {
      editor.innerHTML = value;
    }
  }, [value]);

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

  const toolbarBtnClass = `flex size-8 shrink-0 items-center justify-center rounded-lg border transition ${
    dark
      ? "border-white/10 bg-[#0E0E0E] text-[#B9B9B9] hover:bg-white/10"
      : "border-[#BDEAFF] bg-white text-[#04044A] hover:bg-[#DFF6FF]"
  }`;

  const activeBtnClass = dark
    ? "bg-[#B0FF5E] text-[#181818] border-[#B0FF5E] hover:bg-[#B0FF5E]"
    : "bg-[#00A4FF] text-white border-[#00A4FF] hover:bg-[#00A4FF]";

  const inputClass = `h-8 min-w-0 flex-1 rounded-lg border px-2 text-xs outline-none transition ${
    dark
      ? "bg-[#0E0E0E] border-white/10 text-white focus:border-[#B0FF5E]"
      : "bg-white border-[#BDEAFF] text-[#04044A] focus:border-[#00A4FF]"
  }`;

  const linkInsertBtnClass = `flex h-8 items-center justify-center gap-1 rounded-lg px-3 text-[10px] font-bold transition disabled:opacity-50 ${
    dark ? "bg-[#B0FF5E] text-[#181818]" : "bg-[#00A4FF] text-white"
  }`;

  return (
    <div className={`flex flex-col min-h-0 flex-1 rounded-2xl border overflow-hidden ${
      dark ? "border-white/10 bg-[#171717]" : "border-[#BDEAFF] bg-white shadow-sm"
    }`}>
      {/* Editor Toolbar */}
      <div className={`flex items-center justify-between border-b p-2 ${
        dark ? "border-white/10 bg-[#0E0E0E]" : "border-[#BDEAFF] bg-[#F3FAFF]"
      }`}>
        <div ref={toolbarRef} className="flex flex-wrap gap-1 items-center">
          {tools.map((tool) => {
            const isPressed = activeTools.includes(tool.command);
            return (
              <button
                key={tool.command}
                type="button"
                title={tool.label}
                aria-label={tool.label}
                aria-pressed={isPressed}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => runCommand(tool.command)}
                className={`${toolbarBtnClass} ${isPressed ? activeBtnClass : ""}`}
              >
                <MaterialIcon name={tool.icon} size="sm" />
              </button>
            );
          })}
          <span className={`w-px h-5 mx-1 ${dark ? "bg-white/10" : "bg-[#BDEAFF]"}`} />
          <button
            type="button"
            title="Clear formatting"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => runCommand("removeFormat")}
            className={toolbarBtnClass}
          >
            <MaterialIcon name="format_clear" size="sm" />
          </button>
          <button
            type="button"
            title="Insert link"
            onMouseDown={(event) => { event.preventDefault(); rememberSelection(); }}
            onClick={() => setLinkPanelOpen((open) => !open)}
            className={`${toolbarBtnClass} ${linkPanelOpen ? activeBtnClass : ""}`}
          >
            <MaterialIcon name="link" size="sm" />
          </button>
          <label title="Insert image" className={`${toolbarBtnClass} cursor-pointer`}>
            <MaterialIcon name={imageUploading ? "hourglass_top" : "image"} size="sm" className={imageUploading ? "animate-spin" : ""} />
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              disabled={imageUploading}
              onChange={(event) => void insertImages(event.target.files)}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* Link Input Panel */}
      {linkPanelOpen && (
        <div className={`flex items-center gap-2 border-b p-2 ${
          dark ? "border-white/10 bg-[#0E0E0E]" : "border-[#BDEAFF] bg-[#F3FAFF]"
        }`}>
          <MaterialIcon name="link" size="sm" className="opacity-60" />
          <input
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && (event.preventDefault(), insertLink())}
            placeholder="https://figma.com/..."
            className={inputClass}
            autoFocus
          />
          <button
            type="button"
            onClick={insertLink}
            disabled={!linkUrl.trim()}
            className={linkInsertBtnClass}
          >
            <MaterialIcon name="check" size="sm" />
            <span>Link</span>
          </button>
          <button
            type="button"
            onClick={() => setLinkPanelOpen(false)}
            className={toolbarBtnClass}
          >
            <MaterialIcon name="close" size="sm" />
          </button>
        </div>
      )}

      {/* Editor Input Area */}
      <div className="relative flex-1 min-h-0">
        {isEmpty && (
          <span className={`pointer-events-none absolute left-4 top-4 z-10 text-xs font-semibold select-none ${
            dark ? "text-slate-500" : "text-slate-400"
          }`}>
            Tulis kebutuhan desain, ukuran, copy teks, channel, dan output final...
          </span>
        )}
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
            document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
          }}
          className={`h-full overflow-y-auto p-4 text-sm leading-6 outline-none transition [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            dark
              ? "bg-[#0E0E0E] text-white [caret-color:#B0FF5E] focus:bg-[#0a0a0a]"
              : "bg-white text-[#04044A] [caret-color:#00A4FF] focus:bg-white"
          } [&_a]:font-bold [&_a]:text-[#00A4FF] dark:[&_a]:text-[#B0FF5E] [&_a]:underline [&_figcaption]:bg-black/20 dark:[&_figcaption]:bg-white/5 [&_figcaption]:px-3 [&_figcaption]:py-1 [&_figcaption]:text-[9px] [&_figcaption]:font-bold [&_figure]:my-4 [&_figure]:inline-block [&_figure]:max-w-md [&_figure]:align-top [&_img]:max-h-64 [&_img]:w-auto [&_img]:rounded-xl [&_img]:border [&_img]:border-black/10 dark:[&_img]:border-white/5 [&_img]:object-contain [&_li]:ml-6 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc`}
        />
      </div>
    </div>
  );
}

function capacityLabel(profile: OddsDesignerProfile, todayCapacity: number): string {
  const todayStr = new Date().toLocaleDateString("en-CA");
  if (profile.leave_dates?.includes(todayStr)) return "Sedang Cuti";
  if (profile.current_load_minutes >= todayCapacity) return "Full Load Today";
  return "Available";
}
