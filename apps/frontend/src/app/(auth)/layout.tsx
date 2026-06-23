"use client";

import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cu-surface font-sans text-cu-ink antialiased px-4 py-8">
      {/* Logo */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cu-focus"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/icon-app/Logo_White.png"
            alt="Creative Universe"
            className="h-10 brightness-0"
          />
        </Link>
      </div>

      {/* Card Content */}
      <div className="w-full overflow-hidden rounded-lg border border-cu-line bg-cu-panel shadow-sm sm:max-w-md">
        <div className="p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
