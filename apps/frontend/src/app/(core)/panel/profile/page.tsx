"use client";

import React from "react";
import { useAuth } from "@/providers/auth-provider";
import { ProfileCard } from "@/components/panel/profile/profile-card";
import { ProfileApps } from "@/components/panel/profile/profile-apps";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto w-full max-w-4xl py-4 md:py-8">
      <ProfileCard user={user} />
      <ProfileApps applications={user.applications} />
    </div>
  );
}
