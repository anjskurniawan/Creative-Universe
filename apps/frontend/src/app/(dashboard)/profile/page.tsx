"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { apiFetch, ApiError, ValidationError } from "@/lib/api";
import { User, useAuth } from "@/providers/auth-provider";
import { MaterialIcon } from "@/components/material-icon";

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
  
  // Tab State
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "role_settings" | "activity_log">("profile");

  // Profile forms state
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [theme, setTheme] = useState("system");
  const [navbarVariant, setNavbarVariant] = useState("solid");
  
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Avatar upload state
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarStatus, setAvatarStatus] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

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

  // Collapsible accordion states
  const [dataDiriOpen, setDataDiriOpen] = useState(true);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);

  const [changePasswordOpen, setChangePasswordOpen] = useState(true);
  const [activeSessionsOpen, setActiveSessionsOpen] = useState(false);
  const [dangerZoneOpen, setDangerZoneOpen] = useState(false);

  const [rootSettingsOpen, setRootSettingsOpen] = useState(true);
  const [managerSettingsOpen, setManagerSettingsOpen] = useState(false);
  const [designerSettingsOpen, setDesignerSettingsOpen] = useState(false);

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
      setNavbarVariant(settingValue(user, "navbar_variant", "solid"));
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
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarStatus(null);
      setAvatarError(null);
    }
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
            navbar_variant: navbarVariant,
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
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="border-b border-cu-line bg-cu-surface -mx-4 -mt-6 mb-6 px-4 py-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold tracking-tight text-cu-ink md:text-3xl">Pengaturan Akun</h1>
          <p className="mt-1 text-sm text-cu-muted">
            Kelola profil, preferensi peran, sesi perangkat aktif, dan jejak aktivitas Anda.
          </p>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-6 lg:flex-row items-start">
        {/* Left Tab Menu */}
        <div className="w-full shrink-0 lg:w-64">
          <nav className="flex w-full gap-1 overflow-x-auto pb-3 scrollbar-none lg:flex-col lg:gap-1.5 lg:pb-0 border-b border-cu-line lg:border-b-0 lg:border-r lg:border-cu-line/60 pr-0 lg:pr-4">
            <button
              onClick={() => setActiveTab("profile")}
              type="button"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap w-auto lg:w-full border-b-2 lg:border-b-0 lg:border-l-2 cursor-pointer ${
                activeTab === "profile"
                  ? "border-cu-focus text-cu-ink bg-cu-panel-soft lg:bg-cu-panel-soft/80 font-bold"
                  : "border-transparent text-cu-muted hover:text-cu-focus hover:bg-cu-panel-soft/30"
              }`}
            >
              <MaterialIcon name="person" size="sm" />
              Profil & Tampilan
            </button>

            <button
              onClick={() => setActiveTab("security")}
              type="button"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap w-auto lg:w-full border-b-2 lg:border-b-0 lg:border-l-2 cursor-pointer ${
                activeTab === "security"
                  ? "border-cu-focus text-cu-ink bg-cu-panel-soft lg:bg-cu-panel-soft/80 font-bold"
                  : "border-transparent text-cu-muted hover:text-cu-focus hover:bg-cu-panel-soft/30"
              }`}
            >
              <MaterialIcon name="security" size="sm" />
              Keamanan & Perangkat
            </button>

            {hasRoleSettings && (
              <button
                onClick={() => setActiveTab("role_settings")}
                type="button"
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap w-auto lg:w-full border-b-2 lg:border-b-0 lg:border-l-2 cursor-pointer ${
                  activeTab === "role_settings"
                    ? "border-cu-focus text-cu-ink bg-cu-panel-soft lg:bg-cu-panel-soft/80 font-bold"
                    : "border-transparent text-cu-muted hover:text-cu-focus hover:bg-cu-panel-soft/30"
                }`}
              >
                <MaterialIcon name="admin_panel_settings" size="sm" />
                Pengaturan Peran
              </button>
            )}

            <button
              onClick={() => setActiveTab("activity_log")}
              type="button"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap w-auto lg:w-full border-b-2 lg:border-b-0 lg:border-l-2 cursor-pointer ${
                activeTab === "activity_log"
                  ? "border-cu-focus text-cu-ink bg-cu-panel-soft lg:bg-cu-panel-soft/80 font-bold"
                  : "border-transparent text-cu-muted hover:text-cu-focus hover:bg-cu-panel-soft/30"
              }`}
            >
              <MaterialIcon name="history" size="sm" />
              Jejak Aktivitas
            </button>
          </nav>
        </div>

        {/* Right Settings Panels */}
        <div className="flex-1 w-full space-y-6">
          {/* TAB 1: Profile & Displays */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-cu-ink">Informasi Profil & Tampilan</h2>
                <p className="mt-1 text-sm text-cu-muted">
                  Perbarui data diri, nomor WhatsApp, foto profil, dan preferensi tampilan akun Anda.
                </p>
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

              <form onSubmit={submitProfile} className="space-y-4">
                {/* 1. Data Diri */}
                <div className="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setDataDiriOpen(!dataDiriOpen)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none cursor-pointer"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2">
                        <MaterialIcon name="person" size="sm" className="text-cu-muted" />
                        Data Diri & Kontak
                      </h3>
                      <p className="text-xs text-cu-muted mt-0.5">
                        Nama lengkap, alamat email, username, dan nomor kontak WhatsApp Anda.
                      </p>
                    </div>
                    <MaterialIcon
                      name="expand_more"
                      size="sm"
                      className={`transition-transform duration-200 ${dataDiriOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dataDiriOpen && (
                    <div className="px-5 pb-5 pt-3 border-t border-cu-line/30 space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-cu-ink" htmlFor="profile-name">
                            Nama Lengkap
                          </label>
                          <input
                            id="profile-name"
                            className="block w-full mt-1 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:border-cu-focus focus:ring-cu-focus"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-cu-ink" htmlFor="profile-username">
                            Username
                          </label>
                          <input
                            id="profile-username"
                            className="block w-full mt-1 rounded-lg border border-cu-border bg-cu-panel-soft px-3 py-2 text-sm text-cu-muted cursor-not-allowed"
                            type="text"
                            value={username}
                            readOnly
                          />
                          <p className="mt-1 text-[10px] text-cu-muted">
                            Username tidak dapat diubah demi keamanan akun.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-cu-ink" htmlFor="profile-email">
                            Email
                          </label>
                          <input
                            id="profile-email"
                            className="block w-full mt-1 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:border-cu-focus focus:ring-cu-focus"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-cu-ink" htmlFor="profile-whatsapp">
                            Nomor WhatsApp
                          </label>
                          <input
                            id="profile-whatsapp"
                            className="block w-full mt-1 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:border-cu-focus focus:ring-cu-focus"
                            type="text"
                            value={whatsappNumber}
                            onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ""))}
                            placeholder="Contoh: 628123456789"
                          />
                          <p className="mt-1 text-[10px] text-cu-muted">
                            Diawali kode negara 62 (tanpa + atau spasi). Digunakan untuk notifikasi/OTP WhatsApp.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Foto Profil */}
                <div className="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setAvatarOpen(!avatarOpen)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none cursor-pointer"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2">
                        <MaterialIcon name="image" size="sm" className="text-cu-muted" />
                        Foto Profil (Avatar)
                      </h3>
                      <p className="text-xs text-cu-muted mt-0.5">Unggah atau ganti foto profil akun Anda.</p>
                    </div>
                    <MaterialIcon
                      name="expand_more"
                      size="sm"
                      className={`transition-transform duration-200 ${avatarOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {avatarOpen && (
                    <div className="px-5 pb-5 pt-3 border-t border-cu-line/30">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className={`relative size-16 shrink-0 overflow-hidden rounded-full border border-cu-line flex items-center justify-center ${avatarPreview ? "bg-white" : "bg-cu-panel-soft"}`}>
                          {avatarPreview ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatarPreview} className="size-full object-cover" alt="Avatar" />
                          ) : (
                            <span className="text-xl font-bold uppercase text-cu-muted">{initials}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-cu-ink" htmlFor="avatar-file">
                            Berkas Gambar
                          </label>
                          <input
                            id="avatar-file"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarChange}
                            className="mt-1 block w-full text-xs text-cu-muted file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-cu-ink file:text-cu-surface hover:file:bg-cu-ink-hover cursor-pointer"
                            disabled={isSavingAvatar}
                          />
                          <p className="mt-1 text-xs text-cu-muted">Maksimal 2MB. Format: JPEG, PNG, JPG, WEBP.</p>
                          {avatarError && <p className="mt-2 text-sm text-cu-danger">{avatarError}</p>}
                          {avatarStatus && <p className="mt-2 text-sm text-cu-success">{avatarStatus}</p>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Preferensi Tampilan */}
                <div className="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setThemeOpen(!themeOpen)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none cursor-pointer"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2">
                        <MaterialIcon name="palette" size="sm" className="text-cu-muted" />
                        Preferensi Tema & Tampilan
                      </h3>
                      <p className="text-xs text-cu-muted mt-0.5">Atur tema gelap/terang dan gaya bilah navigasi (navbar).</p>
                    </div>
                    <MaterialIcon
                      name="expand_more"
                      size="sm"
                      className={`transition-transform duration-200 ${themeOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {themeOpen && (
                    <div className="px-5 pb-5 pt-3 border-t border-cu-line/30">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-cu-ink" htmlFor="theme-select">
                            Tema Tampilan
                          </label>
                          <select
                            id="theme-select"
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm focus:border-cu-focus focus:ring-1 focus:ring-cu-focus focus:outline-none"
                          >
                            <option value="system">Sistem (Default)</option>
                            <option value="light">Mode Terang</option>
                            <option value="dark">Mode Gelap</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-cu-ink" htmlFor="navbar-select">
                            Tampilan Navbar
                          </label>
                          <select
                            id="navbar-select"
                            value={navbarVariant}
                            onChange={(e) => setNavbarVariant(e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink shadow-sm focus:border-cu-focus focus:ring-1 focus:ring-cu-focus focus:outline-none"
                          >
                            <option value="solid">Solid</option>
                            <option value="glass">Glassmorphism</option>
                            <option value="dark-glass">Dark Glassmorphism</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-5 text-sm font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? "Menyimpan..." : "Simpan Profil"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Security & Devices */}
          {activeTab === "security" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-cu-ink">Keamanan & Perangkat</h2>
                <p className="mt-1 text-sm text-cu-muted">
                  Kelola sandi akun Anda dan pantau sesi perangkat yang aktif.
                </p>
              </div>

              {/* Collapsible 1: Change Password */}
              <div className="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setChangePasswordOpen(!changePasswordOpen)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none cursor-pointer"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2">
                      <MaterialIcon name="key" size="sm" className="text-cu-muted" />
                      Ubah Kata Sandi
                    </h3>
                    <p className="text-xs text-cu-muted mt-0.5">Perbarui kata sandi akun Anda secara berkala.</p>
                  </div>
                  <MaterialIcon
                    name="expand_more"
                    size="sm"
                    className={`transition-transform duration-200 ${changePasswordOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {changePasswordOpen && (
                  <div className="px-5 pb-5 pt-3 border-t border-cu-line/30">
                    {passwordStatus && (
                      <div className="mb-4 rounded-lg border border-cu-success/20 bg-cu-success-soft p-4 text-xs text-cu-success animate-fade-in">
                        {passwordStatus}
                      </div>
                    )}
                    {passwordError && (
                      <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-xs text-cu-danger animate-fade-in">
                        {passwordError}
                      </div>
                    )}

                    <form onSubmit={submitPassword} className="space-y-4 max-w-xl">
                      <div>
                        <label className="block text-sm font-medium text-cu-ink" htmlFor="current-pw">
                          Password Saat Ini
                        </label>
                        <input
                          id="current-pw"
                          className="block w-full mt-1 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:border-cu-focus focus:ring-cu-focus"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          disabled={isSavingPassword}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cu-ink" htmlFor="new-pw">
                          Password Baru
                        </label>
                        <input
                          id="new-pw"
                          className="block w-full mt-1 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:border-cu-focus focus:ring-cu-focus"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isSavingPassword}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-cu-ink" htmlFor="confirm-pw">
                          Konfirmasi Password Baru
                        </label>
                        <input
                          id="confirm-pw"
                          className="block w-full mt-1 rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink focus:border-cu-focus focus:ring-cu-focus"
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
                  </div>
                )}
              </div>

              {/* Collapsible 2: Device Sessions */}
              <div className="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveSessionsOpen(!activeSessionsOpen)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none cursor-pointer"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2">
                      <MaterialIcon name="devices" size="sm" className="text-cu-muted" />
                      Sesi & Perangkat Aktif
                    </h3>
                    <p className="text-xs text-cu-muted mt-0.5">Daftar browser dan perangkat yang saat ini mengakses akun Anda.</p>
                  </div>
                  <MaterialIcon
                    name="expand_more"
                    size="sm"
                    className={`transition-transform duration-200 ${activeSessionsOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {activeSessionsOpen && (
                  <div className="px-5 pb-5 pt-3 border-t border-cu-line/30">
                    <p className="text-xs text-cu-muted mb-4">Cabut sesi perangkat yang tidak lagi Anda gunakan.</p>
                    
                    {sessionStatus && (
                      <div className="mb-4 rounded-lg border border-cu-success/20 bg-cu-success-soft p-4 text-xs text-cu-success animate-fade-in">
                        {sessionStatus}
                      </div>
                    )}
                    {sessionError && (
                      <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-xs text-cu-danger animate-fade-in">
                        {sessionError}
                      </div>
                    )}

                    {isLoadingSessions ? (
                      <p className="text-xs text-cu-muted">Memuat sesi...</p>
                    ) : sessions.length === 0 ? (
                      <p className="text-xs text-cu-muted italic">Tidak ada sesi yang tercatat.</p>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {sessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between gap-4 p-4 border border-cu-line rounded-lg"
                          >
                            <div className="min-w-0 flex-1">
                              <strong className="block text-sm text-cu-ink truncate">{session.user_agent || "Perangkat tidak dikenal"}</strong>
                              <p className="text-xs text-cu-muted mt-1 font-mono">
                                {session.ip_address || "IP tidak tersedia"} · {getRelativeTime(session.last_activity)}
                              </p>
                            </div>
                            {session.is_current ? (
                              <span className="badge badge-success shrink-0">Sesi ini</span>
                            ) : (
                              <button
                                type="button"
                                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-cu-danger bg-transparent px-3 text-xs font-semibold text-cu-danger transition duration-200 hover:bg-cu-danger-soft cursor-pointer shrink-0"
                                onClick={() => void revokeSession(session.id)}
                              >
                                Cabut Sesi
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Collapsible 3: Danger Zone */}
              {hasPermission("run-artisan") && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setDangerZoneOpen(!dangerZoneOpen)}
                    className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-red-500/10 transition focus:outline-none cursor-pointer"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-red-600 flex items-center gap-2">
                        <MaterialIcon name="warning" size="sm" className="text-red-500/70" />
                        Hapus Akun (Danger Zone)
                      </h3>
                      <p className="text-xs text-red-600/75 mt-0.5">Tindakan permanen untuk menonaktifkan akun.</p>
                    </div>
                    <MaterialIcon
                      name="expand_more"
                      size="sm"
                      className={`transition-transform duration-200 ${dangerZoneOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {dangerZoneOpen && (
                    <div className="px-5 pb-5 pt-3 border-t border-red-500/10">
                      <p className="text-xs text-red-600">
                        Penghapusan akun langsung secara mandiri saat ini dinonaktifkan. Silakan hubungi admin utama PT Doran Sukses Indonesia.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Role Settings */}
          {activeTab === "role_settings" && hasRoleSettings && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-cu-ink">Pengaturan Khusus Peran</h2>
                <p className="mt-1 text-sm text-cu-muted">
                  Konfigurasi opsi spesifik berdasarkan hak akses akun Anda di sistem.
                </p>
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

              <form onSubmit={submitRoleSettings} className="space-y-4">
                {/* 1. Root Settings */}
                {hasPermission("run-artisan") && (
                  <div className="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setRootSettingsOpen(!rootSettingsOpen)}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none cursor-pointer"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2">
                          <MaterialIcon name="admin_panel_settings" size="sm" className="text-cu-danger" />
                          Konfigurasi Sistem (Root)
                        </h3>
                        <p className="text-xs text-cu-muted mt-0.5">Mode pemeliharaan, debug log, dan kunci integrasi API.</p>
                      </div>
                      <MaterialIcon
                        name="expand_more"
                        size="sm"
                        className={`transition-transform duration-200 ${rootSettingsOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {rootSettingsOpen && (
                      <div className="px-5 pb-5 pt-3 border-t border-cu-line/30 space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-cu-ink" htmlFor="m-mode">Mode Pemeliharaan (Maintenance)</label>
                            <select
                              id="m-mode"
                              value={maintenanceMode}
                              onChange={(e) => setMaintenanceMode(e.target.value)}
                              className="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
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
                              className="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
                            >
                              <option value="0">Matikan Peringatan Debug</option>
                              <option value="1">Tampilkan Peringatan Debug</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-cu-ink" htmlFor="gas-url">Google Apps Script Pricetag URL</label>
                          <input
                            id="gas-url"
                            type="text"
                            value={googleScriptUrl}
                            onChange={(e) => setGoogleScriptUrl(e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-xs text-cu-ink"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-cu-ink" htmlFor="f-token">Fonnte API Token (WA)</label>
                            <input
                              id="f-token"
                              type="password"
                              value={fonnteToken}
                              onChange={(e) => setFonnteToken(e.target.value)}
                              className="mt-1 block w-full rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-xs text-cu-ink"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-cu-ink" htmlFor="f-sender">Fonnte Sender (Nomor WA)</label>
                            <input
                              id="f-sender"
                              type="text"
                              value={fonnteSender}
                              onChange={(e) => setFonnteSender(e.target.value)}
                              className="mt-1 block w-full rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-xs text-cu-ink"
                              placeholder="628..."
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                          <div>
                            <label className="block text-[10px] font-bold text-cu-muted uppercase" htmlFor="p-id">Pusher App ID</label>
                            <input
                              id="p-id"
                              type="text"
                              value={pusherAppId}
                              onChange={(e) => setPusherAppId(e.target.value)}
                              className="mt-1 block w-full rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-xs text-cu-ink font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-cu-muted uppercase" htmlFor="p-key">Pusher App Key</label>
                            <input
                              id="p-key"
                              type="text"
                              value={pusherAppKey}
                              onChange={(e) => setPusherAppKey(e.target.value)}
                              className="mt-1 block w-full rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-xs text-cu-ink font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-cu-muted uppercase" htmlFor="p-secret">Pusher Secret</label>
                            <input
                              id="p-secret"
                              type="password"
                              value={pusherAppSecret}
                              onChange={(e) => setPusherAppSecret(e.target.value)}
                              className="mt-1 block w-full rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-xs text-cu-ink font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-cu-muted uppercase" htmlFor="p-cluster">Pusher Cluster</label>
                            <input
                              id="p-cluster"
                              type="text"
                              value={pusherAppCluster}
                              onChange={(e) => setPusherAppCluster(e.target.value)}
                              className="mt-1 block w-full rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-xs text-cu-ink font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Manager Settings */}
                {hasPermission("approve-users") && (
                  <div className="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setManagerSettingsOpen(!managerSettingsOpen)}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none cursor-pointer"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2">
                          <MaterialIcon name="groups" size="sm" className="text-cu-info" />
                          Manajemen Alur Kerja (Manajer)
                        </h3>
                        <p className="text-xs text-cu-muted mt-0.5">Notifikasi pendaftaran baru dan limit cetak pricetag divisi.</p>
                      </div>
                      <MaterialIcon
                        name="expand_more"
                        size="sm"
                        className={`transition-transform duration-200 ${managerSettingsOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {managerSettingsOpen && (
                      <div className="px-5 pb-5 pt-3 border-t border-cu-line/30 space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-cu-ink" htmlFor="wa-reg">Notifikasi Pendaftaran Baru</label>
                            <select
                              id="wa-reg"
                              value={notifyNewRegistration}
                              onChange={(e) => setNotifyNewRegistration(e.target.value)}
                              className="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
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
                              className="mt-1 block w-full rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink"
                              min="1"
                              max="365"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-cu-ink" htmlFor="max-pr">Maksimum Baris per Batch Cetak</label>
                          <input
                            id="max-pr"
                            type="number"
                            value={maxPrintsPerBatch}
                            onChange={(e) => setMaxPrintsPerBatch(e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-cu-border bg-cu-surface px-3 py-2 text-sm text-cu-ink"
                            min="10"
                            max="1000"
                          />
                          <p className="mt-1 text-[10px] text-cu-muted">Mencegah server timeout ketika mencetak terlalu banyak daftar pricetag sekaligus.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Designer Settings */}
                {hasPermission("access-pricetag") && (
                  <div className="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setDesignerSettingsOpen(!designerSettingsOpen)}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-cu-panel-soft/30 transition focus:outline-none cursor-pointer"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2">
                          <MaterialIcon name="verified" size="sm" className="text-cu-success" />
                          Preferensi Studio Pricetag (Designer)
                        </h3>
                        <p className="text-xs text-cu-muted mt-0.5">Tata letak cetak bawaan, ukuran kertas, dan simpan checklist otomatis.</p>
                      </div>
                      <MaterialIcon
                        name="expand_more"
                        size="sm"
                        className={`transition-transform duration-200 ${designerSettingsOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {designerSettingsOpen && (
                      <div className="px-5 pb-5 pt-3 border-t border-cu-line/30 space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-cu-ink" htmlFor="lay-default">Layout Desain Bawaan</label>
                            <select
                              id="lay-default"
                              value={defaultLayout}
                              onChange={(e) => setDefaultLayout(e.target.value)}
                              className="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
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
                              className="mt-1 block w-full rounded-lg border border-cu-line bg-cu-surface px-3 py-2 text-sm text-cu-ink"
                            >
                              <option value="A4">A4 Standard (Grid)</option>
                              <option value="A3">A3 Large Layout</option>
                              <option value="thermal_80mm">Direct Thermal 80mm</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            id="chk-default"
                            type="checkbox"
                            checked={autoSaveChecklist}
                            onChange={(e) => setAutoSaveChecklist(e.target.checked)}
                            className="size-4 rounded border-cu-border text-cu-ink focus:ring-cu-ink"
                          />
                          <label className="text-sm font-medium text-cu-ink select-none cursor-pointer" htmlFor="chk-default">
                            Simpan otomatis status checklist pencarian
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-cu-ink bg-cu-ink px-5 text-sm font-medium leading-none text-cu-surface transition duration-200 hover:border-cu-ink-hover hover:bg-cu-ink-hover focus:outline-none focus:ring-2 focus:ring-cu-focus focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                    disabled={isSavingRoleSettings}
                  >
                    {isSavingRoleSettings ? "Menyimpan..." : "Simpan Pengaturan Peran"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: Activity Log */}
          {activeTab === "activity_log" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-lg font-semibold text-cu-ink font-sans">Riwayat Aktivitas Keamanan</h2>
                <p className="mt-1 text-sm text-cu-muted">
                  Jejak audit dari 10 aktivitas login dan pembaruan terakhir pada akun Anda.
                </p>
              </div>

              {/* Timeline Accordion */}
              <div className="rounded-xl border border-cu-line bg-cu-surface shadow-sm overflow-hidden">
                <div className="w-full flex items-center justify-between px-5 py-3.5 text-left border-b border-cu-line/30 bg-cu-panel-soft/10">
                  <div>
                    <h3 className="text-sm font-semibold text-cu-ink flex items-center gap-2">
                      <MaterialIcon name="history" size="sm" className="text-cu-muted" />
                      Riwayat Log Keamanan
                    </h3>
                    <p className="text-xs text-cu-muted mt-0.5">Jejak audit riwayat login dan aktivitas akun terakhir Anda.</p>
                  </div>
                </div>

                <div className="px-6 py-6 space-y-6 relative">
                  {/* Vertical Line Connector */}
                  {activities.length > 1 && (
                    <span className="absolute left-[35px] top-9 bottom-9 w-0.5 bg-cu-line" aria-hidden="true"></span>
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
                        <div key={act.id} className="relative pl-8 pb-1 flex items-start gap-4">
                          {/* Circle Node Icon */}
                          <span className={`absolute left-[-29px] top-0.5 size-6 rounded-full border flex items-center justify-center shrink-0 ${nodeColorClass}`}>
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
