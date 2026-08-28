import ProfileCard from "@/components/layout/profile/Card/Card";
import { resolveStorageUrl } from "@/core/api/client";
import type { OddsCategory, OddsDesignerProfile } from "@/features/odds/api";
import type { RequestBuilderTheme } from "../OddsRequestBuilder.types";

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
        <h2 className={`text-2xl font-bold tracking-tight sm:text-4xl ${theme.textTitle}`}>Pilih Desainer</h2>
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

            const activeTask = profile.tasks?.find((t) => t.status === "in_progress");
            const runningText = activeTask
              ? `Sedang Mengerjakan: ${activeTask.design_purpose}`
              : "Tidak ada task aktif";

            return (
              <div
                key={profile.user_id}
                className={`w-full min-w-0 max-w-full ${designers.length <= 2 ? "sm:max-w-sm" : "sm:w-[32rem] sm:max-w-full"} ${designers.length === 1 ? "flex justify-start" : ""}`}
              >
                <ProfileCard
                  name={profile.user?.name ?? "Designer"}
                  role="Designer"
                  departments={[runningText]}
                  capacity={Math.round(percentage)}
                  status={isOff || percentage >= 100 ? "FullBook" : percentage >= 70 ? "Busy" : "Available"}
                  responseTime="—"
                  rating="—"
                  score="—"
                  cardImage={resolveStorageUrl(profile.user?.card_image_path) ?? undefined}
                  active={isActive}
                  isRecommended={isRecommended}
                  autoPlayMedia={isRecommended}
                  disableMarquee={true}
                  onClick={() => onSelect(String(profile.user_id))}
                  className={designers.length <= 2 ? "w-full max-w-sm" : "w-full"}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
