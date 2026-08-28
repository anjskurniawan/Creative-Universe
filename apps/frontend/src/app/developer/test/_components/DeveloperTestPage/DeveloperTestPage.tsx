"use client";

import React, { useState } from "react";
import {
  Menu,
  MenuTrigger,
  MenuItem,
  MenuSection,
  SubmenuTrigger,
  Header,
  Heading,
  Text,
} from "@react-spectrum/s2/Menu";
import { ActionButton } from "@react-spectrum/s2/ActionButton";
import { Button } from "@react-spectrum/s2/Button";
import { TextField } from "@react-spectrum/s2/TextField";
import { Switch } from "@react-spectrum/s2/Switch";
import { StatusLight } from "@react-spectrum/s2/StatusLight";
import { Badge } from "@react-spectrum/s2/Badge";
import { ProgressBar } from "@react-spectrum/s2/ProgressBar";
import { Slider } from "@react-spectrum/s2/Slider";

import Image from "@react-spectrum/s2/icons/Image";
import Copy from "@react-spectrum/s2/icons/Copy";
import DeviceTablet from "@react-spectrum/s2/icons/DeviceTablet";
import DeviceDesktop from "@react-spectrum/s2/icons/DeviceDesktop";

export default function Home(props: any) {
  const [switchVal, setSwitchVal] = useState(true);
  const [sliderVal, setSliderVal] = useState(65);
  const [twCount, setTwCount] = useState(0);
  const [activeIconTab, setActiveIconTab] = useState("dashboard");

  return (
    <main className="min-h-screen font-sans bg-slate-950 text-slate-100 p-6 md:p-10 flex flex-col items-center gap-10">
      {/* Header Info */}
      <header className="text-center max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <span className="material-symbols-rounded text-sm animate-spin text-blue-400">
            sync
          </span>
          Hybrid UI Architecture Showcase
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300 flex items-center justify-center gap-3">
          <span className="material-symbols-rounded text-4xl md:text-5xl text-blue-400">
            auto_awesome
          </span>
          Tailwind v4 + Spectrum + Material Icons
        </h1>
        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          Demo integrasi <strong>Google Material Symbols Rounded</strong>,
          keandalan aksesibilitas <strong>Adobe Spectrum S2</strong>, dan
          utilitas responsif <strong>Tailwind CSS v4</strong>.
        </p>
      </header>

      {/* Main Grid Showcase: 6 Cards (3 Columns on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        {/* Card 1: Spectrum Complex Menu & Navigation */}
        <section className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-xl backdrop-blur-sm">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <span className="material-symbols-rounded text-xs">widgets</span>
              1. Spectrum S2 Menu
            </span>
            <h2 className="text-xl font-bold text-slate-100">
              Rich Interactive Menu
            </h2>
            <p className="text-xs text-slate-400">
              Komponen menu kompleks Spectrum dengan submenu, header section,
              dan icon SVG.
            </p>
          </div>

          <div className="p-6 bg-slate-950/60 rounded-xl border border-slate-800/60 flex flex-col items-center gap-4">
            <MenuTrigger>
              <ActionButton>Buka Menu Publish</ActionButton>
              <Menu {...props}>
                <MenuSection>
                  <Header>
                    <Heading>Publish and export</Heading>
                    <Text slot="description">
                      Social media, format cetak & digital
                    </Text>
                  </Header>
                  <MenuItem
                    textValue="quick export"
                    onAction={() => alert("Quick export")}
                  >
                    <Image />
                    <Text slot="label">Quick Export</Text>
                    <Text slot="description">
                      Simpan format JPEG/PNG cepat.
                    </Text>
                  </MenuItem>
                  <SubmenuTrigger>
                    <MenuItem textValue="open a copy">
                      <Copy />
                      <Text slot="label">Open a copy</Text>
                      <Text slot="description">
                        Illustrator iPad atau Desktop
                      </Text>
                    </MenuItem>
                    <Menu>
                      <MenuSection>
                        <Header>
                          <Heading>Pilih Perangkat</Heading>
                        </Header>
                        <MenuItem
                          textValue="ipad"
                          onAction={() => alert("Buka di iPad")}
                        >
                          <DeviceTablet />
                          <Text slot="label">Illustrator for iPad</Text>
                        </MenuItem>
                        <MenuItem
                          textValue="desktop"
                          onAction={() => alert("Buka di Desktop")}
                        >
                          <DeviceDesktop />
                          <Text slot="label">Illustrator for Desktop</Text>
                        </MenuItem>
                      </MenuSection>
                    </Menu>
                  </SubmenuTrigger>
                </MenuSection>
                <MenuSection
                  selectionMode="multiple"
                  defaultSelectedKeys={["files"]}
                >
                  <MenuItem id="files">Show files</MenuItem>
                  <MenuItem id="folders">Show folders</MenuItem>
                </MenuSection>
              </Menu>
            </MenuTrigger>
            <span className="text-[11px] text-slate-500">
              Klik tombol di atas untuk membuka popover menu
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span>Status Menu</span>
            <StatusLight variant="positive">Active S2 Macro</StatusLight>
          </div>
        </section>

        {/* Card 2: Spectrum Form & Controls */}
        <section className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-xl backdrop-blur-sm">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <span className="material-symbols-rounded text-xs">tune</span>
              2. Spectrum S2 Controls
            </span>
            <h2 className="text-xl font-bold text-slate-100">
              Spectrum Form & Sliders
            </h2>
            <p className="text-xs text-slate-400">
              Elemen form, slider interaktif, dan switch toggle berbasis
              Spectrum S2.
            </p>
          </div>

          <div className="space-y-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800/60">
            <TextField
              label="Nama Project"
              defaultValue="Creative Workspace 2026"
            />

            <div className="flex items-center justify-between pt-1">
              <Switch isSelected={switchVal} onChange={setSwitchVal}>
                Sync Cloud Storage
              </Switch>
              <Badge variant={switchVal ? "positive" : "neutral"}>
                {switchVal ? "Auto-Sync" : "Paused"}
              </Badge>
            </div>

            <div className="pt-2">
              <Slider
                label="Kapasitas Alokasi"
                value={sliderVal}
                onChange={(v) => setSliderVal(v as number)}
                formatOptions={{ style: "percent" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-800/80 pt-3">
            <Button variant="secondary">Reset</Button>
            <Button variant="accent">Save Changes</Button>
          </div>
        </section>

        {/* Card 3: Google Material Symbols Showcase */}
        <section className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-xl backdrop-blur-sm">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <span className="material-symbols-rounded text-xs">category</span>
              3. Google Material Icons
            </span>
            <h2 className="text-xl font-bold text-slate-100">
              Material Symbols
            </h2>
            <p className="text-xs text-slate-400">
              Icon font dinamis dengan utility class Tailwind untuk ukuran,
              warna & animasi.
            </p>
          </div>

          <div className="space-y-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800/60">
            {/* Interactive Tab Bar using Material Icons */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800">
              {[
                { id: "dashboard", icon: "dashboard", label: "Home" },
                { id: "analytics", icon: "analytics", label: "Stats" },
                { id: "folder", icon: "folder_open", label: "Files" },
                { id: "settings", icon: "settings", label: "Config" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIconTab(item.id)}
                  className={`flex flex-col items-center justify-center py-2 rounded-lg text-[10px] font-medium transition-all ${
                    activeIconTab === item.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
                >
                  <span
                    className={`material-symbols-rounded text-lg ${activeIconTab === item.id ? "filled" : ""}`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Icon showcase chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 text-xs">
                <span className="material-symbols-rounded text-sm filled">
                  favorite
                </span>{" "}
                Like
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
                <span className="material-symbols-rounded text-sm">
                  verified
                </span>{" "}
                Verified
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs">
                <span className="material-symbols-rounded text-sm filled">
                  star
                </span>{" "}
                4.9
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs">
                <span className="material-symbols-rounded text-sm">
                  notifications_active
                </span>{" "}
                Alert
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span>Active Tab</span>
            <span className="text-amber-400 font-mono font-semibold uppercase">
              {activeIconTab}
            </span>
          </div>
        </section>

        {/* Card 4: Pure Tailwind Utility (TANPA .cu-style) */}
        <section className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-xl backdrop-blur-sm">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <span className="material-symbols-rounded text-xs">
                touch_app
              </span>
              4. Pure Tailwind Utility (Bebas Scope)
            </span>
            <h2 className="text-xl font-bold text-slate-100">
              Tailwind Micro-Interactions
            </h2>
            <p className="text-xs text-slate-400">
              Komponen custom dengan class utility murni tanpa pembungkus{" "}
              <code className="text-blue-300">.cu-style</code>.
            </p>
          </div>

          <div className="space-y-4 p-4 bg-slate-950/60 rounded-xl border border-slate-800/60">
            {/* Interactive Counter Card */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/30 rounded-xl">
              <div>
                <p className="text-xs text-blue-300 font-medium flex items-center gap-1">
                  <span className="material-symbols-rounded text-sm">
                    calculate
                  </span>
                  Counter Value
                </p>
                <p className="text-2xl font-black text-white font-mono">
                  {twCount}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setTwCount((c) => c - 1)}
                  className="h-8 w-8 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold flex items-center justify-center transition-all border border-slate-700"
                >
                  <span className="material-symbols-rounded text-sm">
                    remove
                  </span>
                </button>
                <button
                  onClick={() => setTwCount((c) => c + 1)}
                  className="h-8 w-8 rounded-lg bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold flex items-center justify-center transition-all shadow-md shadow-blue-500/20"
                >
                  <span className="material-symbols-rounded text-sm">add</span>
                </button>
              </div>
            </div>

            {/* Gradient Button */}
            <button
              onClick={() =>
                alert(`Tailwind button diklik dengan counter: ${twCount}`)
              }
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span className="material-symbols-rounded text-lg">send</span>
              Kirim Perubahan ({twCount})
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span>Container Scope</span>
            <span className="text-blue-400 font-mono text-xs">
              Tanpa .cu-style
            </span>
          </div>
        </section>

        {/* Card 5: Scoped Preflight Container (PAKAI .cu-style) */}
        <section className="cu-style bg-slate-900/70 border border-emerald-500/40 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 border-b border-l border-emerald-500/30 text-[10px] font-mono text-emerald-300 rounded-bl-lg">
            Scoped Preflight Active
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="material-symbols-rounded text-xs">
                code_blocks
              </span>
              5. Scoped Preflight (.cu-style)
            </span>
            <h2 className="text-xl font-bold text-slate-100">
              Native HTML Reset
            </h2>
            <p className="text-xs text-slate-400">
              Elemen native HTML (
              <code className="text-emerald-300">
                &lt;ul&gt;, &lt;input&gt;, &lt;button&gt;
              </code>
              ) di dalam container ini ter-reset ala Tailwind secara otomatis.
            </p>
          </div>

          <div className="space-y-3 p-4 bg-slate-950/60 rounded-xl border border-slate-800/60 text-left">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-rounded text-sm">
                checklist
              </span>
              Checklist Fitur Terisolasi:
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  Tag <code className="text-emerald-300">&lt;ul&gt;</code> tanpa
                  bullet & padding default browser
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>
                  Tag <code className="text-emerald-300">&lt;h1-h6&gt;</code>{" "}
                  margin default 0
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Box-sizing otomatis border-box</span>
              </li>
            </ul>

            {/* Native HTML Input reset */}
            <input
              type="text"
              placeholder="Native <input> di dalam .cu-style..."
              className="w-full mt-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />

            {/* Native HTML Buttons inside .cu-style */}
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => alert("Native HTML Button dalam .cu-style!")}
                className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-1 transition-colors"
              >
                <span className="material-symbols-rounded text-sm">check</span>
                Scoped Button
              </button>
              <button
                onClick={() => alert("Secondary Button!")}
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-xs border border-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span>Selector</span>
            <span className="text-emerald-400 font-mono text-xs">
              :where(.cu-style)
            </span>
          </div>
        </section>

        {/* Card 6: Real-time Analytics & Hybrid Layout */}
        <section className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-xl backdrop-blur-sm">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <span className="material-symbols-rounded text-xs">
                monitoring
              </span>
              6. Hybrid Integration
            </span>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Live Metric Dashboard
            </h2>
            <p className="text-xs text-slate-400">
              Menggabungkan Spectrum ProgressBar, StatusLight, dan Google
              Material Icons.
            </p>
          </div>

          <div className="space-y-3">
            {/* Metric 1 */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-rounded text-sm text-cyan-400">
                    memory
                  </span>
                  Server CPU
                </span>
                <span className="text-cyan-400 font-mono font-bold">42%</span>
              </div>
              <ProgressBar label="CPU Load" value={42} />
            </div>

            {/* Metric 2 */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-rounded text-sm text-indigo-400">
                    storage
                  </span>
                  Memory
                </span>
                <span className="text-indigo-400 font-mono font-bold">
                  {sliderVal}%
                </span>
              </div>
              <ProgressBar label="RAM Load" value={sliderVal} />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="material-symbols-rounded text-sm">
                check_circle
              </span>
              All Running
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Next 16 • React 19
            </span>
          </div>
        </section>
      </div>
    </main>
  );
}
