import { useCallback, useEffect, useMemo, useState } from "react";
import type { LandingTextProps } from "./LandingText.types";

export function useLandingTextLogic({ creativeRole, onTypingComplete }: Pick<LandingTextProps, "creativeRole" | "onTypingComplete">) {
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
  const [isSubtitleVisible, setIsSubtitleVisible] = useState(Boolean(creativeRole));
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsWelcomeVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleTypingComplete = useCallback(() => {
    setIsSubtitleVisible(true);
    onTypingComplete();
  }, [onTypingComplete]);

  return { isWelcomeVisible, isSubtitleVisible, greeting, handleTypingComplete };
}
