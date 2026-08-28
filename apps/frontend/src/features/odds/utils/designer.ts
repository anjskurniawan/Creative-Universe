import { OddsCategory, OddsDesignerProfile } from "@/features/odds/api";

export function capacityLabel(profile: OddsDesignerProfile, todayCapacity: number): string {
  const todayStr = new Date().toLocaleDateString("en-CA");
  if (profile.leave_dates?.includes(todayStr)) return "Sedang Cuti";
  if (profile.current_load_minutes >= todayCapacity) return "Full Load Today";
  return "Available";
}

export function matchesSpecialization(profile: OddsDesignerProfile, categoryId: string, categoryName?: string): boolean {
  if (!categoryId && !categoryName) return true;

  const specializations = profile.specializations ?? [];
  return specializations.length === 0
    || specializations.some((specialization) =>
      String(specialization) === categoryId
      || (categoryName ? String(specialization).toLowerCase() === categoryName.toLowerCase() : false),
    );
}

export function designerSort(left: OddsDesignerProfile, right: OddsDesignerProfile, todayCapacity: number): number {
  const leftOff = left.status === "off" ? 1 : 0;
  const rightOff = right.status === "off" ? 1 : 0;
  const leftLeave = capacityLabel(left, todayCapacity) === "Sedang Cuti" ? 1 : 0;
  const rightLeave = capacityLabel(right, todayCapacity) === "Sedang Cuti" ? 1 : 0;
  const leftFull = capacityLabel(left, todayCapacity) === "Full Load Today" ? 1 : 0;
  const rightFull = capacityLabel(right, todayCapacity) === "Full Load Today" ? 1 : 0;

  return leftOff - rightOff
    || leftLeave - rightLeave
    || leftFull - rightFull
    || left.current_load_minutes - right.current_load_minutes;
}

export function recommendDesigner(profiles: OddsDesignerProfile[], category: OddsCategory | null | undefined): OddsDesignerProfile | null {
  const todayStr = new Date().toLocaleDateString("en-CA");
  const matching = profiles
    .filter((profile) => profile.is_active && String(profile.status).toLowerCase() === "available" && !profile.leave_dates?.includes(todayStr))
    .filter((profile) => matchesSpecialization(profile, category ? String(category.id) : "", category?.name))
    .sort((left, right) => designerSort(left, right, 420));

  return matching[0] ?? null;
}

export function selectedDesignerName(userId: string, profiles: OddsDesignerProfile[]): string | null {
  const profile = profiles.find((item) => String(item.user_id) === userId);
  return profile?.user?.name ?? (profile ? `User #${profile.user_id}` : null);
}
