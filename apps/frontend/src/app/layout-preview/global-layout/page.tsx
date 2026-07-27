"use client";

import React, { useState, useEffect } from "react";
import Layout from "../components/layouts/sub-app/container";
import profileCardMenu from "./profile-card-menu";

export default function GlobalLayoutPage() {
  const mockApplications = [
    {
      key: "kv_retail",
      display_name: "KV Retail",
      href: "/kv-retail",
      icon: "store",
    },
    {
      key: "odds",
      display_name: "Odds Task",
      href: "/odds",
      icon: "analytics",
    },
    {
      key: "creative_report",
      display_name: "Creative Report",
      href: "/creative-report",
      icon: "description",
    },
    {
      key: "creative_ai",
      display_name: "Creative AI",
      href: "/creative-ai",
      icon: "psychology",
    },
  ];

  const mockUserProfile = {
    name: "Alex Kurniadi",
    role: "Project Owner",
    initials: "AK",
  };

  const mockMessages = [
    {
      id: "1",
      sender: "Budi Santoso",
      preview: "Halo Alex, proyek Creative Universe sudah sampai mana ya?",
      time: "2 menit lalu",
      unread: true,
    },
    {
      id: "2",
      sender: "Siti Rahma",
      preview: "Desain navbar-nya sangat rapi, bagus sekali!",
      time: "10 menit lalu",
      unread: false,
    },
    {
      id: "3",
      sender: "Hendra Wijaya",
      preview: "Ikon aplikasi sudah saya sinkronkan dengan Figma.",
      time: "1 jam lalu",
      unread: true,
    },
    {
      id: "4",
      sender: "Dewi Lestari",
      preview: "Jangan lupa untuk melakukan commit jika sudah selesai.",
      time: "4 jam lalu",
      unread: false,
    },
    {
      id: "5",
      sender: "Rian Pratama",
      preview: "Sudut ScreenContent diatur 16px ya, sesuai instruksi.",
      time: "1 hari lalu",
      unread: true,
    },
  ];

  const mockNotifications = [
    {
      id: "1",
      title: "Tugas Baru Ditugaskan",
      content: "Alex menambahkan Anda ke tugas 'Implementasi Layout Mobile'.",
      time: "5 menit lalu",
      read: false,
      icon: "assignment",
    },
    {
      id: "2",
      title: "Revisi Disetujui",
      content: "Perubahan sudut rounded ScreenContent telah disetujui.",
      time: "20 menit lalu",
      read: false,
      icon: "check_circle",
    },
    {
      id: "3",
      title: "Sistem Terupdate",
      content: "Node mcp-server berhasil diperbarui ke versi stabil terbaru.",
      time: "2 jam lalu",
      read: true,
      icon: "system_update",
    },
    {
      id: "4",
      title: "Peringatan Deployment",
      content:
        "Ada kegagalan minor pada sync-documentation script di prebuild.",
      time: "1 hari lalu",
      read: true,
      icon: "warning",
    },
    {
      id: "5",
      title: "Komentar Baru",
      content:
        "Codex meninggalkan komentar baru pada repositori Creative Universe.",
      time: "2 hari lalu",
      read: true,
      icon: "comment",
    },
  ];

  const [viewport, setViewport] = useState<"Mobile" | "Desktop">("Mobile");

  useEffect(() => {
    const handleResize = () => {
      // 1024px (lg breakpoint) is used to switch to Desktop view
      if (window.innerWidth >= 1024) {
        setViewport("Desktop");
      } else {
        setViewport("Mobile");
      }
    };

    handleResize(); // Evaluate initially on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[radial-gradient(circle_at_8%_6%,#00e7ef_0,transparent_25%),radial-gradient(circle_at_95%_90%,#00a4ff_0,transparent_31%),linear-gradient(135deg,#00a4ff_0%,#000675_44%,#04044a_100%)] text-slate-900 font-sans antialiased">
      <Layout
        viewport={viewport}
        contentProps={{
          navbarProps: {
            initials: "AK",
            onTerminalClick: () => alert("Terminal Clicked"),
            applications: mockApplications,
            userProfile: mockUserProfile,
            messages: mockMessages,
            notifications: mockNotifications,
          },
          contentProps: {
            heading: "",
            subheading: "",
          },
          menuItems: [profileCardMenu],
        }}
      />
    </div>
  );
}
