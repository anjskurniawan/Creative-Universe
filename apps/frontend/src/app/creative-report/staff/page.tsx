"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DetailCard, { type DetailCardRating } from "@/components/global-layout/profile/detail-card";
import ProfileCard from "@/components/global-layout/profile/card";
import { resolveStorageUrl } from "@/core/api/client";
import { creativeReportApi } from "@/features/creative-report/api";
import type { CreativeMemberProfile } from "@/features/creative-report/types";
import { useAuth } from "@/providers/auth-provider";

const labels = [["creativity", "Creativity"], ["speed", "Speed"], ["communication", "Communication"], ["quality", "Quality"], ["teamwork", "Teamwork"]] as const;

export default function CreativeReportStaffPage() {
  const [members, setMembers] = useState<CreativeMemberProfile[]>([]);
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const { hasRole } = useAuth();
  useEffect(() => { void creativeReportApi.members.list().then(setMembers); }, []);
  const member = members[selected];
  if (!member) return <p className="p-4 text-sm text-[#7b868a]">Memuat anggota Creative...</p>;
  const ratings: DetailCardRating[] = labels.map(([key, label]) => ({ label, value: member.profile_metrics[key] ?? 0 }));
  const odds = member.odds_metrics;
  const metrics = [
    { label: "Avg. Respond Time", value: odds?.avg_response_minutes != null ? `${odds.avg_response_minutes} Min` : "—", icon: "schedule" },
    { label: "On Time Rate", value: odds?.on_time_rate != null ? `${odds.on_time_rate}%` : "—", icon: "event_available" },
    { label: "User Rating", value: odds?.user_rating != null ? `${odds.user_rating} (${odds.rating_count})` : "—", icon: "star" },
    { label: "Capacity", value: odds?.capacity_percent != null ? `${odds.capacity_percent}%` : "—", icon: "speed" },
  ];
  const canEdit = hasRole("Root") || hasRole("Manajer");
  return <section className="flex w-full flex-col gap-4"><DetailCard name={member.name} role={member.position_name} ratings={ratings} metrics={metrics} onEdit={canEdit ? () => router.push(`/creative-report/staff/edit?memberId=${member.id}`) : undefined} profileImage={resolveStorageUrl(member.card_image_path) ?? undefined} /><div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(360px,1fr))]">{members.map((item, index) => <ProfileCard key={item.id} name={item.name} role={item.position_name} profileImage={resolveStorageUrl(item.card_image_path) ?? undefined} responseTime={item.odds_metrics?.avg_response_minutes != null ? `${item.odds_metrics.avg_response_minutes} min` : "—"} rating={item.odds_metrics?.user_rating != null ? `${item.odds_metrics.user_rating}/5` : "—"} score={item.odds_metrics?.average_score != null ? String(item.odds_metrics.average_score) : "—"} active={selected === index} onClick={() => setSelected(index)} />)}</div></section>;
}
