"use client";

import { useState } from "react";
import { TabSection, type TabSectionTab } from "../catalog/tab-section";
import { InteractivePlayground } from "../components/interactive-playground";

type TabSectionPreviewProps = { breadcrumb: string[] };

export function TabSectionPreview({ breadcrumb }: TabSectionPreviewProps) {
  const [activeTab, setActiveTab] = useState<TabSectionTab>("brief");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <InteractivePlayground
      componentName="Tab Section"
      componentPath="apps/frontend/src/app/component/v1/catalog/tab-section.tsx"
      breadcrumb={breadcrumb}
      code={`import { TabSection } from "../catalog/tab-section";\n\n<TabSection activeTab="brief" />`}
    >
      <TabSection
        activeTab={activeTab}
        onChange={setActiveTab}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
        navClass="border-b border-slate-200 bg-white"
        tabButtonClass={(tab) =>
          activeTab === tab
            ? "border-blue-500 text-blue-600"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
        }
      />
    </InteractivePlayground>
  );
}
