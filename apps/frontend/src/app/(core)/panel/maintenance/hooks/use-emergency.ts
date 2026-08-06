import { useState, useEffect } from "react";
import { apiFetch } from "@/core/api/client";
import { useAuth } from "@/providers/auth-provider";

export function useEmergency() {
  const { hasRole } = useAuth();
  const isRoot = hasRole("Root");
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isRoot) return;
    apiFetch<{ active: boolean }>("/maintenance/emergency")
      .then((res) => setActive(res.active))
      .catch((err: unknown) => {
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: {
              status: "error",
              message: err instanceof Error ? err.message : "Gagal mengambil status maintenance.",
            },
          })
        );
      })
      .finally(() => setLoading(false));
  }, [isRoot]);

  const toggle = async (nextState: boolean) => {
    if (saving) return;
    const confirmation = nextState
      ? "Aktifkan maintenance darurat? Semua pengguna selain Root akan langsung kehilangan akses aplikasi."
      : "Nonaktifkan maintenance darurat dan pulihkan akses seluruh pengguna?";
    if (!window.confirm(confirmation)) return;

    setSaving(true);
    try {
      const response = await apiFetch<{ active: boolean }>("/maintenance/emergency", {
        method: "PUT",
        body: JSON.stringify({ active: nextState }),
      });
      setActive(response.active);
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "success",
            message: response.active
              ? "Maintenance darurat aktif. Hanya Root yang dapat mengakses aplikasi."
              : "Maintenance darurat dinonaktifkan. Akses pengguna telah pulihkan.",
          },
        })
      );
    } catch (err) {
      window.dispatchEvent(
        new CustomEvent("show-toast", {
          detail: {
            status: "error",
            message: err instanceof Error ? err.message : "Gagal mengubah maintenance darurat.",
          },
        })
      );
    } finally {
      setSaving(false);
    }
  };

  return { active, loading, saving, toggle };
}
