export const DEFAULT_TYPING_TEXT_CONFIG = {
  defaultAlign: "center" as const,
  defaultTypingSpeed: 110,
  defaultTypingDelay: 0,
} as const;

// Backward-compatible alias
export const DEFAULT_HERO_HEADING_CONFIG = DEFAULT_TYPING_TEXT_CONFIG;
