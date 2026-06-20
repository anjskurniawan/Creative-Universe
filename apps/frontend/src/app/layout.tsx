import type { Metadata } from "next";
import { AuthProvider } from "@/providers/auth-provider";
import { RouteGuard } from "@/components/route-guard";
import "./globals.css";

export const metadata: Metadata = {
  title: "Creative Universe - Portal Generator Pricetag & Admin",
  description: "Aplikasi internal PT Doran Sukses Indonesia (JETE) untuk manajemen pricetag dan administrasi sistem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-theme="light">
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
