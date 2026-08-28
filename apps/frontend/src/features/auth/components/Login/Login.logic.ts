"use client";

import { useState, FormEvent, RefObject } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/auth";
import { resolveAuthenticatedRoute } from "@/core/auth";
import { ValidationError } from "@/core/api/client";
import { playUniverseTransition } from "./Login.animations";
import { DEFAULT_LOGIN_CONFIG } from "./Login.config";

export function useLoginLogic({
  whiteOverlayRef,
  setToast,
}: {
  whiteOverlayRef: RefObject<HTMLDivElement | null>;
  setToast: (toast: { status: "success" | "error"; message: string } | null) => void;
}) {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const hasUsername = username.trim() !== "";
  const hasPassword = password.trim() !== "";

  const usernameHasError = Boolean(fieldErrors.username?.length);
  const passwordHasError = Boolean(fieldErrors.password?.length);

  const desktopCanSubmit = hasUsername && hasPassword;

  function clearFieldError(field: "username" | "password") {
    setFieldErrors((current) => ({
      ...current,
      [field]: [],
    }));
  }

  function resolveRedirectTarget(loggedInUser: Awaited<ReturnType<typeof login>>) {
    return resolveAuthenticatedRoute(loggedInUser, searchParams.get("redirect"));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!desktopCanSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const loggedInUser = await login({
        username: username.trim(),
        password,
      });

      const targetRoute = resolveRedirectTarget(loggedInUser);

      if (whiteOverlayRef.current) {
        playUniverseTransition(whiteOverlayRef.current, () => {
          router.push(targetRoute);
        });
      } else {
        router.push(targetRoute);
      }
    } catch (submitError) {
      setIsSubmitting(false);

      if (submitError instanceof ValidationError) {
        setFieldErrors(submitError.errors);
      }

      setToast({
        status: "error",
        message: DEFAULT_LOGIN_CONFIG.errorMessage,
      });
    }
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    isSubmitting,
    fieldErrors,
    hasUsername,
    hasPassword,
    usernameHasError,
    passwordHasError,
    desktopCanSubmit,
    clearFieldError,
    handleSubmit,
  };
}
