"use client";

import { useState } from "react";
import { CatalogSidebar } from "./components/catalog-sidebar";
import { PlaygroundArea } from "./components/playground-area";

export default function ComponentV1Page() {
  const [activeItem, setActiveItem] = useState("");

  return (
    <div className="flex h-screen min-h-0 w-screen overflow-hidden bg-[#f3fbff] p-4">
      <CatalogSidebar activeItem={activeItem} onSelect={setActiveItem} />
      <PlaygroundArea activeItem={activeItem} />
    </div>
  );
}
