import type { Metadata } from "next";
import { headers } from "next/headers";
import { ClientProvider } from "./provider";
import { AuthProvider } from "@/providers/auth";
import { RouteGuard } from "@/app/_components/RouteGuard/RouteGuard";
import { CommunicationProvider } from "@/app/_components/CommunicationProvider/CommunicationProvider";
import "@react-spectrum/s2/page.css";
import "./global.css";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get the user's preferred language from the Accept-Language header.
  // You could also get this from a database, URL param, etc.
  let lang = "id-ID";
  try {
    const headerList = await headers();
    const acceptLanguage = headerList.get("accept-language");
    lang = acceptLanguage?.split(/[,;]/)[0] || "id-ID";
  } catch {
    lang = "id-ID";
  }

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body suppressHydrationWarning>
        <ClientProvider lang={lang}>
          <AuthProvider>
            <CommunicationProvider>
              <RouteGuard>{children}</RouteGuard>
            </CommunicationProvider>
          </AuthProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
