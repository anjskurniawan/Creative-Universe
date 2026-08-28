"use client";

import { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Provider } from "@react-spectrum/s2/Provider";
import { CreativeLayout } from "@/features/creative-ai/components/CreativeLayout/CreativeLayout";

declare module "@react-spectrum/s2/Provider" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}
export default function CreativeAiLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <Provider
      locale="id-ID"
      colorScheme="dark"
      router={{ navigate: router.push }}
      UNSAFE_className="contents"
    >
      <CreativeLayout>{children}</CreativeLayout>
    </Provider>
  );
}
