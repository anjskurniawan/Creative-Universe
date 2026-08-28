"use client";

import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import { coreApi } from "@/core/api";
import type { PaginatedResponse } from "@/types/pagination";
import { useAuth } from "@/hooks/auth";
import type { ManagedUser, ManagedUserDetail, UserFormState, UserManagementOptions } from "../types";
import { errorMessage } from "../utils";

export const emptyForm: UserFormState = {
  name: "",
  email: "",
  whatsapp_number: "",
  password: "",
  password_confirmation: "",
  roles: [],
  permissions: [],
  applications: [],
};

export function useUsers() {
  const { hasPermission, hasRole } = useAuth();
  
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [options, setOptions] = useState<UserManagementOptions | null>(null);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selected, setSelected] = useState<ManagedUserDetail | null>(null);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [showWhitelist, setShowWhitelist] = useState(false);
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [isSavingWhitelist, setIsSavingWhitelist] = useState(false);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);

    const params = new URLSearchParams({ page: String(page) });
    if (appliedSearch) params.set("search", appliedSearch);
    if (roleFilter) params.set("role", roleFilter);

    try {
      const result = await coreApi.users.list<PaginatedResponse<ManagedUser>>(
        `?${params.toString()}`
      );
      setUsers(result.data);
      setLastPage(result.meta.last_page);
    } catch (requestError) {
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "error",
            message: errorMessage(requestError),
          },
        })
      );
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
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "error",
            message: errorMessage(requestError),
          },
        })
      );
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

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!roleMenuRef.current?.contains(event.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  const submitSearch = (event?: FormEvent<HTMLFormElement> | string) => {
    if (event && typeof event !== "string" && "preventDefault" in event) {
      event.preventDefault();
    }
    const query = typeof event === "string" ? event : search;
    setPage(1);
    setAppliedSearch(query.trim());
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
    setIsDeleteConfirmOpen(false);
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
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "success",
            message: `Pengaturan akun ${name} berhasil diperbarui.`,
          },
        })
      );
      await loadUsers();
    } catch (requestError) {
      setModalError(errorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUser = async () => {
    if (!selected) return;
    setIsDeleting(true);
    setModalError(null);
    try {
      await coreApi.users.remove(selected.user.id);
      const name = selected.user.name;
      closeUser();
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "success",
            message: `Akun ${name} berhasil dihapus.`,
          },
        })
      );
      await loadUsers();
    } catch (requestError) {
      setModalError(errorMessage(requestError));
    } finally {
      setIsDeleting(false);
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
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "success",
            message: "Sesi perangkat berhasil dicabut.",
          },
        })
      );
    } catch (requestError) {
      setModalError(errorMessage(requestError));
    }
  };

  const saveWhitelist = async () => {
    setIsSavingWhitelist(true);
    try {
      await coreApi.users.managerWhitelist.update<string[]>(whitelist);
      setShowWhitelist(false);
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "success",
            message: "Daftar izin yang dapat dikelola Manajer berhasil diperbarui.",
          },
        })
      );
      await loadOptions();
    } catch (requestError) {
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "error",
            message: errorMessage(requestError),
          },
        })
      );
    } finally {
      setIsSavingWhitelist(false);
    }
  };

  return {
    isRoot: hasRole("Root"),
    hasRole,
    users,
    options,
    page,
    setPage,
    lastPage,
    search,
    setSearch,
    appliedSearch,
    roleFilter,
    setRoleFilter,
    roleMenuOpen,
    setRoleMenuOpen,
    roleMenuRef,
    isLoading,
    selected,
    setSelected,
    form,
    setForm,
    isModalLoading,
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
  };
}
