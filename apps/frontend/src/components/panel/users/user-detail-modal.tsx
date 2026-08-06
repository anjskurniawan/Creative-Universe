"use client";

import React, { FormEvent, ReactNode, useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/form/input";
import { DropdownMenu } from "@/components/ui/form/dropdown-menu";
import { MaterialIcon } from "@/components/ui/material-icon";
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
  const [rolesDropdownOpen, setRolesDropdownOpen] = useState(false);
  const [appsDropdownOpen, setAppsDropdownOpen] = useState(false);
  const [permsDropdownOpen, setPermsDropdownOpen] = useState(false);

  // Accordion Expand/Collapse States (Single Open)
  const [activeSection, setActiveSection] = useState<string>("profile");

  useEffect(() => {
    if (!activeSection) return;
    const element = document.getElementById(`sec-${activeSection}`);
    if (element) {
      const timer = setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [activeSection]);

  const handleToggleSection = (section: string) => {
    setActiveSection((current) => (current === section ? "" : section));
  };

  const toggleArrayValue = (field: "roles" | "permissions" | "applications", value: string) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
    }));
  };

  const rolesItems = (options?.roles || []).map((role) => ({
    value: role,
    label: role,
  }));

  const appsItems = (options?.applications || []).map((app) => ({
    value: app.key,
    label: app.display_name,
  }));

  const permsItems = (options?.permissions || []).map((perm) => ({
    value: perm,
    label: options?.permission_aliases[perm] ?? perm,
  }));

  return (
    <Modal
      title="Kelola Akun Pengguna"
      onClose={onClose}
      wide={selected.can_view_audit}
      fullHeight={true}
      footer={
        <div className="flex justify-end gap-3 w-full">
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
          <button
            type="submit"
            form="user-edit-form"
            disabled={isSaving}
            className="btn btn-primary"
          >
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      }
    >
      <form id="user-edit-form" onSubmit={onSave}>
        <div className={`grid gap-6 ${selected.can_view_audit ? "lg:grid-cols-[1.1fr_0.9fr]" : ""}`}>
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

            <div className="space-y-4">
              {/* Profile Section */}
              <AccordionSection
                id="sec-profile"
                title="Profile"
                isOpen={activeSection === "profile"}
                onToggle={() => handleToggleSection("profile")}
              >
                <div className="space-y-4">
                  <Input
                    id="name-input"
                    label="Nama lengkap"
                    required
                    value={form.name || ""}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                  />
                  <Input
                    id="email-input"
                    label="Email"
                    type="email"
                    value={form.email || ""}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                  />
                  <Input
                    id="whatsapp-input"
                    label="Nomor WhatsApp"
                    type="phone"
                    value={form.whatsapp_number || ""}
                    onChange={(event) => setForm({ ...form, whatsapp_number: event.target.value })}
                    placeholder="62812..."
                  />
                  <Input
                    id="password-input"
                    label="Password baru"
                    type="password"
                    value={form.password || ""}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    placeholder="Kosongkan jika tidak diubah"
                  />
                  <Input
                    id="password-conf-input"
                    label="Konfirmasi password"
                    type="password"
                    value={form.password_confirmation || ""}
                    onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })}
                  />
                </div>
              </AccordionSection>

              {/* Roles Section */}
              <AccordionSection
                id="sec-roles"
                title="Roles"
                isOpen={activeSection === "roles"}
                onToggle={() => handleToggleSection("roles")}
              >
                <div className="relative w-full z-20">
                  <Input
                    id="roles-dropdown"
                    label="Peran (Roles)"
                    type="dropdown"
                    placeholder="Pilih Peran"
                    value={form.roles.join(", ")}
                    onClick={() => setRolesDropdownOpen(!rolesDropdownOpen)}
                    active={rolesDropdownOpen}
                  />
                  <DropdownMenu
                    isOpen={rolesDropdownOpen}
                    items={rolesItems}
                    selectedValues={form.roles}
                    onSelect={(val) => {
                      toggleArrayValue("roles", val);
                    }}
                    onClose={() => setRolesDropdownOpen(false)}
                  />
                </div>
              </AccordionSection>

              {/* Applications Section */}
              <AccordionSection
                id="sec-apps"
                title="Akses Aplikasi"
                isOpen={activeSection === "apps"}
                onToggle={() => handleToggleSection("apps")}
              >
                <div className="relative w-full z-10">
                  <Input
                    id="apps-dropdown"
                    label="Akses Sub-Aplikasi"
                    type="dropdown"
                    placeholder="Pilih Sub-Aplikasi"
                    value={
                      form.applications
                        .map((key) => (options?.applications || []).find((a) => a.key === key)?.display_name ?? key)
                        .join(", ")
                    }
                    onClick={() => setAppsDropdownOpen(!appsDropdownOpen)}
                    active={appsDropdownOpen}
                  />
                  <DropdownMenu
                    isOpen={appsDropdownOpen}
                    items={appsItems}
                    selectedValues={form.applications}
                    onSelect={(val) => {
                      toggleArrayValue("applications", val);
                    }}
                    onClose={() => setAppsDropdownOpen(false)}
                  />
                </div>
              </AccordionSection>

              {/* Permissions Section */}
              <AccordionSection
                id="sec-perms"
                title="Izin Langsung"
                isOpen={activeSection === "perms"}
                onToggle={() => handleToggleSection("perms")}
              >
                <div className="relative w-full z-0">
                  <Input
                    id="perms-dropdown"
                    label="Izin Langsung"
                    type="dropdown"
                    placeholder="Pilih Izin Langsung"
                    value={
                      form.permissions
                        .map((perm) => options?.permission_aliases[perm] ?? perm)
                        .join(", ")
                    }
                    onClick={() => setPermsDropdownOpen(!permsDropdownOpen)}
                    active={permsDropdownOpen}
                  />
                  <DropdownMenu
                    isOpen={permsDropdownOpen}
                    items={permsItems}
                    selectedValues={form.permissions}
                    onSelect={(val) => {
                      toggleArrayValue("permissions", val);
                    }}
                    onClose={() => setPermsDropdownOpen(false)}
                  />
                </div>
              </AccordionSection>
            </div>
          </div>

          {selected.can_view_audit && (
            <div className="min-w-0 w-full space-y-5 overflow-hidden border-cu-line lg:border-l lg:pl-6">
              <AuditPanel detail={selected} onRevoke={onRevokeSession} />
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}

function AccordionSection({
  id,
  title,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      className="border-b border-cu-line transition-colors"
    >
      <button
        type="button"
        onClick={onToggle}
        className={`group flex w-full items-center justify-between gap-4 py-4 text-left text-xs font-semibold uppercase tracking-wider transition-colors hover:text-brand ${
          isOpen ? "bg-brand/5 text-brand" : "text-cu-ink"
        }`}
      >
        <span>{title}</span>
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-full transition-colors ${
            isOpen ? "bg-brand/10" : "bg-transparent"
          }`}
        >
          <MaterialIcon
            name="expand_more"
            className={`transition-transform duration-200 group-hover:text-brand ${
              isOpen ? "text-brand rotate-180" : "text-cu-muted"
            }`}
            size="sm"
          />
        </span>
      </button>
      {isOpen && <div className="relative space-y-4 pb-5">{children}</div>}
    </div>
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
