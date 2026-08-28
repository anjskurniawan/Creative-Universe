"use client";

import React, { FormEvent, RefObject } from "react";
import type { Key } from "@react-spectrum/s2";
import { SearchField } from "@react-spectrum/s2/SearchField";
import { Picker, PickerItem } from "@react-spectrum/s2/Picker";
import type { UserManagementOptions } from "../../types";

interface UserFiltersProps {
  search: string;
  setSearch: (search: string) => void;
  roleFilter: string;
  setRoleFilter: (role: string) => void;
  roleMenuOpen?: boolean;
  setRoleMenuOpen?: (open: boolean | ((current: boolean) => boolean)) => void;
  roleMenuRef?: RefObject<HTMLDivElement | null>;
  options: UserManagementOptions | null;
  onSubmitSearch: (event?: FormEvent<HTMLFormElement> | string) => void;
  onPageReset: (page: number) => void;
}

export function UserFilters({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  options,
  onSubmitSearch,
  onPageReset,
}: UserFiltersProps) {
  const roles = options?.roles || [];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Spectrum S2 SearchField Component */}
      <div className="min-w-0 flex-1">
        <SearchField
          size="XL"
          aria-label="Cari Pengguna"
          placeholder="Cari nama, username, atau email..."
          value={search}
          onChange={(val) => {
            setSearch(val);
            if (val === "") {
              onSubmitSearch("");
            }
          }}
          onSubmit={(val) => onSubmitSearch(val)}
          onClear={() => {
            setSearch("");
            onSubmitSearch("");
          }}
        />
      </div>

      {/* Spectrum S2 Picker Component untuk Filter Role */}
      <div className="sm:w-56">
        <Picker
          size="XL"
          aria-label="Filter Peran"
          value={roleFilter || "all"}
          onChange={(key: Key | null) => {
            if (!key) return;
            const selectedKey = String(key);
            const nextRole = selectedKey === "all" ? "" : selectedKey;
            setRoleFilter(nextRole);
            onPageReset(1);
          }}
        >
          <PickerItem id="all" textValue="Semua peran">
            Semua peran
          </PickerItem>
          {roles.map((role) => (
            <PickerItem key={role} id={role} textValue={role}>
              {role}
            </PickerItem>
          ))}
        </Picker>
      </div>
    </div>
  );
}
