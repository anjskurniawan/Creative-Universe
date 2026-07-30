"use client";
export default function ViewportDebug({ viewport }: { viewport?: string }) { return <span className="fixed bottom-2 right-2 z-[200] rounded bg-black/70 px-2 py-1 text-xs text-white">{viewport ?? "Desktop"}</span>; }
