"use client";

import React, { useLayoutEffect, useRef } from "react";
import { MaterialIcon } from "@/components/material-icon";

export type CardStatus = "FullBook" | "Available" | "Busy";
export type ProfileCardState = "Fullbook" | "Available" | "Busy";
export type CardViewport = "Mobile" | "Desktop";

export interface CardProps {
  className?: string;
  onClick?: () => void;
  active?: boolean;
  status?: CardStatus;
  state?: ProfileCardState;
  viewport?: CardViewport;
  name?: string;
  role?: string;
  departments?: string[];
  responseTime?: string;
  rating?: string;
  score?: string;
  capacity?: number;
  profileImage?: string;
  profileAlt?: string;
  showStats?: boolean;
  showAvailability?: boolean;
  compact?: boolean;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

function MarqueeTrack({ text }: { text: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateDuration = () => {
      const distance = track.scrollWidth / 4;
      const duration = distance > 0 ? distance : 12;
      track.style.setProperty("--cu-profile-marquee-duration", `${duration}s`);
    };

    updateDuration();
    const observer = new ResizeObserver(updateDuration);
    observer.observe(track);
    return () => observer.disconnect();
  }, [text]);

  return <div ref={trackRef} className="cu-profile-marquee-track flex w-max">
    {[0, 1, 2, 3].map((copy) => (
      <span key={copy} aria-hidden={copy > 0} className="block shrink-0 pr-8">
        {text}
      </span>
    ))}
  </div>;
}

function isVideoSource(source?: string) {
  return Boolean(source && /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(source));
}

const STATUS_STYLES: Record<
  CardStatus,
  { label: string; capacity: number; text: string; bg: string }
> = {
  FullBook: {
    label: "Full Book",
    capacity: 100,
    text: "text-[#ff5e5e]",
    bg: "bg-[#ffe5e5]",
  },
  Available: {
    label: "Available",
    capacity: 20,
    text: "text-[#04b904]",
    bg: "bg-[#f1ffe3]",
  },
  Busy: {
    label: "Busy",
    capacity: 60,
    text: "text-[#ffae00]",
    bg: "bg-[#fff5e0]",
  },
};

function Icon({ name }: { name: string }) {
  return (
    <MaterialIcon
      name={name}
      className="inline-flex size-6 items-center justify-center text-2xl leading-none text-[#00a1ff]"
      aria-hidden
    />
  );
}

