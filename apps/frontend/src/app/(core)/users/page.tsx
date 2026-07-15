"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { MaterialIcon } from "@/components/material-icon";
import {
  errorMessage,
  formatDate,
  initials,
  ManagedUser,
  ManagedUserDetail,
  PaginatedResponse,
  UserManagementOptions,
} from "@/core/admin";
import { coreApi } from "@/core/api";
import { useAuth } from "@/providers/auth-provider";

interface UserFormState {
  name: string;
  email: string;
  whatsapp_number: string;
  password: string;
  password_confirmation: string;
  roles: string[];
  permissions: string[];
  applications: string[];
}

const emptyForm: UserFormState = {
  name: "",
  email: "",
  whatsapp_number: "",
  password: "",
  password_confirmation: "",
  roles: [],
  permissions: [],
  applications: [],
};

export default function UsersPage() {
  const { hasPermission, hasRole } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [options, setOptions] = useState<UserManagementOptions | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [selected, setSelected] = useState<ManagedUserDetail | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [showWhitelist, setShowWhitelist] = useState(false);
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [isSavingWhitelist, setIsSavingWhitelist] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const params = new URLSearchParams({ page: String(page) });
    if (appliedSearch) params.set("search", appliedSearch);
    if (roleFilter) params.set("role", roleFilter);

    try {
      const result = await coreApi.users.list<PaginatedResponse<ManagedUser>>(
        `/users?${params.toString()}`
      );
      setUsers(result.data);
      setLastPage(result.meta.last_page);
      setTotal(result.meta.total);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [appliedSearch, page, roleFilter]);

  const loadOptions = useCallback(async () => {
    try {
      const result = await coreApi.users.options<UserManagementOptions>();
      setOptions(result);
      setWhitelist(result.manager_whitelist);
    } catch (requestError) {
      setError(errorMessage(requestError));
    }
  }, []);

  useEffect(() => {
    if (!hasPermission("manage-users")) return;
    queueMicrotask(() => void loadUsers());
  }, [hasPermission, loadUsers]);

  useEffect(() => {
    if (!hasPermission("manage-users")) return;
    queueMicrotask(() => void loadOptions());
  }, [hasPermission, loadOptions]);

  if (!hasPermission("manage-users")) {
    return <AccessDenied />;
  }

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const openUser = async (user: ManagedUser) => {
    setSelected(null);
    setModalError(null);
    setIsModalLoading(true);

    try {
      const detail = await coreApi.users.detail<ManagedUserDetail>(user.id);
      setSelected(detail);
      setForm({
        name: detail.user.name,
        email: detail.user.email,
        whatsapp_number: detail.user.whatsapp_number || "",
        password: "",
        password_confirmation: "",
        roles: detail.user.roles,
        permissions: detail.user.permissions.filter((permission) =>
          options?.permissions.includes(permission)
        ),
        applications: detail.user.applications.map((application) => application.key),
      });
    } catch (requestError) {
      setModalError(errorMessage(requestError));
    } finally {
      setIsModalLoading(false);
    }
  };

  const closeUser = () => {
    setSelected(null);
    setForm(emptyForm);
    setModalError(null);
    setIsModalLoading(false);
  };

  const saveUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;

    setIsSaving(true);
    setModalError(null);

    try {
      await coreApi.users.update<ManagedUser>(selected.user.id, {
          ...form,
          whatsapp_number: form.whatsapp_number || null,
          password: form.password || null,
          password_confirmation: form.password_confirmation || null,
      });
      const name = form.name;
      closeUser();
      setNotice(`Pengaturan akun ${name} berhasil diperbarui.`);
      await loadUsers();
    } catch (requestError) {
      setModalError(errorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    if (!selected || !window.confirm("Cabut sesi perangkat pengguna ini?")) return;

    setModalError(null);
    try {
      await coreApi.users.revokeSession(selected.user.id, sessionId);
      setSelected({
        ...selected,
        sessions: selected.sessions.filter((session) => session.id !== sessionId),
      });
    } catch (requestError) {
      setModalError(errorMessage(requestError));
    }
  };

  const saveWhitelist = async () => {
    setIsSavingWhitelist(true);
    setError(null);
    try {
      await coreApi.users.managerWhitelist.update<string[]>(whitelist);
      setShowWhitelist(false);
      setNotice("Daftar izin yang dapat dikelola Manajer berhasil diperbarui.");
      await loadOptions();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setIsSavingWhitelist(false);
    }
  };

  const toggleArrayValue = (
    field: "roles" | "permissions" | "applications",
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
    }));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 px-6 sm:flex-row sm:items-end sm:justify-between md:px-0">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-cu-muted">
            Administrasi Core
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-cu-ink">Kelola Pengguna</h1>
          <p className="mt-1 text-sm text-cu-muted">
            {total} akun aktif atau pernah disetujui terdaftar di sistem.
          </p>
        </div>
        {hasRole("Root") && (
          <button
            type="button"
            onClick={() => setShowWhitelist(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-line bg-cu-panel-soft px-4 text-sm font-semibold text-cu-ink transition hover:bg-cu-line"
          >
            <MaterialIcon name="settings_suggest" size="sm" />
            Atur Izin Manajer
          </button>
        )}
      </header>

      {notice && <div className="px-6 md:px-0"><Alert type="success" message={notice} onClose={() => setNotice(null)} /></div>}
      {error && <div className="px-6 md:px-0"><Alert type="error" message={error} onClose={() => setError(null)} /></div>}

      <div className="flex flex-col gap-3 px-6 sm:flex-row md:px-0">
        <form onSubmit={submitSearch} className="relative w-full max-w-lg">
          <MaterialIcon
            name="search"
            size="sm"
            className="pointer-events-none absolute left-3 top-2.5 text-cu-muted"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama, username, atau email..."
            className="h-10 w-full rounded-full border border-cu-line bg-cu-surface pl-10 pr-4 text-sm outline-none transition focus:border-cu-ink"
          />
        </form>
        <select
          value={roleFilter}
          onChange={(event) => {
            setRoleFilter(event.target.value);
            setPage(1);
          }}
          className="h-10 rounded-full border border-cu-line bg-cu-surface px-4 text-sm text-cu-ink outline-none focus:border-cu-ink"
        >
          <option value="">Semua peran</option>
          {options?.roles.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden border border-cu-line bg-cu-surface shadow-sm md:rounded-2xl">
        <div className="block space-y-2 bg-white p-4 md:hidden">
          {isLoading ? (
            <div className="rounded-[24px] border border-cu-line bg-cu-surface px-4 py-8 text-center text-sm text-cu-muted">Memuat pengguna...</div>
          ) : users.length === 0 ? (
            <div className="rounded-[24px] border border-cu-line bg-cu-surface px-4 py-8 text-center text-sm text-cu-muted">Tidak ada pengguna yang sesuai.</div>
          ) : users.map((managedUser) => {
            const protectedFromManager = !hasRole("Root") && managedUser.roles.includes("Root");
            return (
              <article key={managedUser.id} className="rounded-[24px] border border-cu-line bg-cu-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar user={managedUser} />
                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-semibold leading-tight text-cu-ink">{managedUser.name}</h2>
                      <p className="truncate text-[11px] leading-tight text-cu-muted">@{managedUser.username}</p>
                    </div>
                  </div>
                  {protectedFromManager ? (
                    <span className="shrink-0 rounded-full bg-cu-panel-soft px-2 py-1 text-[10px] font-semibold text-cu-muted">Protected</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void openUser(managedUser)}
                      className="shrink-0 rounded-full border border-cu-line bg-white px-3 py-1.5 text-[11px] font-semibold text-cu-ink transition hover:bg-cu-panel-soft"
                    >
                      Kelola
                    </button>
                  )}
                </div>
                <p className="mt-3 truncate text-xs text-cu-muted">{managedUser.email}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {managedUser.roles.map((role) => <Badge key={role} tone={role === "Root" ? "danger" : role === "Manajer" ? "info" : "neutral"}>{role}</Badge>)}
                  {managedUser.permissions.slice(0, 2).map((permission) => <Badge key={permission} tone="soft">+{options?.permission_aliases[permission] ?? permission}</Badge>)}
                  {managedUser.permissions.length > 2 && <Badge tone="soft">+{managedUser.permissions.length - 2} lagi</Badge>}
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-cu-line/70 pt-3 text-[11px] text-cu-muted">
                  <span>ID #{managedUser.id}</span>
                  <span>{formatDate(managedUser.created_at)}</span>
                </div>
              </article>
            );
          })}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-cu-line bg-cu-panel-soft/60 text-[10px] font-bold uppercase tracking-wider text-cu-muted">
              <tr>
                <th className="px-6 py-4">Nama</th>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Peran & izin langsung</th>
                <th className="px-6 py-4">Bergabung</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cu-line/50">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-cu-muted">Memuat pengguna...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-cu-muted">Tidak ada pengguna yang sesuai.</td></tr>
              ) : users.map((managedUser) => {
                const protectedFromManager = !hasRole("Root") && managedUser.roles.includes("Root");
                return (
                  <tr key={managedUser.id} className="transition hover:bg-cu-panel-soft/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar user={managedUser} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-cu-ink">{managedUser.name}</span>
                          </div>
                          <span className="text-xs text-cu-muted">ID #{managedUser.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-cu-ink">{managedUser.username}</td>
                    <td className="px-6 py-4 text-cu-muted">{managedUser.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex max-w-sm flex-wrap gap-1.5">
                        {managedUser.roles.map((role) => <Badge key={role} tone={role === "Root" ? "danger" : role === "Manajer" ? "info" : "neutral"}>{role}</Badge>)}
                        {managedUser.permissions.map((permission) => <Badge key={permission} tone="soft">+{options?.permission_aliases[permission] ?? permission}</Badge>)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-cu-muted">{formatDate(managedUser.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      {protectedFromManager ? (
                        <span className="text-xs italic text-cu-muted">Protected</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => void openUser(managedUser)}
                          className="rounded-lg border border-cu-line bg-cu-surface px-3 py-1.5 text-xs font-semibold text-cu-ink transition hover:bg-cu-panel-soft"
                        >
                          Kelola
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} lastPage={lastPage} onChange={setPage} />
      </div>

      {(isModalLoading || selected || modalError) && (
        <Modal title="Kelola Akun Pengguna" onClose={closeUser} wide={selected?.can_view_audit}>
          {isModalLoading ? (
            <p className="p-8 text-center text-sm text-cu-muted">Memuat detail pengguna...</p>
          ) : selected ? (
            <form onSubmit={saveUser}>
              <div className={`grid gap-6 p-6 ${selected.can_view_audit ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-cu-ink">{selected.user.name}</h3>
                    <p className="text-xs text-cu-muted">@{selected.user.username} · {selected.user.email}</p>
                  </div>
                  {modalError && <Alert type="error" message={modalError} />}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Nama lengkap">
                      <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="form-input" />
                    </Field>
                    <Field label="Email">
                      <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="form-input" />
                    </Field>
                    <Field label="Nomor WhatsApp">
                      <input value={form.whatsapp_number} onChange={(event) => setForm({ ...form, whatsapp_number: event.target.value })} placeholder="62812..." className="form-input" />
                    </Field>
                    <Field label="Password baru">
                      <input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Kosongkan jika tidak diubah" className="form-input" />
                    </Field>
                    <Field label="Konfirmasi password">
                      <input type="password" value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} className="form-input" />
                    </Field>
                  </div>

                  <CheckboxGroup title="Peran (Roles)" items={options?.roles || []} selected={form.roles} onToggle={(value) => toggleArrayValue("roles", value)} />
                  <CheckboxGroup
                    title="Akses Sub-Aplikasi"
                    items={(options?.applications || []).map((application) => application.key)}
                    labels={Object.fromEntries((options?.applications || []).map((application) => [application.key, application.display_name]))}
                    selected={form.applications}
                    onToggle={(value) => toggleArrayValue("applications", value)}
                    empty="Tidak ada aplikasi yang dapat Anda delegasikan."
                  />
                  <CheckboxGroup title="Izin Langsung" items={options?.permissions || []} labels={options?.permission_aliases} selected={form.permissions} onToggle={(value) => toggleArrayValue("permissions", value)} empty="Tidak ada permission yang dapat Anda delegasikan." />
                </div>

                {selected.can_view_audit && (
                  <div className="space-y-5 border-cu-line lg:border-l lg:pl-6">
                    <AuditPanel
                      detail={selected}
                      onRevoke={(sessionId) => void revokeSession(sessionId)}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 border-t border-cu-line bg-cu-panel-soft/40 px-6 py-4">
                <button type="button" onClick={closeUser} className="btn btn-secondary">Batal</button>
                <button type="submit" disabled={isSaving} className="btn btn-primary">{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</button>
              </div>
            </form>
          ) : (
            <div className="p-6">{modalError && <Alert type="error" message={modalError} />}</div>
          )}
        </Modal>
      )}

      {showWhitelist && options && (
        <Modal title="Kelola Izin Delegasi Manajer" onClose={() => setShowWhitelist(false)}>
          <div className="space-y-4 p-6">
            <p className="text-sm text-cu-muted">
              Manajer hanya dapat memberikan izin yang dipilih di sini dan juga dimilikinya sendiri.
            </p>
            <div className="grid max-h-80 gap-2 overflow-y-auto sm:grid-cols-2">
              {options.all_permissions.map((permission) => {
                const sensitive = ["run-artisan", "manage-roles", "view-logs"].includes(permission);
                return (
                  <label key={permission} className="flex cursor-pointer items-start gap-3 rounded-xl border border-cu-line bg-cu-panel-soft/30 p-3">
                    <input
                      type="checkbox"
                      checked={whitelist.includes(permission)}
                      onChange={() => setWhitelist((current) => current.includes(permission) ? current.filter((item) => item !== permission) : [...current, permission])}
                      className="mt-0.5"
                    />
                    <span className={`text-xs font-semibold ${sensitive ? "text-cu-danger" : "text-cu-ink"}`}>
                      {options.permission_aliases[permission] ?? permission}
                      {sensitive && <small className="mt-0.5 block font-normal">Izin kritis sistem</small>}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-cu-line px-6 py-4">
            <button type="button" onClick={() => setShowWhitelist(false)} className="btn btn-secondary">Batal</button>
            <button type="button" onClick={() => void saveWhitelist()} disabled={isSavingWhitelist} className="btn btn-primary">{isSavingWhitelist ? "Menyimpan..." : "Simpan Konfigurasi"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="rounded-2xl border border-cu-danger/20 bg-cu-danger-soft p-8 text-center">
      <MaterialIcon name="lock" size="lg" className="mx-auto text-cu-danger" />
      <h1 className="mt-3 text-lg font-semibold">Akses ditolak</h1>
      <p className="mt-1 text-sm text-cu-muted">Anda tidak memiliki permission manage-users.</p>
    </div>
  );
}

function Avatar({ user }: { user: ManagedUser }) {
  return (
    <div className={`flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cu-line ${user.avatar_url ? "bg-white" : "bg-cu-panel-soft"}`}>
      {user.avatar_url ? <Image unoptimized width={36} height={36} src={user.avatar_url} alt={user.name} className="size-full object-cover" /> : <span className="text-xs font-bold text-cu-muted">{initials(user.name)}</span>}
    </div>
  );
}

function Badge({ children, tone }: { children: ReactNode; tone: "danger" | "info" | "neutral" | "soft" }) {
  const classes = {
    danger: "border-cu-danger/20 bg-cu-danger-soft text-cu-danger",
    info: "border-cu-info/20 bg-cu-info-soft text-cu-info",
    neutral: "border-cu-line bg-cu-panel-soft text-cu-muted",
    soft: "border-cu-line/50 bg-cu-surface text-cu-ink",
  };
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold ${classes[tone]}`}>{children}</span>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="space-y-1.5 text-xs font-semibold text-cu-ink"><span>{label}</span>{children}</label>;
}

function CheckboxGroup({ title, items, labels = {}, selected, onToggle, empty }: { title: string; items: string[]; labels?: Record<string, string>; selected: string[]; onToggle: (value: string) => void; empty?: string }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-cu-ink">{title}</h4>
        <span className="text-xs text-cu-muted">{selected.length} dipilih</span>
      </div>
      {items.length === 0 ? <p className="text-xs italic text-cu-muted">{empty}</p> : (
        <div className="grid gap-2 sm:grid-cols-2">
          {items.map((item) => (
            <label key={item} className="flex cursor-pointer items-center gap-3 rounded-xl border border-cu-line bg-cu-panel-soft/30 p-3 text-xs font-semibold text-cu-ink">
              <input type="checkbox" checked={selected.includes(item)} onChange={() => onToggle(item)} />
              {labels[item] ?? item}
            </label>
          ))}
        </div>
      )}
    </section>
  );
}

function AuditPanel({ detail, onRevoke }: { detail: ManagedUserDetail; onRevoke: (id: string) => void }) {
  return (
    <>
      <section>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-cu-ink">Sesi Aktif</h4>
        <div className="space-y-2">
          {detail.sessions.length === 0 ? <p className="text-xs text-cu-muted">Tidak ada sesi aktif.</p> : detail.sessions.map((session) => (
            <div key={session.id} className="rounded-xl border border-cu-line bg-cu-panel-soft/30 p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-cu-ink">{session.user_agent || "Perangkat tidak dikenal"}</p>
                  <p className="mt-1 text-[11px] text-cu-muted">{session.ip_address || "IP tidak tersedia"} · {formatDate(session.last_activity, true)}</p>
                </div>
                <button type="button" onClick={() => onRevoke(session.id)} className="text-xs font-semibold text-cu-danger">Cabut</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-cu-ink">Aktivitas Terakhir</h4>
        <div className="space-y-2">
          {detail.activities.length === 0 ? <p className="text-xs text-cu-muted">Belum ada aktivitas.</p> : detail.activities.map((activity) => (
            <div key={activity.id} className="border-l-2 border-cu-line pl-3">
              <p className="text-xs text-cu-ink">{activity.description}</p>
              <p className="mt-0.5 text-[10px] text-cu-muted">{formatDate(activity.created_at, true)}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cu-overlay/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-cu-line bg-cu-surface shadow-xl ${wide ? "max-w-5xl" : "max-w-2xl"}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-cu-line bg-cu-surface px-6 py-4">
          <h2 className="text-base font-bold text-cu-ink">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="text-cu-muted transition hover:text-cu-ink"><MaterialIcon name="close" size="sm" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Alert({ type, message, onClose }: { type: "success" | "error"; message: string; onClose?: () => void }) {
  return (
    <div className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${type === "success" ? "border-cu-success/20 bg-cu-success-soft text-cu-success" : "border-cu-danger/20 bg-cu-danger-soft text-cu-danger"}`}>
      <span>{message}</span>
      {onClose && <button type="button" onClick={onClose} aria-label="Tutup"><MaterialIcon name="close" size="xs" /></button>}
    </div>
  );
}

function Pagination({ page, lastPage, onChange }: { page: number; lastPage: number; onChange: (page: number) => void }) {
  if (lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-cu-line px-6 py-4 text-xs text-cu-muted">
      <span>Halaman {page} dari {lastPage}</span>
      <div className="flex gap-2">
        <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className="btn btn-secondary disabled:opacity-40">Sebelumnya</button>
        <button type="button" disabled={page >= lastPage} onClick={() => onChange(page + 1)} className="btn btn-secondary disabled:opacity-40">Berikutnya</button>
      </div>
    </div>
  );
}
