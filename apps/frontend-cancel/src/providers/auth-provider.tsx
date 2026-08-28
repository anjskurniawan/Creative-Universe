"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { ApiError, AUTH_SESSION_EXPIRED_EVENT } from "@/core/api/client";
import { authApi, type AuthUser, type LoginCredentials } from "@/core/auth";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  sessionCheckFailed: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser | null>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasApplication: (application: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionCheckFailed, setSessionCheckFailed] = useState(false);

  const refreshUser = useCallback(async () => {
    try { const profile = await authApi.session.current(); setUser(profile); setSessionCheckFailed(false); return profile; }
    catch (error) { if (error instanceof ApiError && error.status === 401) setUser(null); else setSessionCheckFailed(true); return null; }
    finally { setIsLoading(false); }
  }, []);

  // The effect intentionally hydrates React state from the external browser session.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void refreshUser(); }, [refreshUser]);
  useEffect(() => { const clear = () => { setUser(null); setIsLoading(false); }; window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, clear); return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, clear); }, []);

  const login = async (credentials: LoginCredentials) => { const profile = await authApi.session.login(credentials); setUser(profile); setSessionCheckFailed(false); return profile; };
  const logout = async () => { try { await authApi.session.logout(); } finally { setUser(null); } };
  const hasRole = (role: string) => user?.roles.some((item) => item.toLowerCase() === "root" || item.toLowerCase() === role.toLowerCase()) ?? false;
  const hasPermission = (permission: string) => user?.roles.some((item) => item.toLowerCase() === "root") || user?.permissions.includes(permission) || false;
  const hasApplication = (application: string) => user?.roles.some((item) => item.toLowerCase() === "root") || user?.applications.some((item) => item.key === application) || false;

  return <AuthContext.Provider value={{ user, isLoading, sessionCheckFailed, isAuthenticated: user !== null, login, logout, refreshUser, hasRole, hasPermission, hasApplication }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return context;
}