function StatItem({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center justify-center gap-1 lg:flex-none lg:justify-start">
      <div className="hidden size-7 shrink-0 items-center justify-center lg:flex">
        <Icon name={icon} />
      </div>
      <div className="flex min-w-0 flex-col items-center justify-center text-center lg:items-start lg:text-left">
        <strong className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold leading-[14px] tracking-[0.24px] text-[#0077bf] lg:text-sm lg:leading-4 lg:tracking-[0.28px]">
          {value}
        </strong>
        <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] leading-3 tracking-[0.2px] text-[#7d7c7c] lg:text-[11px] lg:leading-[13px] lg:tracking-[0.22px]">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function Card({
  className = "",
  onClick,
  active = false,
  status = "FullBook",
  state,
  name = "Anjas Kurniawan",
  role = "Graphic Designer",
  departments = ["Retail Marketing"],
  responseTime = "10 min",
  rating = "4.5/5",
  score = "12345",
  capacity,
  profileImage,
  profileAlt = `${name} profile`,
  showStats = true,
  showAvailability = true,
  compact = false,
}: CardProps) {
  const mediaRef = useRef<HTMLVideoElement>(null);
  const configuredStatus: CardStatus = state === "Fullbook" ? "FullBook" : (state ?? status);
  const configuredStyle = STATUS_STYLES[configuredStatus];
  const capacityValue = Math.max(0, Math.min(100, capacity ?? configuredStyle.capacity));
  const resolvedStatus: CardStatus = capacity !== undefined
    ? capacityValue >= 100 ? "FullBook" : capacityValue >= 70 ? "Busy" : "Available"
    : configuredStatus;
  const statusStyle = STATUS_STYLES[resolvedStatus];
  const departmentsText = departments.filter(Boolean).join(" • ");
  const videoMedia = isVideoSource(profileImage);

  return (
    <article
      className={`flex w-full min-w-0 flex-col items-start gap-2 overflow-hidden rounded-lg bg-white p-2 text-[#3b4446] shadow-[0_5px_14px_rgba(44,42,39,0.06)] ${compact ? "" : "lg:min-w-[360px] lg:p-4"} ${onClick ? "cursor-pointer transition-[box-shadow,outline-color,transform] duration-300 ease-out will-change-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(0,164,255,0.28),0_0_18px_rgba(0,164,255,0.28)]" : ""} ${active ? "outline outline-2 outline-[#00a4ff] shadow-[0_0_18px_rgba(0,164,255,0.42)]" : ""} ${className}`}
      onClick={onClick}
      onMouseEnter={videoMedia ? () => void mediaRef.current?.play() : undefined}
      onMouseLeave={videoMedia ? () => { mediaRef.current?.pause(); if (mediaRef.current) mediaRef.current.currentTime = 0; } : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (event) => { if (event.key === "Enter" || event.key === " ") onClick(); } : undefined}
    >
      <div
        className={`flex w-full min-w-0 items-center gap-2 ${compact ? "" : "lg:gap-4"}`}
      >
        <div
          className={`shrink-0 overflow-hidden rounded-lg border-0 bg-[#3b4446] outline-none ring-0 ${compact ? "size-14" : "size-[74px] lg:h-[154px] lg:w-[145px]"}`}
        >
          {videoMedia && profileImage ? (
            <video ref={mediaRef} src={profileImage} muted loop playsInline preload="metadata" className="block size-full object-contain" />
          ) : profileImage ? (
            <img
              src={profileImage}
              alt={profileAlt}
              className="block size-full object-contain"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-xl font-semibold text-white">
              {getInitials(name)}
            </span>
          )}
        </div>
        <div
          className={`flex min-w-0 flex-1 flex-col items-start gap-2 ${compact ? "" : "lg:gap-4"}`}
        >
          <header className="flex w-full min-w-0 flex-col items-start gap-1">
            <h3
              className={`w-full overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-[#3b4446] ${compact ? "text-sm leading-4 tracking-[0.2px]" : "text-base leading-5 tracking-[0.32px]"}`}
            >
              {name}
            </h3>
            <p
              className={`w-full overflow-hidden text-ellipsis whitespace-nowrap text-[#7d7c7c] ${compact ? "text-[10px] leading-3 tracking-[0.16px]" : "text-xs leading-[14px] tracking-[0.24px]"}`}
            >
              {role}
            </p>
          </header>
          {showAvailability && <div
            className="flex w-full flex-col items-start gap-1 lg:w-auto lg:gap-2"
          >
            <div
              className="flex max-w-full items-center gap-[5px] overflow-hidden whitespace-nowrap text-[10px] font-medium leading-3 tracking-[0.2px] lg:max-w-none lg:text-xs lg:leading-[14px] lg:tracking-[0.24px]"
            >
              <span
                className={`size-[9px] shrink-0 rounded-full ${statusStyle.bg}`}
              />
              <span className={statusStyle.text}>{statusStyle.label}</span>
              <span className="text-[#7d7c7c] lg:hidden">|</span>
              <span className="text-[#7d7c7c] lg:hidden">{capacityValue}% Capacity</span>
            </div>
            <div className={`hidden rounded-lg border border-current px-3 py-1.5 text-xs leading-[14px] tracking-[0.24px] lg:block ${statusStyle.text} ${statusStyle.bg}`}>{capacityValue}% Capacity</div>
          </div>}
          <div
            className={`w-full min-w-0 overflow-hidden whitespace-nowrap text-[#7d7c7c] ${compact ? "text-[9px] leading-3 tracking-[0.14px]" : "text-[10px] leading-3 tracking-[0.2px] lg:text-xs lg:leading-[14px] lg:tracking-[0.24px]"}`}
            aria-label={departmentsText}
          >
            <MarqueeTrack text={departmentsText} />
          </div>
        </div>
      </div>
      {showStats && <div
        className="flex w-full items-center justify-between border-y border-[#e6edf2] px-1 py-2 lg:px-2"
      >
        <StatItem
          icon="avg_pace"
          value={responseTime}
          label="Avg. Response"
        />
        <div className="hidden w-px self-stretch bg-[#e6edf2] lg:block" aria-hidden />
        <StatItem
          icon="kid_star"
          value={rating}
          label="Avg. Rating"
        />
        <div className="hidden w-px self-stretch bg-[#e6edf2] lg:block" aria-hidden />
        <StatItem
          icon="readiness_score"
          value={score}
          label="Avg. Score"
        />
      </div>}
    </article>
  );
}
