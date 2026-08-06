"use client";

import React from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { AccessDenied } from "@/components/ui/access-denied";
import { ContentTitle } from "@/components/ui/content-title";

// Import Modular Components
import { UserTable } from "@/components/panel/users/user-table";
import { UserMobileGrid } from "@/components/panel/users/user-mobile-grid";
import { UserFilters } from "@/components/panel/users/user-filters";
import { UserDetailModal } from "@/components/panel/users/user-detail-modal";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { UserWhitelistModal } from "@/components/panel/users/user-whitelist-modal";

// Import Hooks
import { useUsers } from "./use-users";

export default function UsersPage() {
  const {
    isRoot,
    users,
    options,
    page,
    setPage,
    lastPage,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    roleMenuOpen,
    setRoleMenuOpen,
    roleMenuRef,
    isLoading,
    selected,
    form,
    setForm,
    isSaving,
    isDeleting,
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    modalError,
    setModalError,
    showWhitelist,
    setShowWhitelist,
    whitelist,
    setWhitelist,
    isSavingWhitelist,
    submitSearch,
    openUser,
    closeUser,
    saveUser,
    deleteUser,
    revokeSession,
    saveWhitelist,
  } = useUsers();

  const hasAccess = users !== undefined; // Handled by Hook auth check

  if (isLoading && users.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-cu-muted">
        Memuat data pengguna...
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col gap-6 animate-fade-in">
      <ContentTitle
        title="Kelola Pengguna"
        rightElement={
          isRoot && (
            <button
              type="button"
              onClick={() => setShowWhitelist(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-cu-ink px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-black"
            >
              <MaterialIcon name="settings_suggest" size="sm" />
              Atur Izin Manajer
            </button>
          )
        }
      />

      <UserFilters
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        roleMenuOpen={roleMenuOpen}
        setRoleMenuOpen={setRoleMenuOpen}
        roleMenuRef={roleMenuRef}
        options={options}
        onSubmitSearch={submitSearch}
        onPageReset={setPage}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-[#c9bbfc] bg-white">
        {/* Mobile View Card Grid */}
        <UserMobileGrid
          users={users}
          options={options}
          isLoading={isLoading}
          isRoot={isRoot}
          onOpenUser={openUser}
        />

        {/* Desktop View Table */}
        <UserTable
          users={users}
          options={options}
          isLoading={isLoading}
          isRoot={isRoot}
          onOpenUser={openUser}
        />

        <Pagination page={page} lastPage={lastPage} onChange={setPage} />
      </div>

      {/* User Manage / Edit Detail Modal */}
      {selected && (
        <UserDetailModal
          selected={selected}
          form={form}
          setForm={setForm}
          options={options}
          isSaving={isSaving}
          isDeleting={isDeleting}
          modalError={modalError}
          setModalError={setModalError}
          isRoot={isRoot}
          onSave={saveUser}
          onClose={closeUser}
          onDeleteClick={() => setIsDeleteConfirmOpen(true)}
          onRevokeSession={revokeSession}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && selected && (
        <ConfirmModal
          title="Hapus Akun Permanen"
          message={
            <>
              Hapus permanen akun <strong className="text-cu-ink">{selected.user.name}</strong>? Akun dan aksesnya tidak dapat dipulihkan.
            </>
          }
          confirmText="Hapus Permanen"
          isDanger
          isLoading={isDeleting}
          error={modalError}
          onConfirm={deleteUser}
          onClose={() => !isDeleting && setIsDeleteConfirmOpen(false)}
        />
      )}

      {/* Root Whitelist Manager Modal */}
      {showWhitelist && options && (
        <UserWhitelistModal
          options={options}
          whitelist={whitelist}
          setWhitelist={setWhitelist}
          isSaving={isSavingWhitelist}
          onSave={saveWhitelist}
          onClose={() => setShowWhitelist(false)}
        />
      )}
    </div>
  );
}

function Pagination({ page, lastPage, onChange }: { page: number; lastPage: number; onChange: (page: number) => void }) {
  if (lastPage <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-cu-line px-6 py-4 text-xs text-cu-muted bg-slate-50/50">
      <span>Halaman {page} dari {lastPage}</span>
      <div className="flex gap-2">
        <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} className="btn btn-secondary disabled:opacity-40">Sebelumnya</button>
        <button type="button" disabled={page >= lastPage} onClick={() => onChange(page + 1)} className="btn btn-secondary disabled:opacity-40">Berikutnya</button>
      </div>
    </div>
  );
}
