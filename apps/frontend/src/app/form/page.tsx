"use client";

import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import { apiFetch, ValidationError } from "@/core/api/client";
import { ParallaxBackground } from "@/features/auth/components/ParallaxBackground";
import { playCardEntrance } from "@/features/auth/components/Login";

const totalSteps = 5;
const initialValues = { name: "", division: "", problems: "", suggestions: "", satisfaction: 1 };

export default function FormPage() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(-1);
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [celebrate, setCelebrate] = useState(false);

  useLayoutEffect(() => {
    let tween: gsap.core.Tween | undefined;
    const frame = requestAnimationFrame(() => { if (cardRef.current) tween = playCardEntrance(cardRef.current); });
    return () => { cancelAnimationFrame(frame); tween?.kill(); };
  }, []);

  const update = (key: keyof typeof values, value: string | number) => setValues((current) => ({ ...current, [key]: value }));
  const next = () => {
    const requiredFields: Record<number, [keyof typeof values, string]> = {
      0: ["name", "Nama wajib diisi."],
      1: ["division", "Divisi wajib diisi."],
      2: ["problems", "Kendala/problem wajib diisi."],
      3: ["suggestions", "Masukan/saran wajib diisi."],
    };
    const requiredField = requiredFields[step];
    if (requiredField && typeof values[requiredField[0]] === "string" && !String(values[requiredField[0]]).trim()) {
      setError(requiredField[1]);
      return;
    }
    setError("");
    setStep((current) => Math.min(current + 1, totalSteps - 1));
  };
  const back = () => setStep((current) => Math.max(current - 1, -1));
  const submit = async (event?: FormEvent) => {
    event?.preventDefault(); setSaving(true); setError("");
    try {
      await apiFetch("/internal-client-feedback", { method: "POST", body: JSON.stringify({ ...values, name: String(values.name).trim(), division: String(values.division).trim(), satisfaction: Number(values.satisfaction) }) });
      setSubmitted(true);
    } catch (cause) {
      if (cause instanceof ValidationError) {
        setError(Object.values(cause.errors).flat().join(" ") || "Data belum valid.");
      } else {
        setError(cause instanceof Error ? cause.message : "Gagal menyimpan feedback.");
      }
    }
    finally { setSaving(false); }
  };

  const field = step === 0 ? <label className="block text-sm font-medium">Nama<input autoFocus required value={values.name} onChange={(e) => update("name", e.target.value)} className="mt-3 h-12 w-full rounded-lg border border-[#dbe4e8] px-3 outline-none transition focus:border-[#6d46eb]" /></label>
    : step === 1 ? <label className="block text-sm font-medium">Divisi<input autoFocus required value={values.division} onChange={(e) => update("division", e.target.value)} className="mt-3 h-12 w-full rounded-lg border border-[#dbe4e8] px-3 outline-none transition focus:border-[#6d46eb]" /></label>
    : step === 2 ? <label className="block text-sm font-medium">Apakah ada kendala/problem yang tengah dihadapi dengan tim Creative?<textarea autoFocus value={values.problems} onChange={(e) => update("problems", e.target.value)} className="mt-3 min-h-32 w-full resize-none rounded-lg border border-[#dbe4e8] p-3 outline-none transition focus:border-[#6d46eb]" placeholder="Jelaskan sedetail mungkin" /></label>
    : step === 3 ? <label className="block text-sm font-medium">Apakah ada masukan/saran untuk perbaikan tim Creative bulan depan?<textarea autoFocus value={values.suggestions} onChange={(e) => update("suggestions", e.target.value)} className="mt-3 min-h-32 w-full resize-none rounded-lg border border-[#dbe4e8] p-3 outline-none transition focus:border-[#6d46eb]" placeholder="Boleh lebih dari 1" /></label>
    : <label className="block text-sm font-medium">Dalam skala 1 - 10, seberapa puas kamu dengan kinerja tim Creative bulan ini?<div className="mt-8 text-center"><output className="text-6xl font-bold text-[#6d46eb]">{values.satisfaction}</output><p className="mt-2 text-xs text-[#7b868a]">1 = sangat tidak puas · 10 = sangat puas</p></div><input aria-label="Skala kepuasan 1 sampai 10" type="range" min="1" max="10" step="1" value={values.satisfaction} onChange={(e) => { const value = Number(e.target.value); update("satisfaction", value); setCelebrate(value >= 8); }} className="mt-8 h-2 w-full cursor-pointer appearance-none rounded-full bg-[#dbe4e8] accent-[#6d46eb]" /><div className="mt-2 flex justify-between text-xs text-[#7b868a]"><span>1</span><span>10</span></div></label>;

  return <main data-login-hero className="cu-style relative min-h-screen overflow-hidden bg-cu-surface font-sans text-dark"><ParallaxBackground />{celebrate && <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 overflow-hidden">{Array.from({ length: 18 }, (_, index) => <span key={index} className="absolute text-xl" style={{ left: `${5 + ((index * 17) % 90)}%`, animation: `confettiFall ${1.4 + (index % 4) * 0.2}s ease-out forwards`, animationDelay: `${(index % 5) * 0.05}s` }}>{["🎉", "✨", "💜", "⭐"][index % 4]}</span>)}</div>}<div className="relative z-10 flex min-h-screen w-full items-center justify-center px-5 py-10"><div ref={cardRef} className="w-full max-w-[430px] will-change-transform"><section className="rounded-t-[32px] bg-white px-7 py-8 shadow-2xl md:rounded-[28px] md:px-9 md:py-10">{submitted ? <div className="animate-fade-in py-10 text-center"><h1 className="text-2xl font-bold text-[#33255d]">Terima kasih</h1><p className="mt-2 text-sm text-[#7b868a]">Feedback Anda berhasil dikirim.</p></div> : step === -1 ? <div className="animate-fade-in py-8 text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6d46eb]">Creative Report</p><h1 className="mt-5 text-3xl font-bold leading-tight text-[#33255d]">INTERNAL CLIENT<br />FEEDBACK</h1><p className="mt-5 text-sm leading-6 text-[#7b868a]">Program penilaian dari berbagai divisi di Doran untuk menilai kinerja, kualitas layanan, serta output tim Creative.</p><button type="button" onClick={next} className="mt-8 w-full rounded-lg bg-[#6d46eb] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#5b35d9]">Mulai Penilaian</button></div> : <div onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }} className="animate-fade-in"><div className="mb-8"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6d46eb]">Pertanyaan {step + 1} dari {totalSteps}</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#edf0f3]"><div className="h-full rounded-full bg-[#6d46eb] transition-all duration-500" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} /></div></div><div className="min-h-[230px]">{field}</div>{error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mt-8 flex gap-3"><button type="button" onClick={back} className="flex-1 rounded-lg border border-[#dbe4e8] px-4 py-3 text-sm font-semibold">Kembali</button>{step < totalSteps - 1 ? <button type="button" onClick={next} className="flex-1 rounded-lg bg-[#6d46eb] px-4 py-3 text-sm font-semibold text-white">Lanjut</button> : <button type="button" onClick={() => void submit()} disabled={saving} className="flex-1 rounded-lg bg-[#6d46eb] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Mengirim..." : "Kirim feedback"}</button>}</div></div>}</section></div></div><style dangerouslySetInnerHTML={{ __html: "@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in{animation:fadeIn .35s cubic-bezier(.16,1,.3,1) forwards}@keyframes confettiFall{0%{top:-8%;opacity:1;transform:rotate(0) scale(1)}100%{top:105%;opacity:0;transform:rotate(540deg) scale(.7)}}" }} /></main>;
}
