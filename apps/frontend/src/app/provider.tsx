"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Provider } from "@react-spectrum/s2/Provider";

// Configure the type of the `routerOptions` prop on all React Spectrum components.
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
  lang?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  return (
    <Provider
        elementType="div"
        locale={lang}
        colorScheme="light"
        router={{ navigate: router.push }}
      >
        {children}
    </Provider>
  );
}
