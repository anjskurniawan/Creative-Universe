"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MaterialIcon } from "@/components/material-icon";

export type DetailCardRating = {
  label: string;
  value: number;
  max?: number;
};

export type DetailCardMetric = {
  label: string;
  value: string;
  icon: string;
};

export interface DetailCardProps {
  className?: string;
  name?: string;
  role?: string;
  specialties?: string[];
  ratings?: DetailCardRating[];
  metrics?: DetailCardMetric[];
  profileImage?: string;
  profileAlt?: string;
  onEdit?: () => void;
  autoPlayMedia?: boolean;
  ratingAnimationKey?: number;
}

function isVideoSource(source?: string) {
  return Boolean(source && /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(source));
}

function DetailMedia({ source, alt, autoPlay }: { source?: string; alt: string; autoPlay: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const video = isVideoSource(source);
  useEffect(() => {
    if (!video || !videoRef.current) return;
    if (autoPlay) void videoRef.current.play();
    else videoRef.current.pause();
  }, [autoPlay, source, video]);

  if (!source) return null;
  if (video) return <video ref={videoRef} src={source} muted loop playsInline preload="metadata" className="size-full object-cover object-center" />;
  return <img src={source} alt={alt} className="size-full object-cover object-center" />;
}

function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}

const defaultRatings: DetailCardRating[] = [
  { label: "Creativity", value: 5 },
  { label: "Speed", value: 6 },
  { label: "Communication", value: 7.5 },
  { label: "Quality", value: 8 },
  { label: "Teamwork", value: 6.5 },
];

const defaultMetrics: DetailCardMetric[] = [
  { label: "Avg. Respond Time", value: "45 Min", icon: "schedule" },
  { label: "On Time Rate", value: "15%", icon: "event_available" },
  { label: "User Rating", value: "4.5 (100)", icon: "star" },
  { label: "Capacity", value: "90%", icon: "speed" },
];

function RatingBars({ ratings, animationKey }: { ratings: DetailCardRating[]; animationKey: number }) {
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animationKey || !barsRef.current) return;
    const context = gsap.context(() => {
      const fills = gsap.utils.toArray<HTMLElement>("[data-detail-rating-fill]");
      gsap.fromTo(
        fills,
        { width: "0%" },
        {
          width: (_, element) => element.dataset.fill ?? "0%",
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
        },
      );
    }, barsRef);
    return () => context.revert();
  }, [animationKey]);

  return <div ref={barsRef} className="flex flex-col gap-3">
    {ratings.map((rating) => {
      const maximum = rating.max ?? 10;
      const percentage = maximum > 0 ? Math.max(0, Math.min(100, (rating.value / maximum) * 100)) : 0;
      return (
        <div key={rating.label} className="flex items-center gap-2 text-xs text-[#7d7c7c] sm:gap-4 sm:text-sm">
          <span className="w-[140px] shrink-0 whitespace-nowrap font-medium sm:w-[220px]">{rating.label}</span>
          <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-[5px] bg-[#e5ebf2]">
            {percentage > 0 && <div data-detail-rating-fill data-fill={`${percentage}%`} className="h-full rounded-[5px] bg-[#00a4ff]" style={{ width: `${percentage}%` }} />}
          </div>
          <span className="w-12 shrink-0 font-medium sm:w-16">{rating.value}/{maximum}</span>
        </div>
      );
    })}
  </div>;
}

export default function DetailCard({
  className,
  name = "Anjas Kurniawan",
  role = "Graphic Designer",
  specialties = ["Key Visual", "Campaign", "Product Ads", "Branding"],
  ratings = defaultRatings,
  metrics = defaultMetrics,
  profileImage,
  profileAlt,
  onEdit,
  autoPlayMedia = false,
  ratingAnimationKey = 0,
}: DetailCardProps) {
  return (
    <article
      className={`flex w-full max-w-none flex-col gap-4 rounded-lg bg-white p-3 shadow-[0_5px_14px_rgba(44,42,39,0.06)] sm:grid sm:grid-cols-[194px_minmax(0,1fr)_200px] sm:items-stretch sm:gap-6 sm:p-4 ${className ?? ""}`}
      data-name="DetailCard"
      data-node-id="159:756"
    >
      <div className={`flex h-36 w-full shrink-0 items-center justify-center self-center overflow-hidden rounded-lg sm:h-full sm:min-h-[275px] sm:w-[194px] sm:justify-self-center ${profileImage ? "bg-transparent" : "bg-[#3b4446]"}`}>
          {profileImage ? (
            <DetailMedia source={profileImage} alt={profileAlt ?? name} autoPlay={autoPlayMedia} />
          ) : (
            <span className="text-3xl font-semibold text-white">{initials(name)}</span>
          )}
        </div>

      <div className="flex min-w-0 flex-col justify-between gap-4 py-1 sm:gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-semibold tracking-[0.48px] text-[#3b4446] sm:text-4xl">
                {name}
              </h2>
            <p className="text-sm tracking-[0.32px] text-[#7d7c7c] sm:text-xl">{role}</p>
            </div>
            {onEdit && <button type="button" onClick={onEdit} className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg border border-[#bdeaff] bg-[#f3faff] px-2.5 text-xs font-semibold text-[#0077bf] transition-colors hover:bg-[#dff6ff] sm:h-9 sm:px-3" aria-label={`Edit ${name}`}>
              <MaterialIcon name="edit" size="sm" />
              Edit
            </button>}
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium tracking-[0.28px] text-[#7d7c7c]">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-lg border border-[#bdeaff] bg-[#f3faff] px-3 py-1.5 text-center text-xs text-[#7d7c7c] sm:px-4 sm:py-2 sm:text-sm"
                >
                  {specialty}
                </span>
              ))}
            </div>
            <RatingBars ratings={ratings} animationKey={ratingAnimationKey} />
          </div>
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-[#e6edf2] overflow-hidden rounded-lg border border-[#e6edf2] sm:flex sm:min-h-[275px] sm:flex-col sm:divide-x-0 sm:divide-y sm:px-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex min-w-0 items-center gap-2 px-2 py-2 sm:flex-1 sm:gap-3 sm:px-0 sm:py-3">
            <span className="flex size-7 shrink-0 items-center justify-center">
              <MaterialIcon name={metric.icon} className="text-2xl text-[#00a4ff] sm:text-[30px]" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-[#7d7c7c]">{metric.label}</p>
              <p className="text-base font-semibold text-[#0077bf] sm:text-lg">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
