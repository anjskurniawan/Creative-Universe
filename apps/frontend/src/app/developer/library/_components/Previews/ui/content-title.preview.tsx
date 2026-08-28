"use client";

import React from "react";
import { ContentTitle } from "@/components/ui/ContentTitle/ContentTitle";
import { PreviewWrapper } from "../PreviewWrapper/PreviewWrapper";

export function ContentTitlePreview() {
  return (
    <PreviewWrapper width="full">
      <ContentTitle title="Judul Konten" subtitle="Deskripsi singkat halaman." />
    </PreviewWrapper>
  );
}
