import ProfileCard from "@/components/layout/profile/card";
import { resolveStorageUrl } from "@/core/api/client";
import type { OddsCategory, OddsDesignerProfile } from "@/features/odds/api";
import type { RequestBuilderTheme } from "../types";

export function DesignerSelectionStep({
  categories,
  designers,
  selectedDesignerId,
  recommendedDesignerId,
  todayCapacity,
  onSelect,
  theme,
}: {
  categories: OddsCategory[];
  designers: OddsDesignerProfile[];
  selectedDesignerId: string;
  recommendedDesignerId?: string | null;
  todayCapacity: number;
  onSelect: (designerId: string) => void;
  theme: RequestBuilderTheme;
}) {
  return (
    <section className="flex min-h-0 flex-1 flex-col space-y-5">
      <header>
        <h2 className={`text-xl font-bold tracking-tight ${theme.textTitle}`}>Pilih Talent Desainer</h2>
        <p className={`mt-0.5 text-xs ${theme.textMuted}`}>Pilih desainer profesional untuk mengerjakan tugas ini</p>
      </header>

      {designers.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
          Tidak ada desainer tersedia untuk kategori ini.
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-wrap content-start items-start gap-4 overflow-y-auto p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {designers.map((profile) => {
            const capacityMinutes = todayCapacity || 420;
            const percentage = Math.min(profile.current_load_minutes || 0, capacityMinutes) / capacityMinutes * 100;
            const isOff = profile.status === "off";
            const isRecommended = recommendedDesignerId === String(profile.user_id);
            const isActive = selectedDesignerId === String(profile.user_id) || (!selectedDesignerId && isRecommended);

            return (
              <div
                key={profile.user_id}
                className={`w-full min-w-0 max-w-full ${designers.length < 2 ? "sm:max-w-md" : "sm:w-[32rem] sm:max-w-full"} ${designers.length === 1 ? "flex justify-start" : ""}`}
              >
                <ProfileCard
                  name={profile.user?.name ?? "Designer"}
                  role="Designer"
                  departments={(profile.specializations ?? []).map(
                    (specialization) =>
                      categories.find((category) => String(category.id) === String(specialization))?.name
                      ?? String(specialization),
                  )}
                  capacity={Math.round(percentage)}
                  status={isOff || percentage >= 100 ? "FullBook" : percentage >= 70 ? "Busy" : "Available"}
                  responseTime="—"
                  rating="—"
                  score="—"
                  cardImage={resolveStorageUrl(profile.user?.card_image_path) ?? undefined}
                  active={isActive}
                  isRecommended={isRecommended}
                  autoPlayMedia={isRecommended}
                  onClick={() => onSelect(String(profile.user_id))}
                  className={designers.length < 2 ? "w-full max-w-md" : "w-full"}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
