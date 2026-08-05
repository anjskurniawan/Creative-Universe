"use client";

import { useState } from "react";
import { HeaderSection } from "../catalog/header-section";
import { InteractivePlayground } from "../components/interactive-playground";

type HeaderSectionPreviewProps = {
  breadcrumb: string[];
};

export function HeaderSectionPreview({
  breadcrumb,
}: HeaderSectionPreviewProps) {
  const [title, setTitle] = useState("Header Title");

  return (
    <InteractivePlayground
      componentName="HeaderSection"
      componentPath="apps/frontend/src/app/component/v1/catalog/header-section.tsx"
      breadcrumb={breadcrumb}
      controls={
        <label className="flex flex-col items-start gap-1.5 text-xs font-medium text-slate-600">
          Title text
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"
          />
        </label>
      }
      code={`import { HeaderSection } from "../catalog/header-section";\n\n<HeaderSection title="Header Title" />`}
    >
      <HeaderSection title={title} />
    </InteractivePlayground>
  );
}
