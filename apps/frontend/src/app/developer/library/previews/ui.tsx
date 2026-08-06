"use client";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { SpinningWheel } from "@/components/ui/spinning-wheel";
import { StatCard } from "@/components/ui/stat-card";
import { ActionCard } from "@/components/ui/action-card";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Toast } from "@/components/ui/toast";
import { CustomDatePicker } from "@/components/ui/custom-date-picker";

const frame = "contents";
export function MaterialIconPreview() { return <div className={frame}>{["home","favorite","settings","notifications","face"].map((icon) => <div key={icon} className="mx-3 flex flex-col items-center gap-1"><MaterialIcon name={icon} size="lg" /><span className="text-[10px] text-slate-400">{icon}</span></div>)}</div>; }
export function SpinningWheelPreview() { return <div className={frame}><SpinningWheel /></div>; }
export function StatCardPreview() { return <div className={frame}><div className="w-64"><StatCard title="Statistik Pengguna" value="1,248" icon="groups" iconBgClass="bg-[#ede9fe]" iconColorClass="text-[#6d46eb]" borderHoverClass="hover:border-[#6d46eb]/30" /></div></div>; }
export function ActionCardPreview() { return <div className={frame}><div className="w-64"><ActionCard title="Unduh Laporan" description="Ekspor statistik laporan ini ke berkas dokumen PDF secara instan." icon="download" href="#" /></div></div>; }
export function ConfirmModalPreview() { const [open,setOpen]=useState(false); return <div className={frame}><button type="button" onClick={()=>setOpen(true)} className="rounded-xl bg-[#6d46eb] px-4 py-2 text-xs font-semibold text-white">Buka Confirm Modal</button>{open && <ConfirmModal title="Konfirmasi Tindakan" message="Apakah Anda yakin ingin mengeksekusi operasi ini?" onConfirm={()=>setOpen(false)} onClose={()=>setOpen(false)} />}</div>; }
export function CustomDatePickerPreview() { const [date,setDate]=useState("2026-08-06"); return <div className={frame}><div className="w-64"><CustomDatePicker value={date} onChange={setDate} placeholder="Pilih tanggal..." /></div></div>; }
export function ToastPreview() { return <div className={frame}><div><Toast status="success" message="Operasi data berhasil diselesaikan!" onClose={()=>{}} /><Toast status="error" message="Gagal menyimpan perubahan ke server." onClose={()=>{}} /></div></div>; }
