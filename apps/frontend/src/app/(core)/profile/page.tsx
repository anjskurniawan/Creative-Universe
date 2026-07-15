"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { apiFetch, ApiError, ValidationError } from "@/core/api/client";
import { User, useAuth } from "@/providers/auth-provider";
import { MaterialIcon } from "@/components/material-icon";
import { SettingsLayout } from "@/components/settings-layout";

interface UserSession {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  last_activity: string;
  is_current: boolean;
}

interface ActivityItem {
  id: number;
  log_name: string | null;
  description: string;
  event: string;
  created_at: string | null;
  properties?: {
    ip?: string;
  };
}

function validationMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return Object.values(error.errors).flat()[0] || "Data yang diberikan tidak valid.";
  }
  return error instanceof ApiError ? error.message : "Terjadi kesalahan. Silakan coba lagi.";
}

function settingValue(user: User, key: string, fallback: string): string {
  const value = user.settings?.[key];
  return value !== undefined && value !== null ? String(value) : fallback;
}

export default function ProfilePage() {
  const { user, refreshUser, hasPermission } = useAuth();
  
  // Tab from URL search params (driven by SettingsLayout sidebar)
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const mobileRouteTab: Record<string, string> = {
    "/settings/profile": "profile",
    "/settings/security": "security",
    "/settings/role-settings": "role_settings",
    "/settings/activity-log": "activity_log",
  };
  // Normalisasi: strip trailing slash agar /settings/security/ == /settings/security
  const normalizedPathname = (pathname ?? "").replace(/\/$/, "") || "/";
  const activeTab = (mobileRouteTab[normalizedPathname] || searchParams.get("tab") || "profile") as
    "profile" | "security" | "role_settings" | "activity_log" |
    "billing_overview" | "billing_usage" | "billing_ai" | "billing_budgets";


  // Profile forms state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [theme, setTheme] = useState("system");
  
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Avatar upload state
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarStatus, setAvatarStatus] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState("avatar.jpg");
  const [cropFileType, setCropFileType] = useState("image/jpeg");
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffsetX, setCropOffsetX] = useState(0);
  const [cropOffsetY, setCropOffsetY] = useState(0);
  const cropImageRef = useRef<HTMLImageElement | null>(null);
  const cropDragRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Session list state
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionStatus, setSessionStatus] = useState<string | null>(null);

  // Role Settings form state
  const [maintenanceMode, setMaintenanceMode] = useState("0");
  const [globalDebugMode, setGlobalDebugMode] = useState("0");
  const [googleScriptUrl, setGoogleScriptUrl] = useState("");
  const [fonnteToken, setFonnteToken] = useState("");
  const [fonnteSender, setFonnteSender] = useState("");
  const [pusherAppId, setPusherAppId] = useState("");
  const [pusherAppKey, setPusherAppKey] = useState("");
  const [pusherAppSecret, setPusherAppSecret] = useState("");
  const [pusherAppCluster, setPusherAppCluster] = useState("");

  const [notifyNewRegistration, setNotifyNewRegistration] = useState("1");
  const [defaultExpiryDays, setDefaultExpiryDays] = useState("30");
  const [maxPrintsPerBatch, setMaxPrintsPerBatch] = useState("100");

  const [defaultLayout, setDefaultLayout] = useState("classic");
  const [defaultPaperSize, setDefaultPaperSize] = useState("A4");
  const [autoSaveChecklist, setAutoSaveChecklist] = useState(false);

  const [roleSettingsStatus, setRoleSettingsStatus] = useState<string | null>(null);
  const [roleSettingsError, setRoleSettingsError] = useState<string | null>(null);
  const [isSavingRoleSettings, setIsSavingRoleSettings] = useState(false);

  // User activities state
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  // Load user data into state
  useEffect(() => {
    let active = true;
    if (user) queueMicrotask(() => {
      if (!active) return;
      setName(user.name);
      setUsername(user.username);
      setEmail(user.email);
      setWhatsappNumber(user.whatsapp_number || "");
      setTheme(settingValue(user, "theme", "system"));
      setAvatarPreview(user.avatar_url);

      // Root settings
      setMaintenanceMode(settingValue(user, "maintenance_mode", "0"));
      setGlobalDebugMode(settingValue(user, "global_debug_mode", "0"));
      setGoogleScriptUrl(settingValue(user, "google_apps_script_url", ""));
      setFonnteToken(settingValue(user, "fonnte_token", ""));
      setFonnteSender(settingValue(user, "fonnte_sender", ""));
      setPusherAppId(settingValue(user, "pusher_app_id", ""));
      setPusherAppKey(settingValue(user, "pusher_app_key", ""));
      setPusherAppSecret(settingValue(user, "pusher_app_secret", ""));
      setPusherAppCluster(settingValue(user, "pusher_app_cluster", ""));

      // Manager settings
      setNotifyNewRegistration(settingValue(user, "notify_new_registration", "1"));
      setDefaultExpiryDays(settingValue(user, "default_pricetag_expiry_days", "30"));
      setMaxPrintsPerBatch(settingValue(user, "max_prints_per_batch", "100"));

      // Designer settings
      setDefaultLayout(settingValue(user, "default_pricetag_layout", "classic"));
      setDefaultPaperSize(settingValue(user, "default_pricetag_paper_size", "A4"));
      setAutoSaveChecklist(settingValue(user, "auto_save_checklist", "0") === "1");
    });
    return () => {
      active = false;
    };
  }, [user]);

  // Load Sessions
  useEffect(() => {
    let active = true;
    const loadSessions = async () => {
      try {
        const data = await apiFetch<UserSession[]>("/profile/sessions");
        if (active) setSessions(data);
      } catch {
        if (active) setSessionError("Gagal memuat sesi perangkat.");
      } finally {
        if (active) setIsLoadingSessions(false);
      }
    };
    if (user) {
      void loadSessions();
    }
    return () => {
      active = false;
    };
  }, [user]);

  // Load Activities
  useEffect(() => {
    if (activeTab !== "activity_log") return;
    let active = true;
    const loadActivities = async () => {
      setIsLoadingActivities(true);
      setActivitiesError(null);
      try {
        const data = await apiFetch<ActivityItem[]>("/profile/activities");
        if (active) setActivities(data);
      } catch {
        if (active) setActivitiesError("Gagal memuat jejak aktivitas.");
      } finally {
        if (active) setIsLoadingActivities(false);
      }
    };
    if (user) {
      void loadActivities();
    }
    return () => {
      active = false;
    };
  }, [activeTab, user]);

  const getActionName = (item: ActivityItem) => {
    switch (item.event) {
      case "created": return "Membuat data";
      case "updated": return "Memperbarui data";
      case "deleted": return "Menghapus data";
      case "login": return "Melakukan login";
      default: return item.description.charAt(0).toUpperCase() + item.description.slice(1);
    }
  };

  const getLogLabel = (logName: string | null) => {
    if (!logName) return "Sistem";
    switch (logName) {
      case "core-user": return "Profil Pengguna";
      case "auth": return "Otorisasi";
      case "pricetag": return "Pricetag Generator";
      default: return logName.charAt(0).toUpperCase() + logName.slice(1);
    }
  };

  const getNodeColorClass = (event: string) => {
    switch (event) {
      case "created": return "bg-cu-success text-white border-cu-success";
      case "deleted": return "bg-cu-danger text-white border-cu-danger";
      case "login": return "bg-cu-info text-white border-cu-info";
      default: return "bg-cu-ink text-cu-surface border-cu-line";
    }
  };

  const getIconName = (event: string) => {
    switch (event) {
      case "login": return "login";
      case "created": return "add";
      case "deleted": return "delete";
      default: return "edit";
    }
  };

  if (!user) return null;
  const hasRoleSettings =
    hasPermission("run-artisan") ||
    hasPermission("approve-users") ||
    hasPermission("access-pricetag");

  const initials = user.name
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCropSource(URL.createObjectURL(file));
      setCropFileName(file.name);
      setCropFileType(file.type || "image/jpeg");
      setCropZoom(1);
      setCropOffsetX(0);
      setCropOffsetY(0);
      setAvatarStatus(null);
      setAvatarError(null);
    }
    e.target.value = "";
  };

  const updateCropZoom = (nextZoom: number) => {
    setCropZoom(Math.min(3, Math.max(1, nextZoom)));
  };

  const nudgeCropZoom = (delta: number) => {
    setCropZoom((currentZoom) => Math.min(3, Math.max(1, currentZoom + delta)));
  };

  const updateCropOffset = (nextX: number, nextY: number) => {
    setCropOffsetX(Math.min(100, Math.max(-100, nextX)));
    setCropOffsetY(Math.min(100, Math.max(-100, nextY)));
  };

  const handleCropPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    cropDragRef.current = {
      x: event.clientX,
      y: event.clientY,
      offsetX: cropOffsetX,
      offsetY: cropOffsetY,
    };
  };

  const handleCropPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = cropDragRef.current;
    if (!drag) return;

    updateCropOffset(
      drag.offsetX + (event.clientX - drag.x) / 1.6,
      drag.offsetY + (event.clientY - drag.y) / 1.6
    );
  };

  const handleCropPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (cropDragRef.current) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    cropDragRef.current = null;
  };

  const handleCropWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    nudgeCropZoom(event.deltaY > 0 ? -0.08 : 0.08);
  };

  const closeAvatarCrop = () => {
    setCropSource(null);
    setCropZoom(1);
    setCropOffsetX(0);
    setCropOffsetY(0);
  };

  const applyAvatarCrop = async () => {
    const image = cropImageRef.current;
    if (!image || !cropSource) return;

    const outputSize = 512;
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;

    const context = canvas.getContext("2d");
    if (!context) return;

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;
    const baseScale = Math.max(outputSize / naturalWidth, outputSize / naturalHeight);
    const finalScale = baseScale * cropZoom;
    const drawWidth = naturalWidth * finalScale;
    const drawHeight = naturalHeight * finalScale;
    const maxOffsetX = Math.max(0, (drawWidth - outputSize) / 2);
    const maxOffsetY = Math.max(0, (drawHeight - outputSize) / 2);
    const drawX = (outputSize - drawWidth) / 2 + (cropOffsetX / 100) * maxOffsetX;
    const drawY = (outputSize - drawHeight) / 2 + (cropOffsetY / 100) * maxOffsetY;

    context.drawImage(image, drawX, drawY, drawWidth, drawHeight);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, cropFileType === "image/png" ? "image/png" : "image/jpeg", 0.92);
    });

    if (!blob) {
      setAvatarError("Crop avatar gagal diproses.");
      return;
    }

    const extension = cropFileType === "image/png" ? "png" : "jpg";
    const croppedFile = new File([blob], cropFileName.replace(/\.[^.]+$/, `.${extension}`), {
      type: blob.type,
    });

    setAvatar(croppedFile);
    setAvatarPreview(URL.createObjectURL(blob));
    closeAvatarCrop();
  };

  // Submit Profile & Display Preferences
  const submitProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingProfile(true);
    setProfileStatus(null);
    setProfileError(null);

    try {
      await apiFetch<User>("/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name,
          username,
          email,
          whatsapp_number: whatsappNumber || null,
          settings: {
            theme,
          },
        }),
      });

      // Submit avatar if selected
      if (avatar) {
        setIsSavingAvatar(true);
        setAvatarStatus(null);
        setAvatarError(null);
        const formData = new FormData();
        formData.append("avatar", avatar);
        await apiFetch<User>("/profile/avatar", {
          method: "POST",
          body: formData,
        });
        setAvatar(null);
        setAvatarStatus("Avatar berhasil diperbarui.");
        setIsSavingAvatar(false);
      }

      await refreshUser();
      setProfileStatus("Profil berhasil diperbarui.");
    } catch (error) {
      setProfileError(validationMessage(error));
      setIsSavingAvatar(false);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Submit Password Change
  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingPassword(true);
    setPasswordStatus(null);
    setPasswordError(null);

    try {
      await apiFetch("/profile/password", {
        method: "PUT",
        body: JSON.stringify({
          current_password: currentPassword,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
      setPasswordStatus("Password berhasil diperbarui.");
    } catch (error) {
      setPasswordError(validationMessage(error));
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Submit Role Settings
  const submitRoleSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingRoleSettings(true);
    setRoleSettingsStatus(null);
    setRoleSettingsError(null);

    const payloadSettings: Record<string, unknown> = {};

    if (hasPermission("run-artisan")) {
      payloadSettings.maintenance_mode = maintenanceMode;
      payloadSettings.global_debug_mode = globalDebugMode;
      payloadSettings.google_apps_script_url = googleScriptUrl;
      payloadSettings.fonnte_token = fonnteToken;
      payloadSettings.fonnte_sender = fonnteSender;
      payloadSettings.pusher_app_id = pusherAppId;
      payloadSettings.pusher_app_key = pusherAppKey;
      payloadSettings.pusher_app_secret = pusherAppSecret;
      payloadSettings.pusher_app_cluster = pusherAppCluster;
    }

    if (hasPermission("approve-users")) {
      payloadSettings.notify_new_registration = notifyNewRegistration;
      payloadSettings.default_pricetag_expiry_days = defaultExpiryDays;
      payloadSettings.max_prints_per_batch = maxPrintsPerBatch;
    }

    if (hasPermission("access-pricetag")) {
      payloadSettings.default_pricetag_layout = defaultLayout;
      payloadSettings.default_pricetag_paper_size = defaultPaperSize;
      payloadSettings.auto_save_checklist = autoSaveChecklist ? "1" : "0";
    }

    try {
      await apiFetch<User>("/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name,
          username,
          email,
          whatsapp_number: whatsappNumber || null,
          settings: payloadSettings,
        }),
      });
      await refreshUser();
      setRoleSettingsStatus("Pengaturan peran berhasil disimpan.");
    } catch (error) {
      setRoleSettingsError(validationMessage(error));
    } finally {
      setIsSavingRoleSettings(false);
    }
  };

  // Revoke Session Action
  const revokeSession = async (sessionId: string) => {
    if (!window.confirm("Cabut akses perangkat ini?")) return;
    setSessionError(null);
    setSessionStatus(null);
    try {
      await apiFetch(`/profile/sessions/${sessionId}`, { method: "DELETE" });
      setSessions((items) => items.filter((session) => session.id !== sessionId));
      setSessionStatus("Sesi perangkat berhasil dicabut.");
    } catch (error) {
      setSessionError(validationMessage(error));
    }
  };

  const getRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      if (seconds < 60) return "Baru saja";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes} menit yang lalu`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours} jam yang lalu`;
      return date.toLocaleDateString("id-ID");
    } catch {
      return "";
    }
  };

  return (
    <SettingsLayout>
      <div className="animate-fade-in">
        {/* TAB 1: Profile & Displays */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-cu-line bg-cu-surface shadow-sm">
              <div className="relative h-32 overflow-hidden bg-gradient-to-r from-[#7c3aed] via-[#a855f7] to-[#ec4899] sm:h-40">
                <span className="absolute -right-10 -top-16 size-52 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
                <span className="absolute bottom-[-70px] left-[20%] size-44 rounded-full border-[18px] border-white/15" aria-hidden="true" />
              </div>
              <div className="relative px-5 pb-5 pt-0 sm:px-7">
                <div className="-mt-12 flex flex-col gap-3 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex items-end gap-4">
                    <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-cu-surface bg-cu-ink text-2xl font-semibold text-white shadow-sm sm:size-28">
                      {avatarPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarPreview} alt={`Foto profil ${user.name}`} className="size-full object-cover" />
                      ) : initials}
                    </div>
                    <div className="pb-1">
                      <h1 className="text-xl font-semibold text-cu-ink sm:text-2xl">{user.name}</h1>
                      <p className="mt-1 text-sm text-cu-muted">{user.roles[0] || "Creative Universe Member"}</p>
                    </div>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#eeebff] px-3 py-1.5 text-xs font-semibold text-[#6d46eb]">
                    <MaterialIcon name="verified" size="xs" /> Profil aktif
                  </span>
                </div>
              </div>
            </section>

            <div className="border-b border-cu-line pb-3 mb-6">
              <h2 className="text-2xl font-semibold text-cu-ink">Profil Publik</h2>
            </div>

            {profileStatus && (
              <div className="rounded-lg border border-cu-success/20 bg-cu-success-soft p-4 text-sm text-cu-success">
                {profileStatus}
              </div>
            )}

            {profileError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-cu-danger">
                {profileError}
              </div>
            )}

            <form onSubmit={submitProfile} className="flex flex-col-reverse lg:flex-row gap-8 items-start">
              {/* Kolom Kiri: Form Data stacked vertically */}
              <div className="flex-1 w-full space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-semibold text-cu-ink" htmlFor="profile-name">
                    Nama Lengkap
                  </label>
                  <input
                    id="profile-name"
                    className="block w-full mt-1.5 rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:border-cu-focus focus:ring-cu-focus"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cu-ink" htmlFor="profile-username">
                    Username
                  </label>
                  <input
                    id="profile-username"
                    className="block w-full mt-1.5 rounded-lg border border-cu-line bg-cu-panel-soft px-3 py-2 text-sm text-cu-muted cursor-not-allowed"
                    type="text"
                    value={username}
                    readOnly
                  />
                  <p className="mt-1.5 text-[10px] text-cu-muted">
                    Username tidak dapat diubah demi keamanan akun.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-cu-ink" htmlFor="profile-email">
                    Alamat Email
                  </label>
                  <input
                    id="profile-email"
                    className="block w-full mt-1.5 rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:border-cu-focus focus:ring-cu-focus"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-cu-ink" htmlFor="profile-whatsapp">
                    Nomor WhatsApp
                  </label>
                  <div className="mt-1.5 flex h-10 w-full overflow-hidden rounded-lg border border-cu-line bg-cu-surface transition focus-within:border-cu-focus focus-within:ring-1 focus-within:ring-cu-focus">
                    <span className="flex shrink-0 items-center border-r border-cu-line bg-cu-panel-soft px-3 text-sm font-semibold text-cu-muted">
                      +62
                    </span>
                    <input
                      id="profile-whatsapp"
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-cu-ink outline-none"
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="8123456789"
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-cu-muted">
                    Masukkan nomor tanpa angka 0 di depan. Digunakan untuk notifikasi/OTP WhatsApp.
                  </p>
                </div>

                {/* Preferensi Tampilan */}
                <div className="pt-4 border-t border-cu-line/60 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-cu-ink" htmlFor="theme-select">
                      Tema Tampilan
                    </label>
                    <select
                      id="theme-select"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:border-cu-focus focus:ring-1 focus:ring-cu-focus focus:outline-none"
                    >
                      <option value="system">Sistem (Default)</option>
                      <option value="light">Mode Terang</option>
                      <option value="dark">Mode Gelap</option>
                    </select>
                  </div>

                  <p className="text-xs leading-relaxed text-cu-muted">
                    Warna navbar menyesuaikan background setiap halaman secara otomatis agar ikon dan navigasi tetap kontras.
                  </p>
                </div>

                <div className="pb-12 pt-4 lg:pb-0">
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-5 text-sm font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? "Menyimpan..." : "Update Profil"}
                  </button>
                </div>
                </div>

                {/* Kolom Kanan: Foto Profil (GitHub Style Picture Block) */}
                <div className="w-full lg:w-64 shrink-0 flex flex-col items-center lg:items-start space-y-4">
                  <span className="block text-sm font-semibold text-cu-ink">Foto Profil</span>
                  <div className="relative group">
                    <div className={`size-40 overflow-hidden rounded-full border border-cu-line flex items-center justify-center ${avatarPreview ? "bg-white" : "bg-cu-panel-soft"}`}>
                      {avatarPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarPreview} className="size-full object-cover" alt="Avatar" />
                      ) : (
                        <span className="text-4xl font-bold uppercase text-cu-muted">{initials}</span>
                      )}
                    </div>
                    
                    {/* File Input Overlay / Edit Button */}
                    <label className="absolute bottom-1 right-1 size-10 rounded-full bg-cu-ink text-cu-surface flex items-center justify-center cursor-pointer hover:bg-cu-ink-hover transition-colors">
                      <MaterialIcon name="edit" size="sm" />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleAvatarChange}
                        className="hidden"
                        disabled={isSavingAvatar}
                      />
                    </label>
                  </div>
                  <div className="text-center lg:text-left text-[11px] text-cu-muted space-y-1">
                    <p>Format: JPEG, PNG, JPG, WEBP.</p>
                    <p>Maksimal file 2MB.</p>
                  </div>
                  {avatarError && <p className="text-xs text-cu-danger font-medium">{avatarError}</p>}
                  {avatarStatus && <p className="text-xs text-cu-success font-medium">{avatarStatus}</p>}
                </div>
              </form>

              {cropSource && (
                <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                  <div role="dialog" aria-modal="true" aria-label="Atur crop foto profil" className="w-full max-w-[430px] overflow-hidden rounded-[28px] border border-white/20 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
                    <div className="flex items-center justify-between gap-3 border-b border-cu-line/70 px-5 py-4">
                      <div>
                        <h3 className="text-base font-semibold text-cu-ink">Atur Crop Foto</h3>
                        <p className="mt-0.5 text-xs text-cu-muted">Drag gambar, scroll untuk zoom, lalu gunakan hasilnya.</p>
                      </div>
                      <button
                        type="button"
                        onClick={closeAvatarCrop}
                        className="inline-flex size-9 items-center justify-center rounded-full border border-cu-line bg-white text-cu-ink transition hover:bg-cu-panel-soft"
                        aria-label="Tutup crop avatar"
                      >
                        <MaterialIcon name="close" size="sm" />
                      </button>
                    </div>

                    <div className="p-5">
                      <div
                        className="relative mx-auto aspect-square w-full max-w-[320px] touch-none overflow-hidden rounded-full border border-cu-line bg-[#f4f6f8] shadow-inner cursor-grab active:cursor-grabbing"
                        onPointerDown={handleCropPointerDown}
                        onPointerMove={handleCropPointerMove}
                        onPointerUp={handleCropPointerUp}
                        onPointerCancel={handleCropPointerUp}
                        onWheel={handleCropWheel}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          ref={cropImageRef}
                          src={cropSource}
                          alt="Preview crop avatar"
                          draggable={false}
                          className="size-full select-none object-cover"
                          style={{
                            transform: `translate(${cropOffsetX * 0.35}px, ${cropOffsetY * 0.35}px) scale(${cropZoom})`,
                            transformOrigin: "center",
                          }}
                        />
                        <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-black/10" />
                        <div
                          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/45 bg-black/55 p-1 text-white backdrop-blur-md"
                          onPointerDown={(event) => event.stopPropagation()}
                          onPointerMove={(event) => event.stopPropagation()}
                          onPointerUp={(event) => event.stopPropagation()}
                          onWheel={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              nudgeCropZoom(-0.12);
                            }}
                            className="inline-flex size-8 items-center justify-center rounded-full transition hover:bg-white/15"
                            aria-label="Perkecil foto"
                          >
                            <MaterialIcon name="remove" size="xs" />
                          </button>
                          <span className="min-w-10 text-center text-[11px] font-semibold">{cropZoom.toFixed(1)}x</span>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              nudgeCropZoom(0.12);
                            }}
                            className="inline-flex size-8 items-center justify-center rounded-full transition hover:bg-white/15"
                            aria-label="Perbesar foto"
                          >
                            <MaterialIcon name="add" size="xs" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-2xl bg-cu-panel-soft px-4 py-3 text-xs text-cu-muted">
                        <span>Seluruh lingkaran ini adalah hasil avatar.</span>
                        <button
                          type="button"
                          onClick={() => {
                            updateCropZoom(1);
                            updateCropOffset(0, 0);
                          }}
                          className="font-semibold text-cu-ink transition hover:text-cu-info"
                        >
                          Reset
                        </button>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <button
                          type="button"
                          onClick={closeAvatarCrop}
                          className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-cu-line bg-white text-sm font-semibold text-cu-ink transition hover:bg-cu-panel-soft"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => void applyAvatarCrop()}
                          className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-cu-ink text-sm font-semibold text-white transition hover:bg-cu-ink-hover"
                        >
                          Gunakan Foto
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Security & Devices */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-cu-line pb-3 mb-6">
                <h2 className="text-2xl font-semibold text-cu-ink">Sandi & Keamanan Perangkat</h2>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Kolom Kiri: Ubah Sandi & Danger Zone */}
                <div className="flex-1 w-full space-y-8 max-w-xl">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2 border-b border-cu-line pb-2">
                      <MaterialIcon name="key" size="sm" className="text-cu-muted" />
                      Ubah Kata Sandi
                    </h3>
                    {passwordStatus && (
                      <div className="rounded-lg border border-cu-success/20 bg-cu-success-soft p-4 text-xs text-cu-success">
                        {passwordStatus}
                      </div>
                    )}
                    {passwordError && (
                      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-xs text-cu-danger">
                        {passwordError}
                      </div>
                    )}

                    {user.username !== "root" ? (
                      <div className="rounded-xl border border-cu-line bg-cu-panel-soft p-5 text-xs text-cu-muted leading-relaxed flex items-start gap-3">
                        <MaterialIcon name="info" size="sm" className="text-cu-info shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-cu-ink mb-1">Autentikasi Terpusat Aktif</strong>
                          Akun Anda terhubung dengan autentikasi eksternal Doran Group. Kata sandi Anda dikelola sepenuhnya oleh sistem IT Doran Group dan tidak dapat diubah dari sistem Creative Universe.
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={submitPassword} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-cu-ink" htmlFor="current-pw">
                            Password Saat Ini
                          </label>
                          <input
                            id="current-pw"
                            className="block w-full mt-1.5 rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:border-cu-focus focus:ring-cu-focus"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            disabled={isSavingPassword}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-cu-ink" htmlFor="new-pw">
                            Password Baru
                          </label>
                          <input
                            id="new-pw"
                            className="block w-full mt-1.5 rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:border-cu-focus focus:ring-cu-focus"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isSavingPassword}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-cu-ink" htmlFor="confirm-pw">
                            Konfirmasi Password Baru
                          </label>
                          <input
                            id="confirm-pw"
                            className="block w-full mt-1.5 rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:border-cu-focus focus:ring-cu-focus"
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            disabled={isSavingPassword}
                          />
                        </div>

                        <button
                          type="submit"
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-5 text-sm font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                          disabled={isSavingPassword}
                        >
                          {isSavingPassword ? "Memperbarui..." : "Perbarui Password"}
                        </button>
                      </form>
                    )}
                  </div>

                </div>

                {/* Kolom Kanan: Sesi & Perangkat Aktif */}
                <div className="w-full lg:w-80 shrink-0 space-y-4">
                  <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2 border-b border-cu-line pb-2">
                    <MaterialIcon name="devices" size="sm" className="text-cu-muted" />
                    Sesi & Perangkat Aktif
                  </h3>
                  <p className="text-xs text-cu-muted">Berikut adalah daftar browser dan perangkat yang saat ini mengakses akun Anda.</p>
                  
                  {sessionStatus && (
                    <div className="rounded-lg border border-cu-success/20 bg-cu-success-soft p-4 text-xs text-cu-success">
                      {sessionStatus}
                    </div>
                  )}
                  {sessionError && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-xs text-cu-danger">
                      {sessionError}
                    </div>
                  )}

                  {isLoadingSessions ? (
                    <p className="text-xs text-cu-muted">Memuat sesi...</p>
                  ) : sessions.length === 0 ? (
                    <p className="text-xs text-cu-muted italic">Tidak ada sesi yang tercatat.</p>
                  ) : (
                    <div className="space-y-3">
                      {sessions.map((session) => (
                        <div
                          key={session.id}
                          className="flex flex-col gap-2 p-4 border border-cu-line rounded-xl bg-cu-surface"
                        >
                          <div className="min-w-0">
                            <strong className="block text-xs text-cu-ink truncate" title={session.user_agent || ""}>
                              {session.user_agent || "Perangkat tidak dikenal"}
                            </strong>
                            <p className="text-[10px] text-cu-muted mt-1 font-mono">
                              {session.ip_address || "IP tidak tersedia"} • {getRelativeTime(session.last_activity)}
                            </p>
                          </div>
                          <div className="pt-2 border-t border-cu-line/40 flex justify-end">
                            {session.is_current ? (
                              <span className="badge bg-cu-success-soft text-cu-success text-[10px] px-2.5 py-1 rounded-full font-bold">Sesi ini</span>
                            ) : (
                              <button
                                type="button"
                                className="inline-flex h-7 items-center justify-center gap-1.5 rounded-full border border-cu-danger bg-transparent px-3 text-[10px] font-semibold text-cu-danger transition duration-200 hover:bg-cu-danger-soft cursor-pointer shrink-0"
                                onClick={() => void revokeSession(session.id)}
                              >
                                Cabut Sesi
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Role Settings */}
          {activeTab === "role_settings" && hasRoleSettings && (
            <div className="space-y-8 animate-fade-in">
              <div className="border-b border-cu-line pb-3 mb-6">
                <h2 className="text-2xl font-semibold text-cu-ink">Pengaturan Khusus Peran</h2>
              </div>

              {roleSettingsStatus && (
                <div className="rounded-lg border border-cu-success/20 bg-cu-success-soft p-4 text-sm text-cu-success">
                  {roleSettingsStatus}
                </div>
              )}

              {roleSettingsError && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-cu-danger">
                  {roleSettingsError}
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Kolom Kiri: Form Configs */}
                <form onSubmit={submitRoleSettings} className="flex-1 w-full space-y-8 max-w-xl">
                  {/* 1. Root Settings */}
                  {hasPermission("run-artisan") && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2 border-b border-cu-line pb-2">
                        <MaterialIcon name="admin_panel_settings" size="sm" className="text-cu-danger" />
                        Konfigurasi Sistem (Root)
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-cu-ink" htmlFor="m-mode">Mode Pemeliharaan (Maintenance)</label>
                        <select
                          id="m-mode"
                          value={maintenanceMode}
                          onChange={(e) => setMaintenanceMode(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
                        >
                          <option value="0">Nonaktif (Aktif Normal)</option>
                          <option value="1">Aktif (Pemeliharaan)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cu-ink" htmlFor="d-mode">Pemberitahuan Debug</label>
                        <select
                          id="d-mode"
                          value={globalDebugMode}
                          onChange={(e) => setGlobalDebugMode(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
                        >
                          <option value="0">Matikan Peringatan Debug</option>
                          <option value="1">Tampilkan Peringatan Debug</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-cu-ink" htmlFor="gas-url">Google Apps Script Pricetag URL</label>
                        <input
                          id="gas-url"
                          type="text"
                          value={googleScriptUrl}
                          onChange={(e) => setGoogleScriptUrl(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-cu-ink" htmlFor="f-token">Fonnte API Token (WA)</label>
                        <input
                          id="f-token"
                          type="password"
                          value={fonnteToken}
                          onChange={(e) => setFonnteToken(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cu-ink" htmlFor="f-sender">Fonnte Sender (Nomor WA)</label>
                        <input
                          id="f-sender"
                          type="text"
                          value={fonnteSender}
                          onChange={(e) => setFonnteSender(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
                          placeholder="628..."
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-cu-muted uppercase" htmlFor="p-id">Pusher App ID</label>
                        <input
                          id="p-id"
                          type="text"
                          value={pusherAppId}
                          onChange={(e) => setPusherAppId(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-cu-muted uppercase" htmlFor="p-key">Pusher App Key</label>
                        <input
                          id="p-key"
                          type="text"
                          value={pusherAppKey}
                          onChange={(e) => setPusherAppKey(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-cu-muted uppercase" htmlFor="p-secret">Pusher Secret</label>
                        <input
                          id="p-secret"
                          type="password"
                          value={pusherAppSecret}
                          onChange={(e) => setPusherAppSecret(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-cu-muted uppercase" htmlFor="p-cluster">Pusher Cluster</label>
                        <input
                          id="p-cluster"
                          type="text"
                          value={pusherAppCluster}
                          onChange={(e) => setPusherAppCluster(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. Manager Settings */}
                  {hasPermission("approve-users") && (
                    <div className="space-y-4 pt-6 border-t border-cu-line/60">
                      <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2 border-b border-cu-line pb-2">
                        <MaterialIcon name="groups" size="sm" className="text-cu-info" />
                        Manajemen Alur Kerja (Manajer)
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-cu-ink" htmlFor="wa-reg">Notifikasi Pendaftaran Baru</label>
                        <select
                          id="wa-reg"
                          value={notifyNewRegistration}
                          onChange={(e) => setNotifyNewRegistration(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
                        >
                          <option value="1">Kirim WA ketika user mendaftar</option>
                          <option value="0">Jangan kirim notifikasi</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cu-ink" htmlFor="exp-days">Default Kadaluarsa Batch (Hari)</label>
                        <input
                          id="exp-days"
                          type="number"
                          value={defaultExpiryDays}
                          onChange={(e) => setDefaultExpiryDays(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
                          min="1"
                          max="365"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cu-ink" htmlFor="max-pr">Maksimum Baris per Batch Cetak</label>
                        <input
                          id="max-pr"
                          type="number"
                          value={maxPrintsPerBatch}
                          onChange={(e) => setMaxPrintsPerBatch(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
                          min="10"
                          max="1000"
                        />
                        <p className="mt-1.5 text-[10px] text-cu-muted">Mencegah server timeout ketika mencetak terlalu banyak daftar pricetag sekaligus.</p>
                      </div>
                    </div>
                  )}

                  {/* 3. Designer Settings */}
                  {hasPermission("access-pricetag") && (
                    <div className="space-y-4 pt-6 border-t border-cu-line/60">
                      <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2 border-b border-cu-line pb-2">
                        <MaterialIcon name="verified" size="sm" className="text-cu-success" />
                        Preferensi Studio Pricetag (Designer)
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-cu-ink" htmlFor="lay-default">Layout Desain Bawaan</label>
                        <select
                          id="lay-default"
                          value={defaultLayout}
                          onChange={(e) => setDefaultLayout(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
                        >
                          <option value="classic">Classic Grid (Default)</option>
                          <option value="modern">Modern Compact</option>
                          <option value="minimalist">Minimalist Text</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cu-ink" htmlFor="p-default">Ukuran Kertas Bawaan</label>
                        <select
                          id="p-default"
                          value={defaultPaperSize}
                          onChange={(e) => setDefaultPaperSize(e.target.value)}
                          className="mt-1.5 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
                        >
                          <option value="A4">A4 Standard (Grid)</option>
                          <option value="A3">A3 Large Layout</option>
                          <option value="thermal_80mm">Thermal 80mm</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          id="chk-default"
                          type="checkbox"
                          checked={autoSaveChecklist}
                          onChange={(e) => setAutoSaveChecklist(e.target.checked)}
                          className="size-4 rounded border-cu-line text-cu-ink focus:ring-cu-ink"
                        />
                        <label className="text-sm font-medium text-cu-ink select-none cursor-pointer" htmlFor="chk-default">
                          Simpan otomatis status checklist pencarian
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="pt-6 border-t border-cu-line/60">
                    <button
                      type="submit"
                      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-5 text-sm font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                      disabled={isSavingRoleSettings}
                    >
                      {isSavingRoleSettings ? "Menyimpan..." : "Simpan Pengaturan"}
                    </button>
                  </div>
                </form>

                {/* Kolom Kanan: Hak Akses Aktif */}
                <div className="w-full lg:w-80 shrink-0 space-y-4">
                  <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2 border-b border-cu-line pb-2">
                    <MaterialIcon name="badge" size="sm" className="text-cu-muted" />
                    Hak Akses Anda
                  </h3>
                  <p className="text-xs text-cu-muted">Berikut adalah daftar peran (roles) dan izin langsung (direct permissions) yang saat ini melekat pada akun Anda.</p>
                  
                  <div className="p-4 border border-cu-line rounded-xl bg-cu-surface space-y-4">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-cu-muted">Peran Anda (Roles)</span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <span key={role} className="inline-flex rounded-full border border-cu-line bg-cu-panel-soft text-cu-ink px-2.5 py-0.5 text-[10px] font-bold">
                              {role}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-cu-muted italic">Tidak ada peran</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-cu-line/60">
                      <span className="block text-[10px] font-bold uppercase tracking-wide text-cu-muted">Izin Langsung (Permissions)</span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {user.permissions && user.permissions.length > 0 ? (
                          user.permissions.map((perm) => (
                            <span key={perm} className="inline-flex rounded-full border border-cu-line/60 bg-cu-surface text-cu-muted px-2.5 py-0.5 text-[10px] font-medium">
                              +{perm}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-cu-muted italic">Tidak ada izin langsung</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Activity Log */}
          {activeTab === "activity_log" && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-cu-line pb-3 mb-6">
                <h2 className="text-2xl font-semibold text-cu-ink">Riwayat Aktivitas Keamanan</h2>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Kolom Kiri: Timeline */}
                <div className="flex-1 w-full space-y-6 max-w-xl relative bg-transparent py-4">
                  {/* Vertical Line Connector */}
                  {activities.length > 1 && (
                    <span className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-cu-line" aria-hidden="true"></span>
                  )}

                  {isLoadingActivities ? (
                    <p className="text-sm text-cu-muted text-center py-4">Memuat log aktivitas...</p>
                  ) : activitiesError ? (
                    <p className="text-sm text-cu-danger text-center py-4">{activitiesError}</p>
                  ) : activities.length === 0 ? (
                    <p className="text-sm text-cu-muted text-center py-4 italic">Belum ada catatan riwayat aktivitas terdaftar.</p>
                  ) : (
                    activities.map((act) => {
                      const nodeColorClass = getNodeColorClass(act.event);
                      const iconName = getIconName(act.event);
                      const actionName = getActionName(act);
                      const logLabel = getLogLabel(act.log_name);

                      return (
                        <div key={act.id} className="relative pl-9 pb-1 flex items-start gap-4">
                          {/* Circle Node Icon */}
                          <span className={`absolute left-0 top-0.5 size-6 rounded-full border flex items-center justify-center shrink-0 ${nodeColorClass}`}>
                            <MaterialIcon name={iconName} size="xs" />
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-cu-ink">
                              {actionName} pada <strong className="text-xs font-semibold uppercase tracking-wider text-cu-muted">{logLabel}</strong>
                            </p>
                            <p className="text-xs text-cu-muted mt-0.5">
                              {getRelativeTime(act.created_at || "")}
                              {act.properties?.ip && ` • IP: ${act.properties.ip}`}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Kolom Kanan: Info Audit */}
                <div className="w-full lg:w-80 shrink-0 space-y-4">
                  <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2 border-b border-cu-line pb-2">
                    <MaterialIcon name="verified_user" size="sm" className="text-cu-muted" />
                    Jejak Audit Keamanan
                  </h3>
                  <p className="text-xs text-cu-muted">Sistem mencatat aktivitas penting demi keamanan akun Anda.</p>
                  
                  <div className="p-4 border border-cu-line rounded-xl bg-cu-surface space-y-3 text-xs leading-relaxed text-cu-muted">
                    <div className="flex gap-2">
                      <MaterialIcon name="info" size="xs" className="text-cu-info shrink-0 mt-0.5" />
                      <p>Mencatat riwayat login, perubahan profil, modifikasi password, dan pengaturan peran secara otomatis.</p>
                    </div>
                    <div className="flex gap-2 pt-2.5 border-t border-cu-line/60">
                      <MaterialIcon name="shield" size="xs" className="text-cu-success shrink-0 mt-0.5" />
                      <p>Dilengkapi pencatatan alamat IP perangkat untuk mendeteksi anomali akses mencurigakan.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Billing & Licensing Demo views */}
          {activeTab.startsWith("billing_") && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-cu-line pb-3 mb-6">
                <h2 className="text-2xl font-semibold text-cu-ink">
                  {activeTab === "billing_overview" && "Billing Overview"}
                  {activeTab === "billing_usage" && "Billing Usage"}
                  {activeTab === "billing_ai" && "AI Usage Settings"}
                  {activeTab === "billing_budgets" && "Budgets and Alerts"}
                </h2>
              </div>
              <div className="rounded-xl border border-dashed border-cu-line bg-cu-surface p-12 text-center">
                <MaterialIcon name="credit_card" size="lg" className="mx-auto text-cu-soft animate-pulse" />
                <h3 className="mt-3 text-sm font-semibold text-cu-ink">Halaman Demo Template</h3>
                <p className="mt-1 text-xs text-cu-muted max-w-xs mx-auto">
                  Ini adalah konten halaman demo untuk menu bertingkat (nested menu) &quot;Billing and licensing&quot;.
                </p>
              </div>
            </div>
          )}
      </div>
    </SettingsLayout>
  );
};
