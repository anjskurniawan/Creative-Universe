"use client";

import React from "react";
import { ContentTitle } from "@/components/ui/content-title";
import { PreviewWrapper } from "../preview-wrapper";

export function ContentTitlePreview() {
  return (
    <PreviewWrapper width="full">
      <ContentTitle title="Judul Konten" subtitle="Deskripsi singkat halaman." />
    </PreviewWrapper>
  );
}
