"use client";

import { useContext } from "react";
import { AuthContext } from "@/providers/auth";
import type { AuthUser } from "@/core/auth";

export type User = AuthUser;

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return context;
}
