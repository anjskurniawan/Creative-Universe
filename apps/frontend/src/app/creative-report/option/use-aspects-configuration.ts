"use client";

import { useEffect, useState } from "react";
import {
  useCreativeReportSettings,
  saveCreativeReportSettings,
  type CreativeReportAspect,
  type CreativeReportAspectGroupTitles,
} from "@/features/creative-report/settings";

export function useAspectsConfiguration() {
  // --- STATE DEFINITIONS ---
  
  // Aspek kolaboratif (bobot penilaian 30%)
  const [collab, setCollab] = useState<CreativeReportAspect[]>([]);
  
  // Aspek performa (bobot penilaian 50%)
  const [perf, setPerf] = useState<CreativeReportAspect[]>([]);
  
  // Judul grup masing-masing aspek
  const [groupTitles, setGroupTitles] = useState<CreativeReportAspectGroupTitles>({ collab: "", perf: "" });
  
  // Indeks aspek terpilih untuk detail card
  const [detailAspectIndexes, setDetailAspectIndexes] = useState<number[]>([0, 1, 2, 3, 4]);
  
  // Status keberhasilan penyimpanan konfigurasi
  const [success, setSuccess] = useState(false);
  
  // Mengambil settings dan fungsi setter-nya dari context sub-app
  const { settings, setSettings } = useCreativeReportSettings();

  // --- INITIAL LOAD EFFECT ---
  
  // Sinkronisasi data state lokal dengan settings global ketika settings berubah
  useEffect(() => {
    setCollab(settings.collabAspects);
    setPerf(settings.perfAspects);
    setGroupTitles(settings.groupTitles);
    setDetailAspectIndexes(settings.detailCardAspectIndexes);
  }, [settings]);

  // --- VALIDATION & CALCULATIONS ---
  
  // Hitung total poin maksimal aspek kolaboratif
  const totalCollab = collab.reduce((sum, item) => sum + (item.maxPoints || 0), 0);
  
  // Hitung total poin maksimal aspek performa
  const totalPerf = perf.reduce((sum, item) => sum + (item.maxPoints || 0), 0);

  // Validasi: Jumlah total aspek kolaboratif wajib sama dengan 30
  const isCollabValid = totalCollab === 30;
  
  // Validasi: Jumlah total aspek performa wajib sama dengan 50
  const isPerfValid = totalPerf === 50;
  
  // Status validasi form secara keseluruhan
  const isValid =
    isCollabValid &&
    isPerfValid &&
    Boolean(groupTitles.collab.trim()) &&
    Boolean(groupTitles.perf.trim());

  // --- ACTIONS & UPDATE HANDLERS ---

  // Simpan seluruh konfigurasi aspek ke database lokal & global state
  const handleSave = async () => {
    if (!isValid) return;
    const nextSettings = {
      collabAspects: collab,
      perfAspects: perf,
      groupTitles,
      detailCardAspectIndexes: detailAspectIndexes,
    };
    await saveCreativeReportSettings(nextSettings);
    setSettings(nextSettings);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Update properti aspek kolaboratif pada indeks tertentu
  const updateCollab = (
    index: number,
    key: keyof CreativeReportAspect,
    value: string | number
  ) => {
    setCollab((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [key]: key === "maxPoints" ? Math.max(0, Number(value) || 0) : value,
            }
          : item
      )
    );
  };

  // Update properti aspek performa pada indeks tertentu
  const updatePerf = (
    index: number,
    key: keyof CreativeReportAspect,
    value: string | number
  ) => {
    setPerf((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [key]: key === "maxPoints" ? Math.max(0, Number(value) || 0) : value,
            }
          : item
      )
    );
  };

  return {
    collab,
    setCollab,
    perf,
    setPerf,
    groupTitles,
    setGroupTitles,
    detailAspectIndexes,
    setDetailAspectIndexes,
    success,
    setSuccess,
    totalCollab,
    totalPerf,
    isCollabValid,
    isPerfValid,
    isValid,
    handleSave,
    updateCollab,
    updatePerf,
  };
}
