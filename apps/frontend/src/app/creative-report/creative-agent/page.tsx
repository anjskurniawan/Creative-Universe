"use client";

import DetailCard from "@/components/layout/profile/detail-card";
import ProfileCard from "@/components/layout/profile/card";
import { resolveStorageUrl } from "@/core/api/client";
import { useCreativeAgent, displayCreativeRole } from "./use-creative-agent";

export default function CreativeReportCreativeAgentPage() {
  const {
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
  } = useCreativeAgent();

  if (!member) return <p className="p-4 text-sm text-[#7b868a]">Memuat anggota Creative...</p>;

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
