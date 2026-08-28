"use client";

import { RouteCard } from "./RouteCard/RouteCard";
import { Tab, TabList, TabPanel, Tabs } from "@react-spectrum/s2/Tabs";
import { BetaContent } from "./BetaContent/BetaContent";

export default function DeveloperBetaPage() {
  return (
    <div className="w-full px-6 bg-white h-screen">
      <Tabs aria-label="Developer beta routes">
        <TabList aria-label="Developer beta routes">
          <Tab id="landing">Landing</Tab>
        </TabList>
        <TabPanel id="landing">
          <BetaContent>
            <RouteCard
              title="Guest"
              description="Guest landing state."
              previewLabel="Guest preview"
              href="/developer/beta/landing/guest"
            />
            <RouteCard
              title="Login"
              description="Authenticated landing state."
              previewLabel="Login preview"
              href="/developer/beta/landing/login"
            />
          </BetaContent>
        </TabPanel>
      </Tabs>
    </div>
  );
}
