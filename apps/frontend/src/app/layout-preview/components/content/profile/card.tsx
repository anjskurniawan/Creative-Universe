"use client";

import React from "react";
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
  departments?: [string, string];
  responseTime?: string;
  rating?: string;
  score?: string;
  capacity?: number;
  profileImage?: string;
  profileAlt?: string;
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
  showIcon,
  isMobile,
}: {
  icon: string;
  value: string;
  label: string;
  showIcon: boolean;
  isMobile: boolean;
}) {
  return (
    <div className="flex min-w-0 items-center gap-1 max-[600px]:flex-1 max-[600px]:justify-center">
      {showIcon && (
        <div className="flex size-7 shrink-0 items-center justify-center">
          <Icon name={icon} />
        </div>
      )}
      <div className="flex min-w-0 flex-col items-start max-[600px]:items-center max-[600px]:justify-center max-[600px]:text-center">
        <strong className={`w-full overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-[#0077bf] ${isMobile ? "text-xs leading-[14px] tracking-[0.24px]" : "text-sm leading-4 tracking-[0.28px]"}`}>
          {value}
        </strong>
        <span className={`overflow-hidden text-ellipsis whitespace-nowrap text-[#7d7c7c] ${isMobile ? "text-[10px] leading-3 tracking-[0.2px]" : "text-[11px] leading-[13px] tracking-[0.22px]"}`}>
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
  viewport = "Desktop",
  name = "Anjas Kurniawan",
  role = "Graphic Designer",
  departments = ["Retail Marketing", "Retail Marketing"],
  responseTime = "10 min",
  rating = "4.5/5",
  score = "12345",
  capacity,
  profileImage,
  profileAlt = `${name} profile`,
}: CardProps) {
  const resolvedStatus: CardStatus =
    state === "Fullbook" ? "FullBook" : (state ?? status);
  const statusStyle = STATUS_STYLES[resolvedStatus];
  const isMobile = viewport === "Mobile";
  const capacityValue = capacity ?? statusStyle.capacity;

  return (
    <article
      className={`flex ${isMobile ? "w-full min-w-0 p-2" : "w-full min-w-[360px] p-4"} flex-col items-start gap-2 overflow-hidden rounded-lg bg-white text-[#3b4446] shadow-[0_5px_14px_rgba(44,42,39,0.06)] ${onClick ? "cursor-pointer transition-[box-shadow,outline-color,transform] duration-300 ease-out will-change-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(0,164,255,0.28),0_0_18px_rgba(0,164,255,0.28)]" : ""} ${active ? "outline outline-2 outline-[#00a4ff] shadow-[0_0_18px_rgba(0,164,255,0.42)]" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (event) => { if (event.key === "Enter" || event.key === " ") onClick(); } : undefined}
    >
      <div
        className={`flex w-full min-w-0 items-center ${isMobile ? "gap-2" : "gap-4"}`}
      >
        <div
          className={`shrink-0 overflow-hidden rounded-lg border-0 outline-none ring-0 bg-[#3b4446] ${isMobile ? "size-[74px]" : "h-[154px] w-[145px]"}`}
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt={profileAlt}
              className="block size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-xl font-semibold text-white">
              {getInitials(name)}
            </span>
          )}
        </div>
        <div
          className={`flex min-w-0 flex-1 flex-col items-start ${isMobile ? "gap-2" : "gap-4"}`}
        >
          <header className="flex w-full min-w-0 flex-col items-start gap-1">
            <h3
              className={`w-full overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-[#3b4446] ${isMobile ? "text-base leading-5 tracking-[0.32px]" : "text-base leading-5 tracking-[0.32px]"}`}
            >
              {name}
            </h3>
            <p
              className={`w-full overflow-hidden text-ellipsis whitespace-nowrap text-[#7d7c7c] ${isMobile ? "text-xs leading-[14px] tracking-[0.24px]" : "text-xs leading-[14px] tracking-[0.24px]"}`}
            >
              {role}
            </p>
          </header>
          <div
            className={`flex flex-col items-start ${isMobile ? "w-full gap-1" : "gap-2"}`}
          >
            <div
              className={`flex items-center gap-[5px] whitespace-nowrap font-medium ${isMobile ? "max-w-full overflow-hidden text-[10px] leading-3 tracking-[0.2px]" : "text-xs leading-[14px] tracking-[0.24px]"}`}
            >
              <span
                className={`size-[9px] shrink-0 rounded-full ${statusStyle.bg}`}
              />
              <span className={statusStyle.text}>{statusStyle.label}</span>
              {isMobile && (
                <>
                  <span className="text-[#7d7c7c]">|</span>
                  <span className="text-[#7d7c7c]">
                    {capacityValue}% Capacity
                  </span>
                </>
              )}
            </div>
            {!isMobile && (
              <div
                className={`rounded-lg border ${isMobile ? "px-4 py-2 text-sm leading-4 tracking-[0.28px]" : "px-3 py-1.5 text-xs leading-[14px] tracking-[0.24px]"} ${statusStyle.text} ${statusStyle.bg} border-current`}
              >
                {capacityValue}% Capacity
              </div>
            )}
          </div>
          <div
            className={`w-full min-w-0 overflow-hidden whitespace-nowrap text-[#7d7c7c] ${isMobile ? "text-[10px] leading-3 tracking-[0.2px]" : "text-xs leading-[14px] tracking-[0.24px]"}`}
            aria-label={`${departments[0]} • ${departments[1]}`}
          >
            <div className="cu-profile-marquee-track flex w-max">
              {[0, 1, 2, 3].map((copy) => (
                <span
                  key={copy}
                  aria-hidden={copy > 0}
                  className="block shrink-0 pr-8"
                >
                  {departments[0]} • {departments[1]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`flex w-full items-center justify-between border-y border-[#e6edf2] py-2 ${isMobile ? "px-1" : "px-2"}`}
      >
        <StatItem
          icon="avg_pace"
          value={responseTime}
          label="Avg. Response"
          showIcon={!isMobile}
          isMobile={isMobile}
        />
        {!isMobile && (
          <div className="w-px self-stretch bg-[#e6edf2]" aria-hidden />
        )}
        <StatItem
          icon="kid_star"
          value={rating}
          label="Avg. Rating"
          showIcon={!isMobile}
          isMobile={isMobile}
        />
        {!isMobile && (
          <div className="w-px self-stretch bg-[#e6edf2]" aria-hidden />
        )}
        <StatItem
          icon="readiness_score"
          value={score}
          label="Avg. Score"
          showIcon={!isMobile}
          isMobile={isMobile}
        />
      </div>
    </article>
  );
}
