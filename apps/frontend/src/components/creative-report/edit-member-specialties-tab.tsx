import React from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { Input } from "@/components/ui/form/input";
import { Button } from "@/components/ui/button";
import type { CreativeMemberProfile } from "@/features/creative-report/types";
import type { OddsCategory } from "@/features/odds/api";

export interface EditMemberSpecialtiesTabProps {
  member: CreativeMemberProfile;
  setMember: React.Dispatch<React.SetStateAction<CreativeMemberProfile | null>>;
  categories: OddsCategory[];
  selected: Set<string>;
  saving: boolean;
  onSave: () => void;
}

export function EditMemberSpecialtiesTab({
  member,
  setMember,
  categories,
  selected,
  saving,
  onSave,
}: EditMemberSpecialtiesTabProps) {
  return (
    <section className="rounded-2xl border p-5 border-[#edf0f2] bg-white shadow-[0_8px_24px_rgba(44,42,39,0.04)]">
      {/* Kategori Spesialisasi Checkbox */}
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {categories.map((category) => (
          <Input
            key={category.id}
            id={`spec-${category.id}`}
            type="checkbox"
            label={category.name}
            checked={selected.has(String(category.id))}
            onChange={() => {
              const next = new Set(selected);
              if (next.has(String(category.id))) {
                next.delete(String(category.id));
              } else {
                next.add(String(category.id));
              }
              setMember({
                ...member,
                odds_profile: {
                  id: member.odds_profile?.id ?? 0,
                  status: member.odds_profile?.status ?? "available",
                  is_active: member.odds_profile?.is_active ?? true,
                  specializations: Array.from(next),
                },
              });
            }}
            className="flex items-center gap-2 rounded-xl border px-3 py-3 text-sm transition-colors border-slate-200 bg-slate-50/70 text-slate-700 hover:border-[#bdb0f5] hover:bg-[#faf9ff]"
          />
        ))}
      </div>

      <Input
        id="odds-active"
        type="checkbox"
        label="Aktif di ODDS"
        description="Tampilkan dan izinkan agent masuk antrean tugas ODDS."
        checked={member.odds_profile?.is_active ?? true}
        onChange={(event) =>
          setMember({
            ...member,
            odds_profile: {
              id: member.odds_profile?.id ?? 0,
              status: member.odds_profile?.status ?? "available",
              is_active: event.target.checked,
              specializations: member.odds_profile?.specializations ?? [],
            },
          })
        }
        className="mt-5 rounded-xl border px-4 py-3 text-sm border-[#edf0f2] bg-[#fbfcfd] text-[#3b4446]"
      />
      {/* Tombol Simpan Tab Spesialisasi */}
      <div className="mt-6 flex justify-end border-t border-[#edf0f2] pt-4">
        <Button
          type="button"
          loading={saving}
          onClick={onSave}
          className="inline-flex h-10 w-auto gap-2 rounded-xl px-4 text-sm font-semibold shadow-sm bg-[#6d46eb] text-white hover:brightness-110 active:brightness-95"
        >
          <MaterialIcon name="save" size="sm" />
          Simpan
        </Button>
      </div>
    </section>
  );
}
