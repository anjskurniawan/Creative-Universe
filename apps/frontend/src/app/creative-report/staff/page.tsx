"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DetailCard, { type DetailCardRating } from "@/components/layout/profile/detail-card";
import ProfileCard from "@/components/layout/profile/card";
import { resolveStorageUrl } from "@/core/api/client";
import { creativeReportApi } from "@/features/creative-report/api";
import type { CreativeMemberProfile, CreativeReportAssessment } from "@/features/creative-report/types";
import { useAuth } from "@/providers/auth-provider";
import { getCollabAspects, getDetailCardAspectIndexes, getPerfAspects } from "../settings";

const labels = [["creativity", "Creativity"], ["speed", "Speed"], ["communication", "Communication"], ["quality", "Quality"], ["teamwork", "Teamwork"]] as const;

function displayCreativeRole(role: CreativeMemberProfile["position_name"]) {
  return role === "SPV" ? "SPV Creative" : role;
}

export default function CreativeReportCreativeAgentPage() {
  const [members, setMembers] = useState<CreativeMemberProfile[]>([]);
  const [assessments, setAssessments] = useState<CreativeReportAssessment[]>([]);
  const [selected, setSelected] = useState(0);
  const [shouldAutoPlayDetailMedia, setShouldAutoPlayDetailMedia] = useState(false);
  const [ratingAnimationKey, setRatingAnimationKey] = useState(0);
  const router = useRouter();
  const detailCardRef = useRef<HTMLElement>(null);
  const { hasRole } = useAuth();

  useEffect(() => {
    const month = new Date().toISOString().slice(0, 7);
    void Promise.all([creativeReportApi.members.list(), creativeReportApi.assessments.list({ month })]).then(([nextMembers, report]) => {
      setMembers(nextMembers);
      setAssessments(report.groups.flatMap((group) => group.assessments));
    });
  }, []);

  const member = members[selected];
  if (!member) return <p className="p-4 text-sm text-[#7b868a]">Memuat anggota Creative...</p>;

  const allAspects = [...getCollabAspects(), ...getPerfAspects()];
  const selectedAspectIndexes = getDetailCardAspectIndexes();
  const currentAssessment = assessments.find((assessment) => assessment.user.id === member.id);
  const ratings: DetailCardRating[] = selectedAspectIndexes.map((aspectIndex, slot) => {
    const aspect = allAspects[aspectIndex];
    return {
      label: aspect?.name ?? labels[slot]?.[1] ?? `Aspek ${slot + 1}`,
      value: currentAssessment?.creative_scores[aspectIndex] ?? 0,
      max: aspect?.maxPoints ?? 0,
    };
  });
  const odds = member.odds_metrics;
  const metrics = [
    { label: "Avg. Respond Time", value: odds?.avg_response_minutes != null ? `${odds.avg_response_minutes} Min` : "—", icon: "schedule" },
    { label: "On Time Rate", value: odds?.on_time_rate != null ? `${odds.on_time_rate}%` : "—", icon: "event_available" },
    { label: "User Rating", value: odds?.user_rating != null ? `${odds.user_rating} (${odds.rating_count})` : "—", icon: "star" },
    { label: "Capacity", value: odds?.capacity_percent != null ? `${odds.capacity_percent}%` : "—", icon: "speed" },
  ];
  const canEdit = hasRole("Root") || hasRole("Manajer");
  const selectMember = (index: number) => {
    setSelected(index);
    setShouldAutoPlayDetailMedia(true);
    setRatingAnimationKey((current) => current + 1);
    window.requestAnimationFrame(() => detailCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <section ref={detailCardRef} className="flex w-full scroll-mt-4 flex-col gap-4">
      <DetailCard
        name={member.name}
        role={displayCreativeRole(member.position_name)}
        specialties={member.specialties?.length ? member.specialties : ["Belum ada spesialisasi ODDS"]}
        ratings={ratings}
        metrics={metrics}
        onEdit={canEdit ? () => router.push(`/creative-report/creative-agent/edit?memberId=${member.id}`) : undefined}
        autoPlayMedia={shouldAutoPlayDetailMedia}
        ratingAnimationKey={ratingAnimationKey}
        profileImage={resolveStorageUrl(member.card_image_path) ?? undefined}
      />
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(360px,1fr))]">
        {members.map((item, index) => (
          <ProfileCard
            key={item.id}
            name={item.name}
            role={displayCreativeRole(item.position_name)}
            departments={item.specialties?.length ? item.specialties : ["Belum ada spesialisasi ODDS"]}
            capacity={item.odds_metrics?.capacity_percent ?? 0}
            cardImage={resolveStorageUrl(item.card_image_path) ?? undefined}
            responseTime={item.odds_metrics?.avg_response_minutes != null ? `${item.odds_metrics.avg_response_minutes} min` : "—"}
            rating={item.odds_metrics?.user_rating != null ? `${item.odds_metrics.user_rating}/5` : "—"}
            score={item.odds_metrics?.average_score != null ? String(item.odds_metrics.average_score) : "—"}
            active={selected === index}
            onClick={() => selectMember(index)}
          />
        ))}
      </div>
    </section>
  );
}
