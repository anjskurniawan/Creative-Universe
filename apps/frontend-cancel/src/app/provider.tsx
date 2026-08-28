"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Provider } from "@react-spectrum/s2/Provider";
import { AuthProvider } from "@/providers/auth-provider";

declare module "@react-spectrum/s2/Provider" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function ClientProvider({
  lang,
  children,
}: {
  lang: string;
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <Provider
      elementType="html"
      locale={lang}
      colorScheme="light"
      router={{ navigate: router.push }}
    >
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
