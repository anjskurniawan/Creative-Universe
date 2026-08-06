"use client";

import React, { FormEvent, ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { ManagedUserDetail, UserManagementOptions, formatDate } from "@/core/admin";
import type { UserFormState } from "@/app/(core)/panel/users/use-users";

interface UserDetailModalProps {
  selected: ManagedUserDetail;
  form: UserFormState;
  setForm: React.Dispatch<React.SetStateAction<UserFormState>>;
  options: UserManagementOptions | null;
  isSaving: boolean;
  isDeleting: boolean;
  modalError: string | null;
  setModalError: (error: string | null) => void;
  isRoot: boolean;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  onDeleteClick: () => void;
  onRevokeSession: (sessionId: string) => void;
}

export function UserDetailModal({
  selected,
  form,
  setForm,
  options,
  isSaving,
  isDeleting,
  modalError,
  setModalError,
  isRoot,
  onSave,
  onClose,
  onDeleteClick,
  onRevokeSession,
}: UserDetailModalProps) {
  const toggleArrayValue = (field: "roles" | "permissions" | "applications", value: string) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
    }));
  };

  return (
    <Modal title="Kelola Akun Pengguna" onClose={onClose} wide={selected.can_view_audit}>
      <form onSubmit={onSave}>
        <div className={`grid gap-6 p-6 ${selected.can_view_audit ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
          <div className="min-w-0 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-cu-ink">{selected.user.name}</h3>
              <p className="text-xs text-cu-muted">
                @{selected.user.username} · {selected.user.email}
              </p>
            </div>

            {modalError && (
              <div className="rounded-xl border border-cu-danger/20 bg-cu-danger-soft px-4 py-3 text-xs text-cu-danger font-semibold">
                {modalError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama lengkap">
                <input
                  required
                  value={form.name || ""}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="form-input"
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={form.email || ""}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="form-input"
                />
              </Field>
              <Field label="Nomor WhatsApp">
                <input
                  value={form.whatsapp_number || ""}
                  onChange={(event) => setForm({ ...form, whatsapp_number: event.target.value })}
                  placeholder="62812..."
                  className="form-input"
                />
              </Field>
              <Field label="Password baru">
                <input
                  type="password"
                  value={form.password || ""}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  placeholder="Kosongkan jika tidak diubah"
                  className="form-input"
                />
              </Field>
              <Field label="Konfirmasi password">
                <input
                  type="password"
                  value={form.password_confirmation || ""}
                  onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })}
                  className="form-input"
                />
              </Field>
            </div>

            <CheckboxGroup
              title="Peran (Roles)"
              items={options?.roles || []}
              selected={form.roles}
              onToggle={(value) => toggleArrayValue("roles", value)}
            />
            
            <CheckboxGroup
              title="Akses Sub-Aplikasi"
              items={(options?.applications || []).map((application) => application.key)}
              labels={Object.fromEntries(
                (options?.applications || []).map((application) => [
                  application.key,
                  application.display_name,
                ])
              )}
              selected={form.applications}
              onToggle={(value) => toggleArrayValue("applications", value)}
              empty="Tidak ada aplikasi yang dapat Anda delegasikan."
            />

            <CheckboxGroup
              title="Izin Langsung"
              items={options?.permissions || []}
              labels={options?.permission_aliases}
              selected={form.permissions}
              onToggle={(value) => toggleArrayValue("permissions", value)}
              empty="Tidak ada permission yang dapat Anda delegasikan."
            />
          </div>

          {selected.can_view_audit && (
            <div className="min-w-0 w-full space-y-5 overflow-hidden border-cu-line lg:border-l lg:pl-6">
              <AuditPanel detail={selected} onRevoke={onRevokeSession} />
            </div>
          )}
        </div>

        <div className="border-t border-cu-line bg-cu-panel-soft/40 px-6 py-4">
          <div className="flex justify-end gap-3">
            {isRoot && (
              <button
                type="button"
                onClick={onDeleteClick}
                disabled={isSaving || isDeleting}
                className="mr-auto inline-flex items-center gap-2 btn btn-danger"
              >
                {isDeleting && (
                  <span
                    aria-hidden="true"
                    className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  />
                )}
                {isDeleting ? "Menghapus..." : "Hapus Akun"}
              </button>
            )}
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Batal
            </button>
            <button type="submit" disabled={isSaving} className="btn btn-primary">
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-1.5 text-xs font-semibold text-cu-ink">
      <span>{label}</span>
      {children}
    </label>
  );
}

function CheckboxGroup({
  title,
  items,
  labels = {},
  selected,
  onToggle,
  empty,
}: {
  title: string;
  items: string[];
  labels?: Record<string, string>;
  selected: string[];
  onToggle: (value: string) => void;
  empty?: string;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cu-ink">{title}</h4>
        <span className="text-xs text-cu-muted">{selected.length} dipilih</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs italic text-cu-muted">{empty}</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-cu-line bg-cu-panel-soft/30 p-3 text-xs font-semibold text-cu-ink"
            >
              <input type="checkbox" checked={selected.includes(item)} onChange={() => onToggle(item)} />
              {labels[item] ?? item}
            </label>
          ))}
        </div>
      )}
    </section>
  );
}

function AuditPanel({
  detail,
  onRevoke,
}: {
  detail: ManagedUserDetail;
  onRevoke: (id: string) => void;
}) {
  return (
    <>
      <section className="min-w-0 w-full">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-cu-ink">Sesi Aktif</h4>
        <div className="space-y-2">
          {detail.sessions.length === 0 ? (
            <p className="text-xs text-cu-muted">Tidak ada sesi aktif.</p>
          ) : (
            detail.sessions.map((session) => (
              <div
                key={session.id}
                className="min-w-0 w-full overflow-hidden rounded-xl border border-cu-line bg-cu-panel-soft/30 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-cu-ink">
                      {session.user_agent || "Perangkat tidak dikenal"}
                    </p>
                    <p className="mt-1 text-[11px] text-cu-muted">
                      {session.ip_address || "IP tidak tersedia"} · {formatDate(session.last_activity, true)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRevoke(session.id)}
                    className="text-xs font-semibold text-cu-danger"
                  >
                    Cabut
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <section className="min-w-0 w-full">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-cu-ink">Aktivitas Terakhir</h4>
        <div className="space-y-2">
          {detail.activities.length === 0 ? (
            <p className="text-xs text-cu-muted">Belum ada aktivitas.</p>
          ) : (
            detail.activities.map((activity) => (
              <div key={activity.id} className="border-l-2 border-cu-line pl-3">
                <p className="text-xs text-cu-ink">{activity.description}</p>
                <p className="mt-0.5 text-[10px] text-cu-muted">
                  {formatDate(activity.created_at, true)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
