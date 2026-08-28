"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { creativeReportApi } from "@/features/creative-report/api";
import type { CreativeMemberProfile, CreativeReportAssessment } from "@/features/creative-report/types";
import { useAuth } from "@/hooks/auth";
import { useCreativeReportSettings } from "@/features/creative-report/settings";
import type { DetailCardRating } from "./_components/DetailCard/DetailCard";

const labels = [
  ["creativity", "Creativity"],
  ["speed", "Speed"],
  ["communication", "Communication"],
  ["quality", "Quality"],
  ["teamwork", "Teamwork"],
] as const;

export function displayCreativeRole(role: CreativeMemberProfile["position_name"]) {
  return role === "SPV" ? "SPV Creative" : role;
}

export function useCreativeAgent() {
  const [members, setMembers] = useState<CreativeMemberProfile[]>([]);
  const [assessments, setAssessments] = useState<CreativeReportAssessment[]>([]);
  const [selected, setSelected] = useState(0);
  const [shouldAutoPlayDetailMedia, setShouldAutoPlayDetailMedia] = useState(false);
  const [ratingAnimationKey, setRatingAnimationKey] = useState(0);
  const router = useRouter();
  const detailCardRef = useRef<HTMLElement>(null);
  const { hasRole } = useAuth();
  const { settings } = useCreativeReportSettings();

  useEffect(() => {
    const month = new Date().toISOString().slice(0, 7);
    void Promise.all([
      creativeReportApi.members.list(),
      creativeReportApi.assessments.list({ month }),
    ]).then(([nextMembers, report]) => {
      setMembers(nextMembers);
      setAssessments(report.groups.flatMap((group) => group.assessments));
    });
  }, []);

  const member = members[selected];

  const allAspects = [...settings.collabAspects, ...settings.perfAspects];
  const selectedAspectIndexes = settings.detailCardAspectIndexes;
  const currentAssessment = assessments.find((assessment) => assessment.user.id === member?.id);

  const ratings: DetailCardRating[] = member
    ? selectedAspectIndexes.map((aspectIndex, slot) => {
        const aspect = allAspects[aspectIndex];
        return {
          label: aspect?.name ?? labels[slot]?.[1] ?? `Aspek ${slot + 1}`,
          value: currentAssessment?.creative_scores[aspectIndex] ?? 0,
          max: aspect?.maxPoints ?? 0,
        };
      })
    : [];

  const odds = member?.odds_metrics;
  const metrics = [
    {
      label: "Avg. Respond Time",
      value: odds?.avg_response_minutes != null ? `${odds.avg_response_minutes} Min` : "—",
      icon: "schedule",
    },
    {
      label: "On Time Rate",
      value: odds?.on_time_rate != null ? `${odds.on_time_rate}%` : "—",
      icon: "event_available",
    },
    {
      label: "User Rating",
      value: odds?.user_rating != null ? `${odds.user_rating} (${odds.rating_count})` : "—",
      icon: "star",
    },
    {
      label: "Capacity",
      value: odds?.capacity_percent != null ? `${odds.capacity_percent}%` : "—",
      icon: "speed",
    },
  ];

  const canEdit = hasRole("Root") || hasRole("Manajer");

  const selectMember = (index: number) => {
    setSelected(index);
    setShouldAutoPlayDetailMedia(true);
    setRatingAnimationKey((current) => current + 1);
    window.requestAnimationFrame(() =>
      detailCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  return {
    members,
    selected,
    member,
    ratings,
    metrics,
    canEdit,
    shouldAutoPlayDetailMedia,
    ratingAnimationKey,
    detailCardRef,
    selectMember,
    router,
  };
}
