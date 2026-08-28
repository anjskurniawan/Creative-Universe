"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Provider } from "@react-spectrum/s2/Provider";
import Container from "@/components/layout/Container/Container";

declare module "@react-spectrum/s2/Provider" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

export default function DeveloperPlaygroundLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <Provider locale="id-ID" colorScheme="light" background="base" router={{ navigate: router.push }}>
      <div className="h-screen w-screen overflow-hidden bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)]">
        <Container
          viewport="Desktop"
          menuTitle="Developer Playground"
          breadcrumbItems={["Developer", "Playground"]}
          contentProps={{
            className: "flex h-full w-full flex-col overflow-hidden rounded-none bg-[#f3fbff] text-cu-ink shadow-[0px_14px_42px_0px_rgba(44,42,39,0.16)] lg:rounded-[16px]",
            hideSidebar: true,
            contentProps: {
              className: "flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden",
            },
          }}
        >
          {children}
        </Container>
      </div>
    </Provider>
  );
}
