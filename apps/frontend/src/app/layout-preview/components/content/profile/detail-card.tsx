"use client";

import React from "react";
import { MaterialIcon } from "@/components/ui/material-icon";

export type DetailCardRating = {
  label: string;
  value: number;
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

function ratingWidth(value: number) {
  if (value >= 10) return "w-full";
  if (value >= 8) return "w-4/5";
  if (value >= 7.5) return "w-3/4";
  if (value >= 6) return "w-3/5";
  if (value >= 5) return "w-1/2";
  return "w-1/3";
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
}: DetailCardProps) {
  return (
    <article
      className={`flex w-full max-w-none flex-col gap-5 rounded-lg bg-white p-4 shadow-[0_5px_14px_rgba(44,42,39,0.06)] sm:grid sm:grid-cols-[194px_minmax(0,1fr)_200px] sm:items-stretch sm:gap-6 sm:p-4 ${className ?? ""}`}
      data-name="DetailCard"
      data-node-id="159:756"
    >
      <div className="contents">
        <div className={`flex h-full min-h-[220px] w-full shrink-0 items-center justify-center self-center overflow-hidden rounded-lg sm:min-h-[275px] sm:w-[194px] sm:justify-self-center ${profileImage ? "bg-transparent" : "bg-[#3b4446]"}`}>
          {profileImage ? (
            <img
              src={profileImage}
              alt={profileAlt ?? name}
              className="size-full object-cover object-center"
            />
          ) : (
            <span className="text-3xl font-semibold text-white">{initials(name)}</span>
          )}
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-5 py-1 sm:gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-semibold tracking-[0.48px] text-[#3b4446] sm:text-4xl">
              {name}
            </h2>
            <p className="text-base tracking-[0.32px] text-[#7d7c7c] sm:text-xl">{role}</p>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium tracking-[0.28px] text-[#7d7c7c]">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-lg border border-[#bdeaff] bg-[#f3faff] px-4 py-2 text-center text-sm text-[#7d7c7c]"
                >
                  {specialty}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {ratings.map((rating) => {
                return (
                  <div key={rating.label} className="flex items-center gap-4 text-sm text-[#7d7c7c]">
                    <span className="w-[150px] shrink-0 font-medium">{rating.label}</span>
                    <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-[5px] bg-[#e5ebf2]">
                      <div className={`h-full rounded-[5px] bg-[#00a4ff] ${ratingWidth(rating.value)}`} />
                    </div>
                    <span className="w-12 shrink-0 font-medium">{rating.value.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col divide-y divide-[#e6edf2] rounded-lg border border-[#e6edf2] px-3 sm:min-h-[275px] sm:px-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex flex-1 items-center gap-3 py-3">
            <span className="flex size-7 shrink-0 items-center justify-center">
              <MaterialIcon name={metric.icon} className="text-[30px] text-[#00a4ff]" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-[#7d7c7c]">{metric.label}</p>
              <p className="text-lg font-semibold text-[#0077bf]">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
