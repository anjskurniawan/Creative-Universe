"use client";

import React, { useEffect, useState } from "react";
import { creativeReportApi } from "@/features/creative-report/api";
import type { CreativeReportAssessment } from "@/features/creative-report/types";
import { getOddsCategories, getOddsDesignerProfiles } from "@/features/odds/api";
import type { OddsCategory, OddsDesignerProfile } from "@/features/odds/api";

type PreviewMember = CreativeReportAssessment & {
  user: CreativeReportAssessment["user"] & { departments?: [string, string] };
};
import ProfileCard from "./profile/card";
import DetailCard from "./profile/detail-card";

export type ContentProps = {
  className?: string;
  heading?: string;
  subheading?: string;
  viewport?: "Mobile" | "Desktop"; // ← tambahin ini
  profileCards?: boolean;
  children?: React.ReactNode;
};

export default function Content({
  className,
  viewport = "Desktop", // ← tambahin ini, kasih default
  profileCards = true,
  children,
}: ContentProps) {
  const [members, setMembers] = useState<PreviewMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const month = new Date().toISOString().slice(0, 7);

    void Promise.all([
      creativeReportApi.assessments.list({ month }),
      getOddsCategories(),
      getOddsDesignerProfiles(),
    ]).then(([report, categories, profiles]) => {
        if (!cancelled) {
          const categoriesById = new Map(categories.map((category: OddsCategory) => [String(category.id), category.name]));
          const profilesByUserId = new Map(profiles.map((profile: OddsDesignerProfile) => [profile.user_id, profile]));

          const nextMembers = report.groups.flatMap((group) => group.assessments).map((member) => {
            const profile = profilesByUserId.get(member.user.id);
            const specializations = (profile?.specializations ?? [])
              .map((specialization) => categoriesById.get(String(specialization)))
              .filter((name): name is string => Boolean(name));
            const departments: [string, string] = [
              specializations[0] ?? member.user.position ?? "Creative",
              specializations[1] ?? specializations[0] ?? "Creative",
            ];

            return { ...member, user: { ...member.user, departments } };
          });
          setMembers(nextMembers);
          setSelectedMemberId((current) => current ?? nextMembers[0]?.id ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) setMembers([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectedMember = members.find((member) => member.id === selectedMemberId) ?? members[0];

  return (
    <div
      className={
        className || "flex flex-col items-start p-4 w-full h-[374px] relative"
      }
      data-node-id="112:747"
      data-name="Content / Main"
    >
      <div className="layout-preview-content-scroll flex h-full min-h-0 w-full flex-col items-start justify-start gap-4 overflow-auto">
        {profileCards && <DetailCard
          name={selectedMember?.user.name}
          role={selectedMember?.user.position ?? undefined}
          specialties={selectedMember?.user.departments}
          profileImage={
            selectedMember?.user.name.trim().toLowerCase() === "bobby linggar"
              ? "/images/layout-preview/profile-bobby.png"
              : undefined
          }
        />}
        {profileCards && <div
          id="profile-card"
          className={
            viewport === "Mobile"
              ? "grid w-full grid-cols-1 gap-4 p-1"
              : "grid w-full grid-cols-[repeat(auto-fit,minmax(360px,1fr))] items-start gap-4 p-1"
          }
        >
          {members.map((member) => (
            <ProfileCard
              key={member.id}
              viewport={viewport}
              name={member.user.name}
              role={member.user.position ?? "Creative Member"}
              departments={member.user.departments}
              profileImage={
                member.user.name.trim().toLowerCase() === "bobby linggar"
                  ? "/images/layout-preview/profile-bobby.png"
                  : undefined
              }
              onClick={() => setSelectedMemberId(member.id)}
              active={member.id === selectedMemberId}
            />
          ))}
        </div>}
        {!profileCards && children}
      </div>
    </div>
  );
}
