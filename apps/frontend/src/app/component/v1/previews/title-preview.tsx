"use client";

import { useState } from "react";
import { InteractivePlayground } from "../components/interactive-playground";
import { Title } from "../catalog/title";

type TitlePreviewProps = {
  breadcrumb: string[];
};

export function TitlePreview({ breadcrumb }: TitlePreviewProps) {
  const [childrenText, setChildrenText] = useState("Header Title");

  return (
    <InteractivePlayground
      componentName="Title"
      componentPath="apps/frontend/src/app/component/v1/catalog/title.tsx"
      breadcrumb={breadcrumb}
      controls={
        <label className="flex flex-col items-start gap-1.5 text-xs font-medium text-slate-600">
          Title text
          <input
            value={childrenText}
            onChange={(event) => setChildrenText(event.target.value)}
            className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"
          />
        </label>
      }
      code={`import { Title } from "../catalog/title";\n\n<Title>Header Title</Title>`}
    >
      <Title>{childrenText}</Title>
    </InteractivePlayground>
  );
}
