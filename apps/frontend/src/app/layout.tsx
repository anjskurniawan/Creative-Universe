import type { Metadata } from "next";
import { AuthProvider } from "@/providers/auth-provider";
import { RouteGuard } from "@/components/route-guard";
import "./globals.css";

/* eslint-disable @next/next/no-page-custom-font -- App Router root layout owns this global icon font. */

export const metadata: Metadata = {
  title: "Creative Universe - Portal Generator Pricetag & Admin",
  description: "Aplikasi internal PT Doran Sukses Indonesia (JETE) untuk manajemen pricetag dan administrasi sistem.",
  icons: {
    icon: [
      { url: "/favicons/favicon.ico" },
      { url: "/favicons/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicons/favicon.svg", type: "image/svg+xml" }
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
    <html lang="id" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body>
        <AuthProvider>
          <RouteGuard>
            {children}
          </RouteGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
