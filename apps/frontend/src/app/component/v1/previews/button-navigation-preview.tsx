"use client";

import { useState } from "react";
import { ButtonNavigation } from "../catalog/button-navigation";
import { InteractivePlayground } from "../components/interactive-playground";
import { MaterialIcon } from "@/components/ui/material-icon";

type ButtonNavigationPreviewProps = {
  breadcrumb: string[];
};

export function ButtonNavigationPreview({
  breadcrumb,
}: ButtonNavigationPreviewProps) {
  const [childrenText, setChildrenText] = useState("Kembali");
  const [iconName, setIconName] = useState("arrow_back");

  return (
    <InteractivePlayground
      componentName="Button Navigation"
      componentPath="apps/frontend/src/app/component/v1/catalog/button-navigation.tsx"
      breadcrumb={breadcrumb}
      controls={
        <>
          <label className="flex flex-col items-start gap-1.5 text-xs font-medium text-slate-600">
            Label
            <input
              value={childrenText}
              onChange={(event) => setChildrenText(event.target.value)}
              className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"
            />
          </label>
          <label className="flex flex-col items-start gap-1.5 text-xs font-medium text-slate-600">
            Icon
            <select
              value={iconName}
              onChange={(event) => setIconName(event.target.value)}
              className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-blue-400"
            >
              <option value="arrow_back">Arrow back</option>
              <option value="chevron_left">Chevron left</option>
              <option value="close">Close</option>
              <option value="menu">Menu</option>
              <option value="">None</option>
            </select>
          </label>
        </>
      }
      code={`import { ButtonNavigation } from "../catalog/button-navigation";\n\n<ButtonNavigation icon={<MaterialIcon name="arrow_back" size="xs" />}>Kembali</ButtonNavigation>`}
    >
      <div className="flex justify-center">
        <ButtonNavigation
          icon={
            iconName ? <MaterialIcon name={iconName} size="xs" /> : undefined
          }
        >
          {childrenText}
        </ButtonNavigation>
      </div>
    </InteractivePlayground>
  );
}
