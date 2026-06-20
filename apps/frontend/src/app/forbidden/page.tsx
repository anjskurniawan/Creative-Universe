"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";

export default function ForbiddenPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at center, hsl(var(--accent)) 0%, hsl(var(--background)) 100%)",
        padding: "2rem 1rem",
      }}
    >
      <div
        className="card cu-glass animate-slide-up"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "3rem 2rem",
          textAlign: "center",
          boxShadow: "var(--shadow-xl)",
        }}
      >
        <MaterialIcon name="block" size="xl" weight={600} className="mb-4 text-cu-danger" />

        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem", color: "hsl(var(--foreground))" }}>
          Akses Ditolak (403)
        </h2>

        <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "2rem" }}>
          Maaf, Anda tidak memiliki izin atau otorisasi yang cukup untuk mengakses halaman ini. Hubungi administrator untuk informasi hak akses Anda.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <Link href="/dashboard" className="btn btn-primary" style={{ flex: 1 }}>
            <MaterialIcon name="dashboard" size="sm" />
            Ke Dashboard
          </Link>
          <Link href="/" className="btn btn-secondary" style={{ flex: 1 }}>
            <MaterialIcon name="home" size="sm" />
            Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
