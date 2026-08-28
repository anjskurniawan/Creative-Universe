import type { User } from "@/hooks/auth";

export default function SettingsProfileHeader({
  user,
  isMobileDetail,
}: {
  user: User;
  isMobileDetail: boolean;
}) {
  const division =
    typeof user.settings?.division === "string" ? user.settings.division : "Belum ditentukan";
  const position =
    typeof user.settings?.position === "string"
      ? user.settings.position
      : user.roles[0] || "Belum ditentukan";

  return (
    <div className={`${isMobileDetail ? "hidden lg:flex" : "flex"} items-center`}>
      <div className="flex min-w-0 items-center gap-4">
        {/* <Avatar src={user.avatar_url ?? undefined} alt={`Avatar ${user.name}`} size={64} /> */}
        <div className="min-w-0 space-y-0.5">
          <p className="truncate text-sm font-semibold text-cu-ink">{user.name}</p>
          <p className="truncate text-xs text-cu-muted">{division}</p>
          <p className="truncate text-xs text-cu-muted">{position}</p>
        </div>
      </div>
    </div>
  );
}
