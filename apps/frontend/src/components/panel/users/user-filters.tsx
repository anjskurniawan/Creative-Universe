import React, { FormEvent, RefObject } from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { UserManagementOptions } from "@/core/admin";

interface UserFiltersProps {
  search: string;
  setSearch: (search: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  roleMenuOpen: boolean;
  setRoleMenuOpen: (open: boolean | ((current: boolean) => boolean)) => void;
  roleMenuRef: RefObject<HTMLDivElement | null>;
  options: UserManagementOptions | null;
  onSubmitSearch: (event: FormEvent<HTMLFormElement>) => void;
  onPageReset: (page: number) => void;
}

export function UserFilters({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  roleMenuOpen,
  setRoleMenuOpen,
  roleMenuRef,
  options,
  onSubmitSearch,
  onPageReset,
}: UserFiltersProps) {
  const roles = options?.roles || [];

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <form onSubmit={onSubmitSearch} className="relative min-w-0 flex-1">
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
          className="h-10 w-full rounded-xl border border-[#dbe4e8] bg-white pl-10 pr-4 text-sm text-cu-ink shadow-[0_2px_8px_rgba(44,42,39,0.05)] outline-none transition placeholder:text-[#9aa7ab] focus:border-[#00a4ff] focus:ring-2 focus:ring-[#00a4ff]/10"
        />
      </form>
      <div ref={roleMenuRef} className="relative sm:w-52">
        <button
          type="button"
          onClick={() => setRoleMenuOpen((open) => !open)}
          className="flex h-10 w-full items-center justify-between rounded-xl border border-[#dbe4e8] bg-white px-4 text-sm font-medium text-cu-ink shadow-[0_2px_8px_rgba(44,42,39,0.05)] transition hover:border-[#00a4ff] focus:outline-none focus:ring-2 focus:ring-[#00a4ff]/10"
        >
          <span>{roleFilter || "Semua peran"}</span>
          <MaterialIcon
            name="expand_more"
            size="sm"
            className={`transition-transform ${roleMenuOpen ? "rotate-180" : ""}`}
          />
        </button>
        {roleMenuOpen && (
          <div className="absolute right-0 top-[calc(100%+6px)] z-30 w-full rounded-xl border border-[#dbe4e8] bg-white p-1.5 shadow-[0_12px_28px_rgba(44,42,39,0.14)] animate-fade-in">
            <button
              type="button"
              onClick={() => {
                setRoleFilter("");
                onPageReset(1);
                setRoleMenuOpen(false);
              }}
              className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                roleFilter === "" ? "bg-[#eaf7ff] text-[#008bd6]" : "text-cu-ink hover:bg-[#f5fafc]"
              }`}
            >
              Semua peran
            </button>
            {roles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setRoleFilter(role);
                  onPageReset(1);
                  setRoleMenuOpen(false);
                }}
                className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                  roleFilter === role ? "bg-[#eaf7ff] text-[#008bd6]" : "text-cu-ink hover:bg-[#f5fafc]"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
