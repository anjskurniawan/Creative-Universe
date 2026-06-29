"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiFetch, refreshCsrfCookie, ApiError } from "@/lib/api";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  whatsapp_number: string | null;
  avatar_url: string | null;
  is_onboarded: boolean;
  division_id: number | null;
  position_id: number | null;
  roles: string[];
  permissions: string[];
  settings: Record<string, unknown> | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: Record<string, string>) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const profile = await apiFetch<User>("/auth/me", {
        _skipAuthRedirect: true,
      });
      setUser(profile);
      return profile;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const bootstrapSession = async () => {
      await refreshUser();
    };
    void bootstrapSession();
  }, [refreshUser]);

  const login = async (credentials: Record<string, string>): Promise<User> => {
    await refreshCsrfCookie();
    await apiFetch<User>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    const profile = await refreshUser();
    if (!profile) {
      throw new ApiError("Gagal mengambil profil setelah login.", 500);
    }
    return profile;
  };

  const logout = async (): Promise<void> => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {
      // Session lokal tetap dibersihkan ketika server tidak dapat dijangkau.
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  const isRoot = user?.roles.includes("Root") ?? false;

  const hasRole = (role: string): boolean =>
    isRoot || (user?.roles.includes(role) ?? false);

  const hasPermission = (permission: string): boolean =>
    isRoot || (user?.permissions.includes(permission) ?? false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
        hasRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }
  return context;
}
