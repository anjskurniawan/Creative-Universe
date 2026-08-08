"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { MaterialIcon } from "@/components/ui/material-icon";
import { useAuth } from "@/providers/auth-provider";

interface UserSession {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  last_activity: string;
  is_current: boolean;
}

function validationMessage(error: unknown): string {
  if (error instanceof ValidationError) return Object.values(error.errors).flat()[0] || "Data yang diberikan tidak valid.";
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
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

export default function SecuritySettings() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadSessions = async () => {
      try {
        const data = await apiFetch<UserSession[]>("/profile/sessions");
        if (active) setSessions(data);
      } catch {
        if (active) setSessionError("Gagal memuat sesi perangkat.");
      } finally {
        if (active) setIsLoadingSessions(false);
      }
    };
    if (user) void loadSessions();
    return () => { active = false; };
  }, [user]);

  const revokeSession = async (sessionId: string) => {
    if (!window.confirm("Cabut akses perangkat ini?")) return;
    setSessionError(null);
    setSessionStatus(null);
    try {
      await apiFetch(`/profile/sessions/${sessionId}`, { method: "DELETE" });
      setSessions((items) => items.filter((session) => session.id !== sessionId));
      setSessionStatus("Sesi perangkat berhasil dicabut.");
    } catch (error) {
      setSessionError(validationMessage(error));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-cu-line pb-3 mb-6">
        <h2 className="text-2xl font-semibold text-cu-ink">Perangkat & Sesi</h2>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full max-w-xl">
          <div className="rounded-xl border border-cu-line bg-cu-panel-soft p-5 text-sm leading-relaxed text-cu-muted">
            <div className="flex items-start gap-3">
              <MaterialIcon name="shield" size="sm" className="mt-0.5 shrink-0 text-cu-info" />
              <div>
                <strong className="block text-cu-ink">Autentikasi Doran Login</strong>
                Kata sandi dikelola oleh Doran Login dan tidak dapat diubah dari Creative Universe. Anda tetap dapat meninjau serta mencabut sesi perangkat pada panel ini.
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-80 shrink-0 space-y-4">
          <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2 border-b border-cu-line pb-2">
            <MaterialIcon name="devices" size="sm" className="text-cu-muted" />
            Sesi & Perangkat Aktif
          </h3>
          <p className="text-xs text-cu-muted">Berikut adalah daftar browser dan perangkat yang saat ini mengakses akun Anda.</p>
          {sessionStatus && <div className="rounded-lg border border-cu-success/20 bg-cu-success-soft p-4 text-xs text-cu-success">{sessionStatus}</div>}
          {sessionError && <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-xs text-cu-danger">{sessionError}</div>}
          {isLoadingSessions ? <p className="text-xs text-cu-muted">Memuat sesi...</p> : sessions.length === 0 ? <p className="text-xs text-cu-muted italic">Tidak ada sesi yang tercatat.</p> : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div key={session.id} className="flex flex-col gap-2 p-4 border border-cu-line rounded-xl bg-cu-surface">
                  <div className="min-w-0">
                    <strong className="block text-xs text-cu-ink truncate" title={session.user_agent || ""}>{session.user_agent || "Perangkat tidak dikenal"}</strong>
                    <p className="text-[10px] text-cu-muted mt-1 font-mono">{session.ip_address || "IP tidak tersedia"} • {getRelativeTime(session.last_activity)}</p>
                  </div>
                  <div className="pt-2 border-t border-cu-line/40 flex justify-end">
                    {session.is_current ? <span className="badge bg-cu-success-soft text-cu-success text-[10px] px-2.5 py-1 rounded-full font-bold">Sesi ini</span> : <button type="button" className="inline-flex h-7 items-center justify-center gap-1.5 rounded-full border border-cu-danger bg-transparent px-3 text-[10px] font-semibold text-cu-danger transition duration-200 hover:bg-cu-danger-soft cursor-pointer shrink-0" onClick={() => void revokeSession(session.id)}>Cabut Sesi</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
