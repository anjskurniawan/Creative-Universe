import type { ReactNode } from "react";
import PricetagLayout from "@/features/generator-pricetag/components/PricetagLayout/PricetagLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return <PricetagLayout>{children}</PricetagLayout>;
}
