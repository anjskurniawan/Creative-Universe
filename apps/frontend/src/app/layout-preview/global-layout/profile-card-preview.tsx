"use client";

import { useEffect, useState } from "react";
import { creativeReportApi } from "@/features/creative-report/api";
import type { CreativeReportAssessment } from "@/features/creative-report/types";
import { getOddsCategories, getOddsDesignerProfiles } from "@/features/odds/api";
import type { OddsCategory, OddsDesignerProfile } from "@/features/odds/api";
import ProfileCard from "@/components/layout/profile/card";
import DetailCard from "@/components/layout/profile/detail-card";

type PreviewMember = CreativeReportAssessment & {
  user: CreativeReportAssessment["user"] & { departments?: [string, string] };
};

export default function ProfileCardPreview({ viewport }: { viewport: "Mobile" | "Desktop" }) {
  const [members, setMembers] = useState<PreviewMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const month = new Date().toISOString().slice(0, 7);

    void Promise.all([creativeReportApi.assessments.list({ month }), getOddsCategories(), getOddsDesignerProfiles()])
      .then(([report, categories, profiles]) => {
        if (cancelled) return;
        const categoriesById = new Map(categories.map((category: OddsCategory) => [String(category.id), category.name]));
        const profilesByUserId = new Map(profiles.map((profile: OddsDesignerProfile) => [profile.user_id, profile]));
        const nextMembers = report.groups.flatMap((group) => group.assessments).map((member) => {
          const profile = profilesByUserId.get(member.user.id);
          const specialties = (profile?.specializations ?? []).map((value) => categoriesById.get(String(value))).filter((name): name is string => Boolean(name));
          const departments: [string, string] = [specialties[0] ?? member.user.position ?? "Creative", specialties[1] ?? specialties[0] ?? "Creative"];
          return { ...member, user: { ...member.user, departments } };
        });
        setMembers(nextMembers);
        setSelectedMemberId((current) => current ?? nextMembers[0]?.id ?? null);
      })
      .catch(() => {
        if (!cancelled) setMembers([]);
      });

    return () => { cancelled = true; };
  }, []);

  const selectedMember = members.find((member) => member.id === selectedMemberId) ?? members[0];

  return (
    <section id="profile-card" className="flex w-full flex-col gap-4 scroll-mt-4">
      <DetailCard
        name={selectedMember?.user.name}
        role={selectedMember?.user.position ?? undefined}
        specialties={selectedMember?.user.departments}
        profileImage={selectedMember?.user.name.trim().toLowerCase() === "bobby linggar" ? "/images/layout-preview/profile-bobby.png" : undefined}
      />
      <div className={viewport === "Mobile" ? "grid w-full grid-cols-1 gap-4" : "grid w-full grid-cols-[repeat(auto-fit,minmax(360px,1fr))] items-start gap-4"}>
        {members.map((member) => (
          <ProfileCard
            key={member.id}
            viewport={viewport}
            name={member.user.name}
            role={member.user.position ?? "Creative Member"}
            departments={member.user.departments}
            cardImage={member.user.name.trim().toLowerCase() === "bobby linggar" ? "/images/layout-preview/profile-bobby.png" : undefined}
            onClick={() => setSelectedMemberId(member.id)}
            active={member.id === selectedMemberId}
          />
        ))}
      </div>
    </section>
  );
}
