"use client";

import { useState } from "react";
import { SearchBar } from "@/components/ui/search-bar";
import { PreviewWrapper } from "../preview-wrapper";

export function SearchBarPreview() {
  const [value, setValue] = useState("");
  return <PreviewWrapper width="md"><SearchBar value={value} onChange={setValue} onClear={() => setValue("")} placeholder="Cari nama creative..." /></PreviewWrapper>;
}
