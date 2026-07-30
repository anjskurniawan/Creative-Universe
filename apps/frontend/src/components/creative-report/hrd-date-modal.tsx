"use client";

import React from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type HrdDateKey = "leave" | "appPermission" | "absence" | "late";

export type ActiveDateAction = {
  assessmentId: number;
  key: HrdDateKey;
  index: number;
  dateStr: string;
};

export type HrdDateModalProps = {
  activeDateAction: ActiveDateAction | null;
  formatDateShort: (dateStr: string) => string;
  onUpdateDate: (assessmentId: number, key: HrdDateKey, index: number, newDateStr: string) => void;
  onDeleteDate: (assessmentId: number, key: HrdDateKey, index: number) => void;
  onClose: () => void;
};

export function HrdDateModal({
  activeDateAction,
  formatDateShort,
  onUpdateDate,
  onDeleteDate,
  onClose,
}: HrdDateModalProps) {
  if (!activeDateAction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-80 rounded-2xl bg-white p-5 shadow-xl border border-slate-100 text-slate-800">
        <h3 className="text-sm font-bold text-slate-800 mb-2">Kelola Riwayat Tanggal</h3>
        <p className="text-xs text-slate-500 mb-4">
          Tanggal terpilih: <b className="text-slate-700">{formatDateShort(activeDateAction.dateStr)}</b>
        </p>
        
        <div className="space-y-3">
          <label className="block text-[11px] font-bold text-slate-600">Ganti Tanggal:</label>
          <input
            type="date"
            value={activeDateAction.dateStr}
            onChange={(e) => {
              if (e.target.value) {
                onUpdateDate(
                  activeDateAction.assessmentId,
                  activeDateAction.key,
                  activeDateAction.index,
                  e.target.value
                );
                onClose();
              }
            }}
            className="w-full h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:border-[#00a4ff] outline-none"
          />
        </div>

        <div className="mt-5 flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => {
              onDeleteDate(
                activeDateAction.assessmentId,
                activeDateAction.key,
                activeDateAction.index
              );
              onClose();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
          >
            <MaterialIcon name="delete" size="auto" className="text-sm" />
            Hapus
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-500 hover:bg-slate-200 transition cursor-pointer"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
