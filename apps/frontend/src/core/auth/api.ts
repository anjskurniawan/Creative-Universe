import { apiFetch, refreshCsrfCookie } from "@/core/api/client";
import type {
  AuthUser,
  LoginCredentials,
  OnboardingDivision,
  OnboardingInput,
} from "./types";

export const authApi = {
  session: {
    current: () => apiFetch<AuthUser>("/auth/me", { skipAuthRedirect: true }),
    login: async (credentials: LoginCredentials) => {
      await refreshCsrfCookie();
      return apiFetch<AuthUser>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
        skipAuthRedirect: true,
      });
    },
    logout: () => apiFetch<null>("/auth/logout", {
      method: "POST",
      skipAuthRedirect: true,
    }),
  },
  passwordReset: {
    requestOtp: async (login: string) => {
      await refreshCsrfCookie();
      return apiFetch<{ masked_phone: string }>("/auth/password/otp", {
        method: "POST",
        body: JSON.stringify({ login }),
        skipAuthRedirect: true,
      });
    },
    verifyOtp: (otp: string) => apiFetch<null>("/auth/password/otp/verify", {
      method: "POST",
      body: JSON.stringify({ otp }),
      skipAuthRedirect: true,
    }),
    reset: (password: string, passwordConfirmation: string) =>
      apiFetch<null>("/auth/password/reset", {
        method: "POST",
        body: JSON.stringify({
          password,
          password_confirmation: passwordConfirmation,
        }),
        skipAuthRedirect: true,
      }),
  },
  onboarding: {
    data: () => apiFetch<OnboardingDivision[]>("/onboarding/data"),
    submit: (input: OnboardingInput) => apiFetch<null>("/onboarding/submit", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  },
} as const;
