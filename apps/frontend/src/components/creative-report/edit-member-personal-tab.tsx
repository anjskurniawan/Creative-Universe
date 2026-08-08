import React from "react";
import { MaterialIcon } from "@/components/ui/material-icon";
import { EditMemberMediaPreview } from "@/components/creative-report/edit-member-media-preview";
import { EditMemberMediaUpload } from "@/components/creative-report/edit-member-media-upload";
import { Input } from "@/components/ui/form/input";
import { Button } from "@/components/ui/button";
import type { CreativeMemberProfile } from "@/features/creative-report/types";

export interface EditMemberPersonalTabProps {
  member: CreativeMemberProfile;
  setMember: React.Dispatch<React.SetStateAction<CreativeMemberProfile | null>>;
  image: File | null;
  setImage: React.Dispatch<React.SetStateAction<File | null>>;
  photo: string | null;
  photoIsVideo: boolean;
  saving: boolean;
  onSave: () => void;
}

export function EditMemberPersonalTab({
  member,
  setMember,
  image,
  setImage,
  photo,
  photoIsVideo,
  saving,
  onSave,
}: EditMemberPersonalTabProps) {
  return (
    <section>
      <div className="mt-5 grid gap-6 md:grid-cols-[350px_minmax(0,1fr)]">
        {/* Sisi Kiri: Unggah Foto/Video Profile Card */}
        <div className="flex min-w-0 flex-col gap-4">
          <EditMemberMediaPreview
            photo={photo}
            photoIsVideo={photoIsVideo}
            name={member.name}
          />
          <EditMemberMediaUpload
            fileName={image?.name}
            onFileChange={setImage}
          />
        </div>

        {/* Sisi Kanan: Input Form Fields */}
        <div className="min-w-0 md:border-l md:pl-6 md:border-[#edf0f2] flex flex-col gap-4">
          <Input
            id="name"
            label="Nama"
            value={member.name}
            onChange={(event) =>
              setMember({ ...member, name: event.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-3 w-full">
            <Input
              id="email"
              label="Email"
              value={member.email ?? ""}
              onChange={(event) =>
                setMember({ ...member, email: event.target.value })
              }
            />
            <Input
              id="whatsapp"
              label="No. WhatsApp"
              type="phone"
              value={(member.whatsapp_number ?? "")
                .replace(/^62/, "")
                .replace(/^0/, "")}
              onChange={(event) =>
                setMember({
                  ...member,
                  whatsapp_number: event.target.value,
                })
              }
              placeholder="812..."
            />
          </div>
          <Input
            id="roles"
            label="Roles"
            value={(member.roles ?? []).join(", ")}
            disabled
            className="cursor-not-allowed opacity-80"
          />
          <div className="mt-3 grid grid-cols-2 gap-3 w-full">
            <Input
              id="joined_at"
              label="Tanggal masuk"
              type="datepick"
              value={member.joined_at ?? ""}
              onChange={(event) =>
                setMember({
                  ...member,
                  joined_at: event.target.value || null,
                })
              }
              placeholder="Pilih tanggal masuk"
            />
            <Input
              id="resigned_at"
              label="Tanggal keluar"
              type="datepick"
              value={member.resigned_at ?? ""}
              onChange={(event) =>
                setMember({
                  ...member,
                  resigned_at: event.target.value || null,
                })
              }
              placeholder="Pilih tanggal keluar"
            />
          </div>
        </div>
      </div>
      {/* Tombol Simpan Tab Identitas */}
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
