import { useCallback, useEffect, useMemo, useState } from "react";
import type { LandingTextProps } from "./LandingText.types";

function getWeatherLabel(code: number) {
  if (code === 0) return "Clear";
  if ([1, 2].includes(code)) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown";
}

export function useLandingTextLogic({ creativeRole, onTypingComplete }: Pick<LandingTextProps, "creativeRole" | "onTypingComplete">) {
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(Boolean(creativeRole));
  const [weather, setWeather] = useState<{ temperature: number; uvIndex: number; label: string } | null>(null);
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsWelcomeVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadWeather = async (latitude: number, longitude: number) => {
      try {
        const params = new URLSearchParams({
          latitude: String(latitude),
          longitude: String(longitude),
          current: "temperature_2m,uv_index,weather_code",
          timezone: "auto",
        });
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && typeof data.current?.temperature_2m === "number" && typeof data.current?.uv_index === "number" && typeof data.current?.weather_code === "number") {
          setWeather({
            temperature: data.current.temperature_2m,
            uvIndex: data.current.uv_index,
            label: getWeatherLabel(data.current.weather_code),
          });
        }
      } catch {
        // Weather is supplementary; keep the landing page usable when unavailable.
      }
    };

    void loadWeather(-7.253861, 112.777322);

    return () => {
      cancelled = true;
    };
  }, []);

  const handleTypingComplete = useCallback(() => {
    setIsSubtitleVisible(true);
    onTypingComplete();
  }, [onTypingComplete]);

  return { isWelcomeVisible, isSubtitleVisible, greeting, weather, handleTypingComplete };
}
