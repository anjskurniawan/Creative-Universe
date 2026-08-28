import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/auth";
import { visibleSubApplications } from "@/core/applications";
import { DEFAULT_AUTH_PORTAL_CONFIG } from "./Auth.config";

export function useAuthLogic() {
  const { user } = useAuth();
  const [hasTypingCompleted, setHasTypingCompleted] = useState(false);
  const [showMediaAgent, setShowMediaAgent] = useState(true);

  const completeTyping = useCallback(() => setHasTypingCompleted(true), []);
  const creativeRole = user?.roles.find((role) =>
    DEFAULT_AUTH_PORTAL_CONFIG.creativeRoles.includes(role as any)
  );
  const accessibleApplications = visibleSubApplications(user?.applications ?? []);
  const firstName =
    user?.name?.trim().split(/\s+/)[0] ||
    DEFAULT_AUTH_PORTAL_CONFIG.defaultFirstName;
  const cardImage = user?.card_image_url ?? user?.avatar_url;

  useEffect(() => {
    if (!creativeRole) return;

    const interval = window.setInterval(() => {
      setShowMediaAgent((current) => !current);
    }, DEFAULT_AUTH_PORTAL_CONFIG.mediaAgentRotationIntervalMs);

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

// Backward-compatible alias
export const useAuthPortalLogic = useAuthLogic;
