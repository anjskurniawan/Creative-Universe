import type { User } from "@/providers/auth-provider";

export default function SettingsProfileHeader({ user, isMobileDetail }: { user: User; isMobileDetail: boolean }) {
  const userInitials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`${isMobileDetail ? "hidden lg:flex" : "flex"} flex-col items-start justify-between gap-4 border-b border-cu-line/60 pb-5 pt-1 sm:flex-row sm:items-center lg:pt-4`}>
      <div className="flex items-center gap-4">
        <div className={`relative flex size-16 items-center justify-center overflow-hidden rounded-full border border-cu-line sm:size-14 ${user.avatar_url ? "bg-white" : "bg-cu-panel-soft"}`}>
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} className="size-full object-cover" alt="Avatar" />
          ) : (
            <span className="text-xl font-bold uppercase text-cu-muted">{userInitials}</span>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-cu-ink flex flex-col sm:flex-row sm:items-baseline gap-1">
            <span>{user.name}</span>
            <span className="text-sm font-normal text-cu-muted">({user.username})</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
