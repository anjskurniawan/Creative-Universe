"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { MaterialIcon } from "./material-icon";
import { MessageBell } from "./message-bell";
import { NotificationBell } from "./notification-bell";

type NavbarVariant = "light" | "dark";

interface NavbarProps {
  variant?: NavbarVariant;
  sticky?: boolean;
}

export function Navbar({ variant = "light", sticky = true }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [appsOpen, setAppsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const appsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isDark = variant === "dark";
  const isRootUser = Boolean(user?.roles.includes("Root") || user?.roles.includes("root"));
  const primaryRole = user?.roles?.[0] ?? "User";
  const initials = getInitials(user?.name);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (appsRef.current && !appsRef.current.contains(event.target as Node)) setAppsOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setAppsOpen(false);
      setProfileOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const navClass = isDark ? "bg-black text-white" : "bg-white text-black";
  const actionClass = isDark
    ? "text-white hover:bg-white/10 focus-visible:ring-white/30"
    : "text-black hover:bg-black/5 focus-visible:ring-black/20";
  const panelClass = isDark
    ? "bg-black text-[#f9fafb]"
    : "border-[0.5px] border-[#f2f2f2] bg-white text-[#121212]";
  const popupLinkClass = isDark
    ? "group flex h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-sm font-medium leading-5 text-[#f9fafb] transition-colors hover:bg-[#0a0d12] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    : "group flex h-10 w-full items-center gap-2.5 rounded-xl px-2.5 text-sm font-medium leading-5 text-[#121212] transition-colors hover:bg-[#f2f2f2] focus:outline-none focus-visible:ring-2 focus-visible:ring-cu-focus/30";
  const popupIconClass = isDark
    ? "text-white/55 transition-colors group-hover:text-white"
    : "text-cu-muted transition-colors group-hover:text-cu-ink";
  const scrollbarClass = isDark ? "cu-popup-scrollbar-dark" : "cu-popup-scrollbar-light";

  return (
    <nav className={`${sticky ? "sticky top-0" : "relative"} isolate z-[100] h-[72px] ${navClass}`}>
      <div className="flex h-full w-full items-center justify-between px-6 md:px-16">
        <Link href="/" className="inline-flex size-9 shrink-0 items-center justify-center" aria-label="Creative Universe">
          <CreativeUniverseLogo className="size-9" />
        </Link>

        {isAuthenticated && user && (
          <div className="flex items-center justify-end gap-2">
            {isRootUser && (
              <ActionLink href="/maintenance" label="Developer Panel" icon="code" className={actionClass} />
            )}

            <NotificationBell userId={user.id} variant={variant} />
            <MessageBell userId={user.id} variant={variant} />

            <div className="relative" ref={appsRef}>
              <button
                type="button"
                className={actionButtonClass(actionClass)}
                onClick={() => {
                  setAppsOpen((open) => !open);
                  setProfileOpen(false);
                }}
                aria-expanded={appsOpen}
                aria-haspopup="menu"
              >
                <span className="sr-only">Buka menu aplikasi</span>
                <MaterialIcon name="apps" size="md" />
              </button>

              {appsOpen && (
                <div className={`fixed left-4 right-4 top-[4.75rem] z-[110] mt-2 max-h-[calc(100dvh-5.5rem)] overflow-hidden rounded-2xl p-1.5 sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:w-[280px] ${panelClass} ${scrollbarClass} animate-slide-up`}>
                  <ul role="menu" aria-label="Menu aplikasi" className="m-0 flex list-none flex-col gap-1 p-0">
                    <AppMenuItem href="/pricetag/search" icon="label" label="Pricetag Generator" className={popupLinkClass} iconClassName={popupIconClass} onClick={() => setAppsOpen(false)} />
                    <AppMenuItem href="/odds" icon="architecture" label="ODDS (One Dashboard Design System)" className={popupLinkClass} iconClassName={popupIconClass} onClick={() => setAppsOpen(false)} />
                    <AppMenuItem href="/ai-agent" icon="smart_toy" label="AI Agent" className={popupLinkClass} iconClassName={popupIconClass} onClick={() => setAppsOpen(false)} />
                    <AppMenuItem href="/assets-design" icon="brush" label="Assets Design" className={popupLinkClass} iconClassName={popupIconClass} onClick={() => setAppsOpen(false)} />
                  </ul>
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button
                type="button"
                className={`flex size-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border transition focus:outline-none focus-visible:ring-2 ${isDark ? "border-white/10 bg-white text-black focus-visible:ring-white/30" : "border-cu-line bg-black text-white focus-visible:ring-black/20"}`}
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setAppsOpen(false);
                }}
                aria-label="Buka menu akun"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="size-full object-cover" src={user.avatar_url} alt="Foto Profil" />
                ) : (
                  <span className="text-sm font-semibold">{initials}</span>
                )}
              </button>

              {profileOpen && (
                <ProfileDropdown
                  user={user}
                  initials={initials}
                  primaryRole={primaryRole}
                  isDark={isDark}
                  onClose={() => setProfileOpen(false)}
                  onLogout={() => {
                    setProfileOpen(false);
                    void logout();
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function actionButtonClass(className: string) {
  return `relative inline-flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-full p-1 transition-colors focus:outline-none focus-visible:ring-2 ${className}`;
}

function ActionLink({
  href,
  label,
  icon,
  className,
}: {
  href: string;
  label: string;
  icon: string;
  className: string;
}) {
  return (
    <Link href={href} aria-label={label} title={label} className={actionButtonClass(className)}>
      <MaterialIcon name={icon} size="md" />
    </Link>
  );
}

function AppMenuItem({
  href,
  icon,
  label,
  className,
  iconClassName,
  onClick,
}: {
  href: string;
  icon: string;
  label: string;
  className: string;
  iconClassName: string;
  onClick: () => void;
}) {
  return (
    <li>
      <Link href={href} onClick={onClick} className={className} role="menuitem">
        <MaterialIcon name={icon} size="sm" className={iconClassName} />
        <span className="min-w-0 truncate">{label}</span>
      </Link>
    </li>
  );
}

function ProfileDropdown({
  user,
  initials,
  primaryRole,
  isDark,
  onClose,
  onLogout,
}: {
  user: { name: string; avatar_url?: string | null };
  initials: string;
  primaryRole: string;
  isDark: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <div className={profileDropdownPanelClass(isDark)}>
      <div className={`flex h-16 w-full shrink-0 items-center justify-between rounded-xl border px-3 py-2.5 ${isDark ? "border-[#1f2937]" : "border-[#f2f2f2]"}`}>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className={`w-full truncate text-sm font-semibold leading-5 ${isDark ? "text-[#f9fafb]" : "text-[#121212]"}`}>
            {user.name}
          </p>
          <p className="w-full truncate text-xs leading-4 text-[#9ca3af]">
            {primaryRole.toUpperCase()}
          </p>
        </div>
        <div className={`flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full ${isDark ? "bg-white text-black" : "bg-[#121212] text-white"}`}>
          {user.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="size-full object-cover" src={user.avatar_url} alt="" />
          ) : (
            <span className="text-xs font-medium leading-4">{initials}</span>
          )}
        </div>
      </div>

      <ul role="menu" aria-label="Account navigation" className="m-0 flex w-full list-none flex-col gap-1 py-1">
        <ProfileMenuItem href="/profile" icon="person" label="Profile" isDark={isDark} highlighted onClick={onClose} />
        <ProfileMenuItem href="/dashboard" icon="dashboard" label="Dashboard" isDark={isDark} onClick={onClose} />
        <ProfileMenuItem href="/settings" icon="settings" label="Settings" isDark={isDark} onClick={onClose} />
        <ProfileMenuItem href="/docs" icon="help" label="Help Center" isDark={isDark} onClick={onClose} />
      </ul>

      <div role="menu" aria-label="Account session" className="w-full">
        <button
          type="button"
          onClick={onLogout}
          className={profileMenuButtonClass(isDark)}
          role="menuitem"
        >
          <MaterialIcon name="logout" size="sm" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

function ProfileMenuItem({
  href,
  icon,
  label,
  isDark,
  highlighted = false,
  onClick,
}: {
  href: string;
  icon: string;
  label: string;
  isDark: boolean;
  highlighted?: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className={profileMenuButtonClass(isDark, highlighted)}
        role="menuitem"
      >
        <MaterialIcon name={icon} size="sm" />
        {label}
      </Link>
    </li>
  );
}

function profileDropdownPanelClass(isDark: boolean) {
  return `absolute right-0 z-[110] mt-2 flex max-h-[calc(100dvh-5.5rem)] w-[min(280px,calc(100vw-2rem))] flex-col items-start overflow-hidden rounded-2xl p-1.5 ${
    isDark ? "bg-black text-[#f9fafb]" : "border-[0.5px] border-[#f2f2f2] bg-white text-[#121212]"
  }`;
}

function profileMenuButtonClass(isDark: boolean, highlighted = false) {
  return `flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-xl border-0 bg-transparent px-2.5 text-left text-sm font-medium leading-5 transition-colors focus:outline-none ${
    highlighted
      ? isDark
        ? "bg-[#0a0d12] text-[#f9fafb] hover:bg-[#111827]"
        : "bg-[#f2f2f2] text-[#121212] hover:bg-[#e5e7eb]"
      : isDark
        ? "text-[#f9fafb] hover:bg-[#0a0d12]"
        : "text-[#121212] hover:bg-[#f2f2f2]"
  }`;
}

function getInitials(name?: string | null) {
  if (!name) return "AK";
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function CreativeUniverseLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 39" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M25.0636 15.0286C24.7182 14.8964 24.5179 14.4539 24.5218 14.0913L24.5506 11.4107C24.5558 10.9248 25.0279 10.5268 25.491 10.5209L28.1479 10.4872C28.62 10.4813 29.072 10.3359 29.4723 10.1116C30.5792 9.49124 30.9307 8.22895 30.7007 7.01211C30.529 6.10409 29.9109 5.38499 29.0092 5.13612C28.7073 5.05259 28.4008 4.94965 28.0699 4.94891L23.7869 4.93786C23.675 4.93761 23.5921 5.11868 23.5918 5.2339L23.5567 18.2585C23.5537 19.393 22.589 20.1993 21.5407 20.2094L20.4876 20.1843C19.8487 20.1168 19.2745 19.75 18.974 19.1562C18.8267 18.8646 18.7027 18.4793 18.7027 18.1165L18.698 2.57739L18.7674 2.05828C18.9093 0.995234 19.8425 0.0756652 20.9782 0.0719801L27.8863 0.0506062C28.8163 0.0476581 29.6947 0.213981 30.571 0.48398C31.7709 0.853479 32.8299 1.48978 33.7363 2.35506C36.6065 5.09534 36.7664 9.61334 34.1055 12.5932C33.6295 13.1263 33.0941 13.5565 32.5137 13.965C32.4618 14.0016 32.4121 14.0441 32.3887 14.0793C32.3609 14.1213 32.3811 14.2579 32.4146 14.3068L35.4577 18.7368C35.7847 19.2127 35.6711 19.8003 35.1546 20.0669C34.8237 20.2379 34.4431 20.2349 34.065 20.234L32.9716 20.231L31.5232 20.1885C30.7935 20.1123 30.2448 19.7168 29.8512 19.123L27.8457 16.0975C27.6182 15.754 27.2784 15.5152 26.9207 15.3587C26.17 15.0305 25.6747 15.2615 25.0636 15.0281V15.0286Z" />
      <path d="M31.0191 35.7703C31.0186 35.4421 30.82 35.1701 30.4741 35.1699L23.9892 35.1679C23.7567 35.1679 23.5146 35.3394 23.5082 35.5492L23.4851 36.3079L23.4851 37.0193L23.4853 37.9342C23.4831 38.4698 23.0612 38.9798 22.4891 38.9803L19.9631 38.9818C19.5252 38.9821 19.1099 38.6998 18.9118 38.3295C18.8203 38.1583 18.728 37.9301 18.7285 37.7247L18.7472 29.338C18.7472 27.7711 19.2447 26.2771 19.9926 24.9264C21.3094 22.549 23.6743 20.944 26.3833 20.6543C28.0263 20.4786 29.6487 20.7658 31.1148 21.5073C33.0754 22.4991 34.5541 24.1798 35.2836 26.2476L35.5417 27.0871C35.7552 27.7816 35.8236 28.502 35.8268 29.2388L35.8357 31.3417V32.32L35.8389 32.9939L35.8398 35.4475L35.8443 36.8316C35.8455 37.2149 35.8418 37.566 35.7719 37.9475C35.6703 38.5022 35.2093 38.9784 34.6112 38.9796L32.0391 38.9848C31.4551 38.986 31.0235 38.4895 31.0225 37.9252L31.0188 35.7696L31.0191 35.7703ZM30.6791 30.8465C30.8503 30.8074 30.9337 30.7325 30.9327 30.5944L30.9202 29.0154C30.9172 28.6435 30.8095 28.2934 30.6906 27.9566C30.2638 26.7464 29.287 25.887 28.0251 25.6266C25.7673 25.1605 23.7806 26.9439 23.5867 29.165L23.5707 30.5986C23.5695 30.7175 23.6848 30.846 23.8347 30.846L30.6793 30.8465H30.6791Z" />
      <path d="M4.93361 33.0035C4.86103 33.4703 4.97716 33.9209 5.34227 34.2039C5.53467 34.353 5.79399 34.4471 6.0629 34.4474L17.0977 34.4596C17.6132 34.4601 18.0528 34.9036 18.055 35.4016L18.0668 38.0284C18.0676 38.1716 17.9704 38.3851 17.8914 38.5148C17.7231 38.7907 17.3976 38.9966 17.0362 38.9966L6.40169 39C5.70689 39 5.07041 38.9772 4.42285 38.8044C2.05798 38.1743 0.364046 36.1615 0.193299 33.7226L0.191331 33.0217C0.304752 31.8609 0.77246 30.7988 1.53762 29.9176C1.62521 29.8166 1.62103 29.7137 1.53492 29.6132C0.716119 28.6582 0.191577 27.4741 0.182474 26.1961C0.178783 25.6801 0.27695 25.1853 0.434411 24.7028C1.13733 22.5487 3.04457 21.0069 5.3098 20.7632C6.01173 20.6877 6.69102 20.7302 7.41707 20.7307L17.0916 20.7361C17.6697 20.7364 18.1835 21.141 18.1837 21.7311L18.1854 24.2341C18.1857 24.7989 17.7042 25.262 17.1218 25.2625L6.10276 25.2718C5.38877 25.2723 4.89572 25.7482 4.91664 26.4594C4.93509 27.0844 5.38656 27.5478 6.03633 27.5505L9.14545 27.5633L14.9594 27.5841C15.5083 27.5861 15.8744 28.0971 15.8747 28.5963L15.8759 30.9718C15.8762 31.5951 15.3885 32.0012 14.785 32.0014L6.06413 32.0046C5.46701 32.0046 5.02194 32.4333 4.93312 33.003L4.93361 33.0035Z" />
      <path d="M12.1897 14.7929C12.7625 14.5101 13.2223 14.1549 13.6902 13.7527C14.1631 13.3463 14.8471 13.3085 15.3032 13.7357L16.1572 14.5359L17.3556 15.7206C17.8787 16.2377 17.7547 17.0411 17.2454 17.5265C15.8113 18.8935 14.0022 19.7843 12.0416 20.1268C11.1325 20.2855 10.2389 20.3069 9.3175 20.2575C5.76086 20.0671 2.46746 17.7344 0.958543 14.5209C-0.127937 12.2071 -0.292533 9.5209 0.473613 7.08403C1.26067 4.58033 2.99151 2.51345 5.27691 1.24551C7.06778 0.251748 9.09214 -0.146494 11.1401 0.0475905C12.3572 0.162813 13.5001 0.499391 14.5767 1.08238C15.6297 1.6526 16.6099 2.34786 17.4083 3.22567C17.8064 3.66346 17.7798 4.35554 17.3603 4.74715L15.4595 6.52265C14.8294 7.1113 14.1171 7.0258 13.4814 6.44699C12.5829 5.62888 11.5042 5.09011 10.2699 5.0142C8.83061 4.92551 7.41149 5.43627 6.39833 6.46345C4.68594 8.19965 4.4468 10.9763 5.75372 13.025C7.12215 15.1702 9.89396 15.9259 12.1892 14.7926L12.1897 14.7929Z" />
    </svg>
  );
}
