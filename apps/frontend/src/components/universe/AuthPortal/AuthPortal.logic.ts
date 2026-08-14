import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { visibleSubApplications } from "@/core/applications";

export function useAuthPortalLogic() {
  const { user } = useAuth();
  const [hasTypingCompleted, setHasTypingCompleted] = useState(false);
  const [showMediaAgent, setShowMediaAgent] = useState(true);

  const completeTyping = useCallback(() => setHasTypingCompleted(true), []);
  const creativeRole = user?.roles.find((role) => ["Designer", "Videographer", "Content Creator", "SPV"].includes(role));
  const accessibleApplications = visibleSubApplications(user?.applications ?? []);
  const firstName = user?.name?.trim().split(/\s+/).slice(0, 2).join(" ") || "Creative";
  const cardImage = user?.card_image_url ?? user?.avatar_url;

  useEffect(() => {
    if (!creativeRole) return;

    const interval = window.setInterval(() => {
      setShowMediaAgent((current) => !current);
    }, 10000);

    return () => window.clearInterval(interval);
  }, [creativeRole]);

  return {
    user,
    hasTypingCompleted,
    showMediaAgent,
    completeTyping,
    creativeRole,
    accessibleApplications,
    firstName,
    cardImage,
  };
}
