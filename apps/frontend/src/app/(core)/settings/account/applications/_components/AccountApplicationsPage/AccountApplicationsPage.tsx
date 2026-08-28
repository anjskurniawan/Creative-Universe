"use client";

import { useAuth } from "@/hooks/auth";
import {
  ProductCard,
  CardPreview,
  Image,
  Content,
  Text,
  Footer,
} from "@react-spectrum/s2/Card";
import { Button } from "@react-spectrum/s2/Button";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
const logo = "/images/landing/logo-navbar.svg";
const preview = "https://react-spectrum.adobe.com/preview.c3b340d3.png";

const APP_DESCRIPTIONS: Record<string, string> = {
  odds: "Sistem arsitektur perhitungan odds dan kalkulasi probabilitas terintegrasi.",
  "kv-retail":
    "Panel penjualan retail, manajemen inventaris, dan transaksi kasir harian.",
  cai: "Asisten kecerdasan buatan (AI) interaktif untuk otomatisasi tugas dan obrolan cerdas.",
  "creative-report":
    "Sistem pelaporan analisis bisnis komprehensif dan monitoring performa kerja.",
  generator:
    "Generator otomatis dokumen, desain aset cepat, dan automasi berkas.",
  "design-assets":
    "Galeri perpustakaan aset desain, palet warna, dan elemen antarmuka Creative.",
  core: "Portal utama administrasi dan pengaturan akun Creative Universe.",
};

export default function AccountApplicationsPage() {
  const { user } = useAuth();
  const applications =
    user?.applications
      .filter((application) => application.type === "sub_app")
      .sort((left, right) => left.sort_order - right.sort_order) ?? [];

  return (
    <div className="w-full space-y-4">
      <div className="grid gap-4 grid-cols-3">
        {applications.map((application) => (
          <ProductCard
            key={application.key}
            id={application.key}
            href={application.frontend_path ?? undefined}
            size="L"
            styles={style({ width: "full" })}
          >
            <CardPreview>
              <Image slot="preview" src={preview} alt="Preview" />
            </CardPreview>
            <Image slot="thumbnail" src={logo} alt="Logo" />
            <Content>
              <Text slot="title">{application.display_name}</Text>
              <Text slot="description">
                {APP_DESCRIPTIONS[application.key] ??
                  "Aplikasi sub-sistem Creative Universe."}
              </Text>
            </Content>
            {application.frontend_path && (
              <Footer>
                <Button variant="primary">Open</Button>
              </Footer>
            )}
          </ProductCard>
        ))}
        {applications.length === 0 && (
          <p className="text-sm text-cu-muted">
            Belum ada aplikasi yang dapat diakses.
          </p>
        )}
      </div>
    </div>
  );
}
