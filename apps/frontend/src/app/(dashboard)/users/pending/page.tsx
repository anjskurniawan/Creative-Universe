"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MaterialIcon } from "@/components/material-icon";
import { SettingsLayout } from "@/components/settings-layout";
import {
  errorMessage,
  formatDate,
  initials,
  ManagedUser,
  PaginatedResponse,
  UserManagementOptions,
} from "@/lib/admin";
import { apiFetch } from "@/lib/api";
import { getEchoClient } from "@/lib/echo";
import { useAuth } from "@/providers/auth-provider";

export default function PendingUsersPage() {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Record<number, string>>({});
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [busyUser, setBusyUser] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const latestRequest = useRef(0);

  const loadPending = useCallback(async (quiet = false) => {
    const requestId = ++latestRequest.current;
    if (!quiet) setIsLoading(true);
    try {
      const result = await apiFetch<PaginatedResponse<ManagedUser>>(
        `/users/pending?page=${page}&per_page=10`
      );
      if (requestId === latestRequest.current) {
        setUsers(result.data);
        setLastPage(result.meta.last_page);
        setTotal(result.meta.total);
      }
    } catch (requestError) {
      if (!quiet && requestId === latestRequest.current) setError(errorMessage(requestError));
    } finally {
      if (requestId === latestRequest.current) setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!hasPermission("approve-users")) return;

    const loadInitialData = async () => {
      try {
        const options = await apiFetch<UserManagementOptions>("/users/options");
        setRoles(options.roles);
      } catch (requestError) {
        setError(errorMessage(requestError));
      }
      await loadPending();
    };

    void loadInitialData();
  }, [hasPermission, loadPending]);

  useEffect(() => {
    if (!hasPermission("approve-users")) return;

    const echo = getEchoClient();
    if (!echo) return;

    const channelName = "admin.notifications";
    const eventName = ".PendingUserRegistered";
    const channel = echo.private(channelName);
    const refreshPendingUsers = () => void loadPending(true);

    channel.listen(eventName, refreshPendingUsers);

    return () => {
      channel.stopListening(eventName, refreshPendingUsers);
      echo.leave(channelName);
    };
  }, [hasPermission, loadPending]);

  if (!hasPermission("approve-users")) {
    return (
      <div className="rounded-2xl border border-cu-danger/20 bg-cu-danger-soft p-8 text-center">
        <MaterialIcon name="lock" size="lg" className="mx-auto text-cu-danger" />
        <h1 className="mt-3 text-lg font-semibold">Akses ditolak</h1>
        <p className="mt-1 text-sm text-cu-muted">Anda tidak memiliki permission approve-users.</p>
      </div>
    );
  }

  const approve = async (user: ManagedUser) => {
    const role = selectedRoles[user.id];
    if (!role) {
      setError(`Pilih role untuk ${user.name} terlebih dahulu.`);
      return;
    }

    setBusyUser(user.id);
    setError(null);
    try {
      await apiFetch(`/users/${user.id}/approve`, {
        method: "POST",
        body: JSON.stringify({ role }),
      });
      setNotice(`Akun ${user.name} telah disetujui sebagai ${role}.`);
      setSelectedRoles((current) => {
        const next = { ...current };
        delete next[user.id];
        return next;
      });
      await loadPending();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusyUser(null);
    }
  };

  const reject = async (user: ManagedUser) => {
    if (!window.confirm(`Akun ${user.name} akan ditolak dan dihapus. Lanjutkan?`)) return;

    setBusyUser(user.id);
    setError(null);
    try {
      await apiFetch(`/users/${user.id}/reject`, { method: "POST" });
      setNotice(`Akun ${user.name} telah ditolak.`);
      await loadPending();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setBusyUser(null);
    }
  };

  return (
    <SettingsLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="border-b border-cu-line pb-3 mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cu-muted">Administrasi Core</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-cu-ink">Persetujuan Registrasi</h2>
            {total > 0 && (
              <span className="rounded-full border border-cu-warning/20 bg-cu-warning-soft px-2.5 py-1 text-xs font-bold text-cu-warning">
                {total} menunggu
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-cu-muted">Daftar diperbarui real-time melalui Pusher.</p>
        </div>

      {notice && <Alert tone="success" message={notice} onClose={() => setNotice(null)} />}
      {error && <Alert tone="error" message={error} onClose={() => setError(null)} />}

      {isLoading ? (
        <div className="rounded-2xl border border-cu-line bg-cu-surface p-12 text-center text-sm text-cu-muted">
          Memuat antrean pendaftaran...
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-cu-line bg-cu-surface p-12 text-center shadow-sm">
          <MaterialIcon name="how_to_reg" size="xl" className="mx-auto text-cu-soft" />
          <h2 className="mt-3 text-base font-semibold text-cu-ink">Antrean sudah bersih</h2>
          <p className="mt-1 text-sm text-cu-muted">Tidak ada akun yang menunggu persetujuan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((pendingUser) => (
            <article key={pendingUser.id} className="rounded-2xl border border-cu-line bg-cu-surface p-5 shadow-sm">
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className={`flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cu-line ${pendingUser.avatar_url ? "bg-white" : "bg-cu-panel-soft"}`}>
                    {pendingUser.avatar_url ? (
                      <Image unoptimized width={48} height={48} src={pendingUser.avatar_url} alt={pendingUser.name} className="size-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-cu-muted">{initials(pendingUser.name)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-cu-ink">{pendingUser.name}</h2>
                    <p className="mt-0.5 text-sm text-cu-muted">@{pendingUser.username} · {pendingUser.email}</p>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cu-muted">
                      <span>WhatsApp: <strong className="font-medium text-cu-ink">{pendingUser.whatsapp_number || "-"}</strong></span>
                      <span>Mendaftar: <strong className="font-medium text-cu-ink">{formatDate(pendingUser.created_at, true)}</strong></span>
                    </div>
                    {pendingUser.registration_note && (
                      <div className="mt-3 rounded-lg border border-cu-line bg-cu-panel-soft p-3">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-cu-muted">Catatan registrasi</p>
                        <p className="mt-1 text-sm text-cu-ink">{pendingUser.registration_note}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2 md:w-60">
                  <select
                    value={selectedRoles[pendingUser.id] || ""}
                    onChange={(event) => setSelectedRoles((current) => ({ ...current, [pendingUser.id]: event.target.value }))}
                    disabled={busyUser === pendingUser.id}
                    className="h-10 rounded-lg border border-cu-border bg-cu-surface px-3 text-sm outline-none focus:border-cu-ink"
                  >
                    <option value="">Pilih Role</option>
                    {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                  <button type="button" onClick={() => void approve(pendingUser)} disabled={busyUser === pendingUser.id} className="btn bg-cu-success text-white hover:bg-cu-success-hover">
                    <MaterialIcon name="check" size="sm" />
                    {busyUser === pendingUser.id ? "Memproses..." : "Setujui Akun"}
                  </button>
                  <button type="button" onClick={() => void reject(pendingUser)} disabled={busyUser === pendingUser.id} className="btn border border-cu-danger/30 bg-cu-danger-soft text-cu-danger hover:bg-cu-danger hover:text-white">
                    <MaterialIcon name="close" size="sm" /> Tolak Akun
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {lastPage > 1 && (
        <div className="flex items-center justify-between text-xs text-cu-muted">
          <span>Halaman {page} dari {lastPage}</span>
          <div className="flex gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn btn-secondary">Sebelumnya</button>
            <button type="button" disabled={page >= lastPage} onClick={() => setPage(page + 1)} className="btn btn-secondary">Berikutnya</button>
          </div>
        </div>
        )}
      </div>
    </SettingsLayout>
  );
}

function Alert({ tone, message, onClose }: { tone: "success" | "error"; message: string; onClose: () => void }) {
  return (
    <div className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${tone === "success" ? "border-cu-success/20 bg-cu-success-soft text-cu-success" : "border-cu-danger/20 bg-cu-danger-soft text-cu-danger"}`}>
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Tutup"><MaterialIcon name="close" size="xs" /></button>
    </div>
  );
}
