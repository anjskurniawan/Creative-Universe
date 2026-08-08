"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/core/api/client";
import { MaterialIcon } from "@/components/ui/material-icon";
import { useAuth } from "@/providers/auth-provider";

interface ActivityItem {
  id: number;
  log_name: string | null;
  description: string;
  event: string;
  created_at: string | null;
  properties?: { ip?: string };
}

function getRelativeTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "Baru saja";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit yang lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;
    return date.toLocaleDateString("id-ID");
  } catch {
    return "";
  }
}

function getActionName(item: ActivityItem): string {
  switch (item.event) {
    case "created": return "Membuat data";
    case "updated": return "Memperbarui data";
    case "deleted": return "Menghapus data";
    case "login": return "Melakukan login";
    default: return item.description.charAt(0).toUpperCase() + item.description.slice(1);
  }
}

function getLogLabel(logName: string | null): string {
  if (!logName) return "Sistem";
  switch (logName) {
    case "core-user": return "Profil Pengguna";
    case "auth": return "Otorisasi";
    case "pricetag": return "Pricetag Generator";
    default: return logName.charAt(0).toUpperCase() + logName.slice(1);
  }
}

function getNodeColorClass(event: string): string {
  switch (event) {
    case "created": return "bg-cu-success text-white border-cu-success";
    case "deleted": return "bg-cu-danger text-white border-cu-danger";
    case "login": return "bg-cu-info text-white border-cu-info";
    default: return "bg-cu-ink text-cu-surface border-cu-line";
  }
}

function getIconName(event: string): string {
  switch (event) {
    case "login": return "login";
    case "created": return "add";
    case "deleted": return "delete";
    default: return "edit";
  }
}

export default function ActivityLog() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadActivities = async () => {
      setIsLoadingActivities(true);
      setActivitiesError(null);
      try {
        const data = await apiFetch<ActivityItem[]>("/profile/activities");
        if (active) setActivities(data);
      } catch {
        if (active) setActivitiesError("Gagal memuat jejak aktivitas.");
      } finally {
        if (active) setIsLoadingActivities(false);
      }
    };
    if (user) void loadActivities();
    return () => { active = false; };
  }, [user]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-cu-line pb-3 mb-6"><h2 className="text-2xl font-semibold text-cu-ink">Riwayat Aktivitas Keamanan</h2></div>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full space-y-6 max-w-xl relative bg-transparent py-4">
          {activities.length > 1 && <span className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-cu-line" aria-hidden="true" />}
          {isLoadingActivities ? <p className="text-sm text-cu-muted text-center py-4">Memuat log aktivitas...</p> : activitiesError ? <p className="text-sm text-cu-danger text-center py-4">{activitiesError}</p> : activities.length === 0 ? <p className="text-sm text-cu-muted text-center py-4 italic">Belum ada catatan riwayat aktivitas terdaftar.</p> : (
            activities.map((activity) => (
              <div key={activity.id} className="relative pl-9 pb-1 flex items-start gap-4">
                <span className={`absolute left-0 top-0.5 size-6 rounded-full border flex items-center justify-center shrink-0 ${getNodeColorClass(activity.event)}`}><MaterialIcon name={getIconName(activity.event)} size="xs" /></span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-cu-ink">{getActionName(activity)} pada <strong className="text-xs font-semibold uppercase tracking-wider text-cu-muted">{getLogLabel(activity.log_name)}</strong></p>
                  <p className="text-xs text-cu-muted mt-0.5">{getRelativeTime(activity.created_at || "")}{activity.properties?.ip && ` • IP: ${activity.properties.ip}`}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2 border-b border-cu-line pb-2"><MaterialIcon name="verified_user" size="sm" className="text-cu-muted" />Jejak Audit Keamanan</h3>
          <p className="text-xs text-cu-muted">Sistem mencatat aktivitas penting demi keamanan akun Anda.</p>
          <div className="p-4 border border-cu-line rounded-xl bg-cu-surface space-y-3 text-xs leading-relaxed text-cu-muted">
            <div className="flex gap-2"><MaterialIcon name="info" size="xs" className="text-cu-info shrink-0 mt-0.5" /><p>Mencatat riwayat login, perubahan profil, modifikasi password, dan pengaturan peran secara otomatis.</p></div>
            <div className="flex gap-2 pt-2.5 border-t border-cu-line/60"><MaterialIcon name="shield" size="xs" className="text-cu-success shrink-0 mt-0.5" /><p>Dilengkapi pencatatan alamat IP perangkat untuk mendeteksi anomali akses mencurigakan.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
