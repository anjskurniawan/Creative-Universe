import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global Layout - Creative Universe",
  description: "Design preview sandbox for the Creative Universe global layout system",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
