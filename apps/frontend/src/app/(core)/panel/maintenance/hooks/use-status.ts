import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/core/api/client";
import { useAuth } from "@/providers/auth-provider";
import type { SystemStatus } from "@/components/panel/maintenance/system-status-grid";

export function useStatus() {
  const { hasPermission } = useAuth();
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (silent = false) => {
    if (!hasPermission("run-artisan")) return;
    if (!silent) setLoading(true);

    try {
      const res = await apiFetch<SystemStatus>("/maintenance/status");
      setStatus(res);
    } catch (err) {
      if (!silent) {
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: {
              status: "error",
              message: err instanceof Error ? err.message : "Gagal mengambil status sistem.",
            },
          })
        );
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [hasPermission]);

  useEffect(() => {
    queueMicrotask(() => void load());
  }, [load]);

  return { status, loading, load };
}
