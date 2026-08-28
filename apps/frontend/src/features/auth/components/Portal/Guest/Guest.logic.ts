import { useCallback, useEffect, useState } from "react";
import { DEFAULT_GUEST_PORTAL_CONFIG } from "./Guest.config";

export function useGuestLogic() {
  const [hasTypingCompleted, setHasTypingCompleted] = useState(false);
  const [isPrimaryActionVisible, setIsPrimaryActionVisible] = useState(false);

  // Selesainya animasi typing judul
  const completeTyping = useCallback(() => setHasTypingCompleted(true), []);

  // Jeda pemunculan tombol aksi utama setelah typing selesai
  useEffect(() => {
    if (!hasTypingCompleted) return;
    const delay = window.setTimeout(
      () => setIsPrimaryActionVisible(true),
      DEFAULT_GUEST_PORTAL_CONFIG.actionEnterDelayMs
    );
    return () => window.clearTimeout(delay);
  }, [hasTypingCompleted]);

  return {
    hasTypingCompleted,
    isPrimaryActionVisible,
    completeTyping,
  };
}

// Backward-compatible alias
export const useGuestPortalLogic = useGuestLogic;
