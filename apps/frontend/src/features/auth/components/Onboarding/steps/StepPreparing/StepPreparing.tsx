"use client";

import React from "react";

export function StepPreparing() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center text-center w-full">
      <h2 className="font-sans font-semibold text-cu-dark text-[32px] leading-tight w-full mb-6">
        Kami menyiapkan ruang kerjamu
      </h2>
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="w-3 h-3 bg-brand rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-3 h-3 bg-brand rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-3 h-3 bg-brand rounded-full animate-bounce"></span>
      </div>
    </div>
  );
}
