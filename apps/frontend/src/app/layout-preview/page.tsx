"use client";

import React from "react";
import Link from "next/link";

export default function LayoutPreviewIndexPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Layout Preview</h1>
          
        </div>

        <div className="pt-4">
          <Link
            href="/layout-preview/global-layout"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 hover:bg-indigo-500 transition-colors"
          >
            Global Layout
          </Link>
        </div>
       
      </div>
    </div>
  );
}
