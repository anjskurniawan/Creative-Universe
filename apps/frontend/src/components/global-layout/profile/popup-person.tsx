"use client";

import { resolveStorageUrl } from "@/core/api/client";
import ProfileCard from "./card";

export type PopupPersonProps = {
  name: string;
  role?: string | null;
  division?: string | null;
  avatarPath?: string | null;
  className?: string;
};

export default function PopupPerson({
  name,
  role,
  division,
  avatarPath,
  className = "",
}: PopupPersonProps) {
  const resolvedRole = role ?? "Creative";
  const resolvedDivision = division ?? "Creative";

  return (
    <ProfileCard
      compact
      showAvailability={false}
      showStats={false}
      name={name}
      role={resolvedRole}
      departments={[resolvedDivision, resolvedRole]}
      profileImage={resolveStorageUrl(avatarPath) ?? undefined}
      className={`!min-w-0 shadow-[0_12px_28px_rgba(44,42,39,0.18)] ${className}`}
    />
  );
}
