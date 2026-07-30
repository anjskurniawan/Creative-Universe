import ProfileCard from "@/components/global-layout/profile/card";
import { resolveStorageUrl } from "@/core/api/client";
import type { OddsCategory, OddsDesignerProfile } from "@/features/odds/api";
import type { RequestBuilderTheme } from "../types";

export function DesignerSelectionStep({
  categories,
  designers,
  selectedDesignerId,
  todayCapacity,
  onSelect,
  theme,
}: {
  categories: OddsCategory[];
  designers: OddsDesignerProfile[];
  selectedDesignerId: string;
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
        <div className="grid min-h-0 flex-1 content-start grid-cols-1 gap-4 overflow-y-auto p-2 [scrollbar-width:none] sm:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] [&::-webkit-scrollbar]:hidden">
          {designers.map((profile) => {
            const capacityMinutes = todayCapacity || 420;
            const percentage = Math.min(profile.current_load_minutes || 0, capacityMinutes) / capacityMinutes * 100;
            const isOff = profile.status === "off";

            return (
              <div key={profile.user_id} className="min-w-0">
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
                  profileImage={resolveStorageUrl(profile.user?.avatar_path ?? profile.user?.avatar) ?? undefined}
                  active={selectedDesignerId === String(profile.user_id)}
                  onClick={() => onSelect(String(profile.user_id))}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
