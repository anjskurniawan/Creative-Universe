import { apiFetch } from "@/core/api/client";
import type { AuthUser, LoginCredentials, OnboardingDivision, OnboardingInput } from "./types";

export const authApi = {
  session: {
    current: () => apiFetch<AuthUser>("/auth/me"),
    login: (credentials: LoginCredentials) => apiFetch<AuthUser>("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
    logout: () => apiFetch<null>("/auth/logout", { method: "POST" }),
  },
  passwordReset: {
    requestOtp: (login: string) => apiFetch<{ masked_phone: string }>("/auth/password/otp", { method: "POST", body: JSON.stringify({ login }) }),
    verifyOtp: (otp: string) => apiFetch<null>("/auth/password/otp/verify", { method: "POST", body: JSON.stringify({ otp }) }),
    reset: (password: string, passwordConfirmation: string) => apiFetch<null>("/auth/password/reset", { method: "POST", body: JSON.stringify({ password, password_confirmation: passwordConfirmation }) }),
  },
  onboarding: {
    data: () => apiFetch<OnboardingDivision[]>("/onboarding/data"),
    submit: (input: OnboardingInput) => apiFetch<null>("/onboarding/submit", { method: "POST", body: JSON.stringify(input) }),
  },
};
