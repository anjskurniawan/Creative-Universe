"use client";

import { useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/core/auth";
import { CREATIVE_ROLES } from "./LandingPage.config";

export function getWeatherLabel(code: number) { if (code === 0) return "Clear"; if ([1, 2].includes(code)) return "Partly Cloudy"; if (code === 3) return "Cloudy"; if ([45, 48].includes(code)) return "Foggy"; if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle"; if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain"; if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow"; if ([95, 96, 99].includes(code)) return "Thunderstorm"; return "Unknown"; }

export function useLandingLogic(user: AuthUser | null) {
  const [weather, setWeather] = useState<{ temperature: number; uvIndex: number; label: string } | null>(null);
  const [showMediaAgent, setShowMediaAgent] = useState(false);
  const creativeRole = user?.roles.find((role) => CREATIVE_ROLES.includes(role)) ?? null;
  const firstName = user?.name.trim().split(/\s+/)[0] || "Creative";
  const greeting = useMemo(() => { const hour = new Date().getHours(); return hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening"; }, []);

  useEffect(() => { if (!creativeRole) return; const timer = window.setInterval(() => setShowMediaAgent((value) => !value), 10000); return () => window.clearInterval(timer); }, [creativeRole]);
  useEffect(() => { let cancelled = false; const params = new URLSearchParams({ latitude: "-7.253861", longitude: "112.777322", current: "temperature_2m,uv_index,weather_code", timezone: "auto" }); fetch(`https://api.open-meteo.com/v1/forecast?${params}`).then((response) => response.ok ? response.json() : null).then((data) => { if (!cancelled && typeof data?.current?.temperature_2m === "number" && typeof data?.current?.uv_index === "number" && typeof data?.current?.weather_code === "number") setWeather({ temperature: data.current.temperature_2m, uvIndex: data.current.uv_index, label: getWeatherLabel(data.current.weather_code) }); }).catch(() => undefined); return () => { cancelled = true; }; }, []);
  return { firstName, greeting, creativeRole, showMediaAgent, weather, applications: user?.applications ?? [] };
}
