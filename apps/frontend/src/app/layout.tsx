import type { Metadata } from "next";
import { AuthProvider } from "@/providers/auth-provider";
import { RouteGuard } from "@/components/layout/route-guard";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creative Universe",
  description:
    "Aplikasi internal PT Doran Sukses Indonesia (JETE) untuk manajemen pricetag dan administrasi sistem.",
  icons: {
    icon: [
      { url: "/favicons/favicon.ico" },
      { url: "/favicons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicons/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
  manifest: "/favicons/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <RouteGuard>{children}</RouteGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
