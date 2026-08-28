"use client";

import { useEffect, useState } from "react";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { MaterialIcon } from "@/components/ui/MaterialIcon/MaterialIcon";
import { useAuth } from "@/hooks/auth";
import { Card } from "@react-spectrum/s2/Card";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };

interface UserSession {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  last_activity: string;
  is_current: boolean;
}

function validationMessage(error: unknown): string {
  if (error instanceof ValidationError)
    return Object.values(error.errors).flat()[0] || "Data yang diberikan tidak valid.";
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

export default function SecuritySessionPage() {
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
    return () => {
      active = false;
    };
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
    <>
      <div className="space-y-4">
        {sessionStatus && (
          <div className="rounded-xl border border-cu-success/20 bg-cu-success-soft p-4 text-xs text-cu-success shadow-sm">
            {sessionStatus}
          </div>
        )}
        {sessionError && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs text-cu-danger shadow-sm">
            {sessionError}
          </div>
        )}
        {isLoadingSessions ? null : sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-cu-line bg-white/55 p-8 text-center shadow-sm">
            <MaterialIcon name="devices" size="md" className="mx-auto text-cu-muted" />
            <p className="mt-3 text-sm font-medium text-cu-ink">Tidak ada sesi yang tercatat.</p>
            <p className="mt-1 text-xs text-cu-muted">Perangkat yang aktif akan muncul di sini.</p>
          </div>
        ) : (
          <div className="grid w-full grid-cols-4 gap-4">
            {sessions.map((session) => (
              <Card
                key={session.id}
                textValue={session.user_agent || "Perangkat tidak dikenal"}
                styles={style({ width: "100%" })}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cu-panel-soft text-cu-muted transition-transform duration-300 group-hover:scale-105">
                    <MaterialIcon name="computer" size="sm" />
                  </span>
                  {session.is_current ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-cu-success-soft px-2.5 py-1 text-[10px] font-bold text-cu-success">
                      <span className="size-1.5 rounded-full bg-cu-success" />
                      Sesi ini
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-cu-danger/40 bg-transparent px-3 text-[10px] font-semibold text-cu-danger transition-colors duration-200 hover:bg-cu-danger-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cu-danger"
                      onClick={() => void revokeSession(session.id)}
                    >
                      <MaterialIcon name="logout" size="xs" />
                      Cabut
                    </button>
                  )}
                </div>
                <div className="mt-5 min-w-0 border-t border-cu-line/70 pt-4">
                  <strong
                    className="block truncate text-sm font-semibold text-cu-ink"
                    title={session.user_agent || ""}
                  >
                    {session.user_agent || "Perangkat tidak dikenal"}
                  </strong>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-cu-muted">
                    <span className="inline-flex items-center gap-1">
                      <MaterialIcon name="language" size="xs" />
                      {session.ip_address || "IP tidak tersedia"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MaterialIcon name="schedule" size="xs" />
                      {getRelativeTime(session.last_activity)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
