"use client";

import { Button } from "@react-spectrum/s2/Button";
import { Picker, PickerItem } from "@react-spectrum/s2/Picker";
import { TextField } from "@react-spectrum/s2/TextField";

export default function DeveloperLayoutPage() {
  return (
    <div className="cu-style box-border flex h-auto min-h-full w-full flex-none flex-col gap-6 p-4 pb-6 sm:p-6 sm:pb-6">
      <section className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Layout QA
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Developer Layout Workspace
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Halaman ini digunakan untuk memeriksa jarak Container, Workspace, Sidebar,
          Navbar, dan Content pada berbagai ukuran viewport.
        </p>
      </section>

      <section className="grid w-full gap-4 md:grid-cols-3">
        {[
          ["Container", "Viewport penuh dengan spacing yang dikendalikan route."],
          ["Workspace", "Area utama dengan background dan batas visual."],
          ["Content", "Area scroll untuk konten halaman dan component."],
        ].map(([title, description]) => (
          <article
            key={title}
            className="flex min-h-32 flex-col justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4"
          >
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            <p className="text-sm leading-5 text-slate-600">{description}</p>
          </article>
        ))}
      </section>

      <section className="flex min-h-64 w-full items-center justify-center rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 p-6 text-center">
        <div className="flex max-w-md flex-col gap-2">
          <h2 className="text-lg font-semibold text-sky-950">Content boundary</h2>
          <p className="text-sm leading-6 text-sky-800">
            Gunakan garis batas ini untuk memeriksa padding, overflow, dan tinggi
            Content terhadap Workspace.
          </p>
        </div>
      </section>

      <section className="flex w-full flex-col gap-5 border-t border-slate-200 pt-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Spectrum QA
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">
            Spectrum components outside the Universe scope
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Komponen ini sengaja berada di luar <code>.cu-style</code> untuk
            memeriksa apakah style Spectrum tetap berdiri sendiri.
          </p>
        </div>

        <div className="grid w-full gap-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-3">
          <TextField
            label="Project name"
            placeholder="Creative Universe"
            description="Spectrum TextField"
          />
          <Picker label="Environment" defaultSelectedKey="local">
            <PickerItem id="local">Local</PickerItem>
            <PickerItem id="staging">Staging</PickerItem>
            <PickerItem id="production">Production</PickerItem>
          </Picker>
          <div className="flex items-end">
            <Button variant="accent" onPress={() => undefined}>
              Spectrum action
            </Button>
          </div>
        </div>
      </section>

      <section className="cu-style grid w-full gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2 lg:grid-cols-4">
        {["8px", "16px", "24px", "32px"].map((spacing) => (
          <div key={spacing} className="flex flex-col gap-2 rounded-lg bg-slate-900 p-4 text-white">
            <span className="text-xs uppercase tracking-wider text-slate-400">Spacing marker</span>
            <strong className="text-2xl font-semibold">{spacing}</strong>
            <span className="text-xs text-slate-300">Universe scoped utility</span>
          </div>
        ))}
      </section>
    </div>
  );
}
