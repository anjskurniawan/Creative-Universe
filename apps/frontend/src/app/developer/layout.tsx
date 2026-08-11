"use client";

import type { ReactNode } from "react";
import "@react-spectrum/s2/page.css";
import { Provider } from "@react-spectrum/s2/Provider";

export default function DeveloperLayout({ children }: { children: ReactNode }) {
  return (
    <Provider locale="id-ID" colorScheme="light" background="base">
      {children}
    </Provider>
  );
}
