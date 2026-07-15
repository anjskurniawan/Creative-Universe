"use client";

import { FormEvent, ReactNode, useCallback, useEffect, useState } from "react";
import { MaterialIcon } from "@/components/material-icon";
import { SettingsLayout } from "@/components/settings-layout";
import { errorMessage, ManagedRole, type ManagedPermission } from "@/core/admin";
import { coreApi } from "@/core/api";
import { useAuth } from "@/providers/auth-provider";

export default function RolesPage() {
  const { hasPermission } = useAuth();
  const [roles, setRoles] = useState<ManagedRole[]>([]);
  const [permissions, setPermissions] = useState<ManagedPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState<ManagedRole | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [deleting, setDeleting] = useState<ManagedRole | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [roleData, permissionData] = await Promise.all([
        coreApi.roles.list<ManagedRole[]>(),
        coreApi.roles.permissionCatalog<ManagedPermission[]>(),
      ]);
      setRoles(roleData);
      setPermissions(permissionData);
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasPermission("manage-roles")) return;
    queueMicrotask(() => void loadData());
  }, [hasPermission, loadData]);

  if (!hasPermission("manage-roles")) {
    return (
      <div className="rounded-2xl border border-cu-danger/20 bg-cu-danger-soft p-8 text-center">
        <MaterialIcon name="lock" size="lg" className="mx-auto text-cu-danger" />
        <h1 className="mt-3 text-lg font-semibold">Akses ditolak</h1>
        <p className="mt-1 text-sm text-cu-muted">Anda tidak memiliki permission manage-roles.</p>
      </div>
    );
  }

  const openCreate = () => {
    setEditing(null);
    setName("");
    setSelectedPermissions([]);
    setError(null);
    setShowEditor(true);
  };

  const openEdit = (role: ManagedRole) => {
    setEditing(role);
    setName(role.name);
    setSelectedPermissions(role.permissions);
    setError(null);
    setShowEditor(true);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setEditing(null);
    setName("");
    setSelectedPermissions([]);
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions((current) => current.includes(permission)
      ? current.filter((item) => item !== permission)
      : [...current, permission]);
  };

  const saveRole = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (editing) {
        await coreApi.roles.update(editing.id, { permissions: selectedPermissions });
        setNotice(`Permission role ${editing.name} berhasil diperbarui.`);
      } else {
        await coreApi.roles.create({ name, permissions: selectedPermissions });
        setNotice(`Role ${name.trim()} berhasil dibuat.`);
      }

      closeEditor();
      await loadData();
    } catch (requestError) {
      setError(errorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRole = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    setError(null);
    try {
      await coreApi.roles.remove(deleting.id);
      setNotice(`Role ${deleting.name} berhasil dihapus.`);
      setDeleting(null);
      await loadData();
    } catch (requestError) {
      setError(errorMessage(requestError));
      setDeleting(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SettingsLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="border-b border-cu-line pb-3 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cu-muted">Dynamic RBAC</p>
            <h2 className="mt-1 text-2xl font-semibold text-cu-ink">Role & Permission</h2>
            <p className="mt-1 text-sm text-cu-muted">Atur role dinamis dan akses aplikasi dari satu tempat.</p>
          </div>
          <button type="button" onClick={openCreate} className="btn btn-primary rounded-full">
            <MaterialIcon name="add" size="sm" /> Buat Role
          </button>
        </div>

        {notice && <Alert tone="success" message={notice} onClose={() => setNotice(null)} />}
        {error && !showEditor && <Alert tone="error" message={error} onClose={() => setError(null)} />}

        <div className="overflow-hidden rounded-2xl border border-cu-line bg-cu-surface shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-cu-line bg-cu-panel-soft text-xs uppercase text-cu-muted">
                <tr>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Permission</th>
                  <th className="px-6 py-3">User Aktif</th>
                  <th className="px-6 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cu-line">
                {isLoading ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-cu-muted">Memuat role...</td></tr>
                ) : roles.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-cu-muted">Belum ada role terdaftar.</td></tr>
                ) : roles.map((role) => (
                  <tr key={role.id} className="transition hover:bg-cu-panel-soft/40">
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-cu-ink">{role.name}</span>
                        {role.protected && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-cu-warning/20 bg-cu-warning-soft px-2 py-0.5 text-xs font-medium text-cu-warning">
                            <MaterialIcon name="lock" size="xs" /> Dilindungi
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-cu-muted">Guard: {role.guard_name}</p>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex max-w-3xl flex-wrap gap-2">
                        {role.permissions.length === 0 ? <span className="text-sm text-cu-muted">Belum ada permission.</span> : role.permissions.map((permission) => (
                          <span key={permission} className="rounded-full border border-cu-info/20 bg-cu-info-soft px-2.5 py-1 text-xs font-medium text-cu-info">{permission}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span className="text-cu-ink">{role.active_users_count}</span>
                      <span className="text-xs text-cu-muted"> / {role.users_count} total</span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => openEdit(role)} aria-label={`Ubah permission ${role.name}`} className="inline-flex size-10 items-center justify-center rounded-full border border-cu-border text-cu-ink transition hover:bg-cu-panel-soft">
                          <MaterialIcon name="edit" size="xs" />
                        </button>
                        <button type="button" disabled={role.protected} onClick={() => setDeleting(role)} aria-label={`Hapus ${role.name}`} className="inline-flex size-10 items-center justify-center rounded-full border border-cu-danger/30 text-cu-danger transition hover:bg-cu-danger-soft disabled:cursor-not-allowed disabled:opacity-40">
                          <MaterialIcon name="delete" size="xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showEditor && (
          <Modal title={editing ? "Ubah Permission Role" : "Buat Role Baru"} onClose={closeEditor}>
            <form onSubmit={saveRole}>
              <div className="space-y-5 p-6">
                <p className="text-sm text-cu-muted">
                  {editing ? "Nama role tidak diubah dari panel ini." : "Gunakan nama yang jelas, misalnya Koordinator Creative."}
                </p>
                {error && <Alert tone="error" message={error} onClose={() => setError(null)} />}
                <label className="block space-y-2 text-sm font-medium text-cu-ink">
                  <span>Nama Role</span>
                  <input required minLength={3} value={name} onChange={(event) => setName(event.target.value)} disabled={Boolean(editing)} placeholder="Koordinator Creative" className="form-input disabled:bg-cu-panel-soft disabled:text-cu-muted" />
                </label>
                <section>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-cu-ink">Permission</h3>
                    <span className="text-xs text-cu-muted">{selectedPermissions.length} dipilih</span>
                  </div>
                  <div className="grid max-h-72 gap-2 overflow-y-auto rounded-xl border border-cu-line bg-cu-panel-soft p-3 sm:grid-cols-2">
                    {permissions.map((permission) => (
                      <label key={permission.key} className="flex cursor-pointer items-start gap-3 rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink">
                        <input className="mt-0.5" type="checkbox" checked={selectedPermissions.includes(permission.key)} onChange={() => togglePermission(permission.key)} />
                        <span><span className="block">{permission.display_name}</span><small className="text-cu-muted">{permission.application_name}</small></span>
                      </label>
                    ))}
                  </div>
                </section>
              </div>
              <div className="flex justify-end gap-3 border-t border-cu-line px-6 py-4">
                <button type="button" onClick={closeEditor} className="btn btn-secondary">Batal</button>
                <button type="submit" disabled={isSaving} className="btn btn-primary">{isSaving ? "Menyimpan..." : editing ? "Simpan Permission" : "Buat Role"}</button>
              </div>
            </form>
          </Modal>
        )}

        {deleting && (
          <Modal title="Hapus Role" onClose={() => setDeleting(null)}>
            <div className="p-6 text-sm text-cu-muted">
              Role <strong className="text-cu-ink">{deleting.name}</strong> akan dihapus permanen. Role dengan pengguna aktif tidak dapat dihapus.
            </div>
            <div className="flex justify-end gap-3 border-t border-cu-line px-6 py-4">
              <button type="button" onClick={() => setDeleting(null)} className="btn btn-secondary">Batal</button>
              <button type="button" onClick={() => void deleteRole()} disabled={isDeleting} className="btn btn-danger">{isDeleting ? "Menghapus..." : "Hapus Role"}</button>
            </div>
          </Modal>
        )}
      </div>
    </SettingsLayout>
  );
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cu-overlay/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-cu-line bg-cu-surface shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-cu-line bg-cu-surface px-6 py-4">
          <h2 className="text-lg font-semibold text-cu-ink">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="text-cu-muted hover:text-cu-ink"><MaterialIcon name="close" size="sm" /></button>
        </div>
        {children}
      </div>
    </div>
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
