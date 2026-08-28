"use client";

import { useEffect, useState } from "react";

export default function TypingHeading({ text, typingDelay = 55, onComplete }: { text: string; typingDelay?: number; onComplete?: () => void }) {
  const [visible, setVisible] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setVisible((value) => value < text.length ? value + 1 : value), typingDelay); return () => window.clearInterval(timer); }, [text, typingDelay]);
  useEffect(() => { if (visible >= text.length) onComplete?.(); }, [visible, text.length, onComplete]);
  return <>{text.slice(0, visible)}<span aria-hidden="true" className="hero-heading-cursor-anchor" /></>;
}
