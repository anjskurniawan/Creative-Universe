"use client";

import React from "react";
import { useAuth } from "@/hooks/auth";
import { ProfileCard } from "@/app/(core)/panel/profile/_components/ProfileCard/ProfileCard";
import { ProfileApps } from "@/app/(core)/panel/profile/_components/ProfileApps/ProfileApps";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="grid w-full max-w-none self-stretch grid-cols-5 gap-6 py-4 md:py-8">
  <div className="col-span-2 w-full">
    <ProfileCard user={user} />
    <ProfileApps applications={user.applications} />
  </div>
  <div className="col-span-3 flex min-h-56 w-full items-center justify-center rounded-2xl border border-dashed border-cu-line bg-cu-surface/60 p-6 text-center">
    <span className="text-sm font-semibold text-cu-muted w-full">Timeline Coming Soon</span>
  </div>
</div>
  );
}
