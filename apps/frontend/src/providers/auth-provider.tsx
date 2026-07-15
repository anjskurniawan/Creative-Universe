"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AUTH_SESSION_EXPIRED_EVENT } from "@/core/api/client";
import { authApi, type AuthUser, type LoginCredentials } from "@/core/auth";
import { APP_ROUTES } from "@/core/navigation/routes";
import { canAccessApplication, type ApplicationKey } from "@/core/applications";

export type User = AuthUser;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasApplication: (application: ApplicationKey) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const profile = await authApi.session.current();
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
    let active = true;
    authApi.session.current()
      .then((profile) => {
        if (active) setUser(profile);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const expireSession = () => {
      setUser(null);
      setIsLoading(false);
    };
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, expireSession);
    return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, expireSession);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    const profile = await authApi.session.login(credentials);
    setUser(profile);
    setIsLoading(false);
    return profile;
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.session.logout();
    } catch {
      // State browser tetap dibersihkan jika backend tidak dapat dijangkau.
    } finally {
      setUser(null);
      if (typeof window !== "undefined") window.location.href = APP_ROUTES.login;
    }
  };

  const isRoot = user?.roles.some((role) => role.toLowerCase() === "root") ?? false;
  const hasRole = (role: string): boolean =>
    isRoot || (user?.roles.some((item) => item.toLowerCase() === role.toLowerCase()) ?? false);
  const hasPermission = (permission: string): boolean =>
    isRoot || (user?.permissions.includes(permission) ?? false);
  const hasApplication = (application: ApplicationKey): boolean =>
    isRoot || canAccessApplication(user?.applications ?? [], application);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        login,
        logout,
        refreshUser,
        hasRole,
        hasPermission,
        hasApplication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return context;
}
