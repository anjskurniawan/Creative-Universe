"use client";

import { Button } from "@react-spectrum/s2/Button";
import { Card, CardPreview, Content, Footer, Text } from "@react-spectrum/s2/Card";
import { StatusLight } from "@react-spectrum/s2/StatusLight";

export type RouteCardProps = {
  title: string;
  description: string;
  previewLabel: string;
  href: string;
  status?: string;
};

const previewClassName = "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-700";

export function RouteCard({ title, description, previewLabel, href, status = "Published" }: RouteCardProps) {
  return (
    <Card variant="secondary" density="compact">
      <CardPreview>
        <div className={`h-24 w-full ${previewClassName}`} aria-label={previewLabel} />
      </CardPreview>
      <Content>
        <Text slot="title">{title}</Text>
        <Text slot="description">{description}</Text>
      </Content>
      <Footer>
        <div className="flex w-full flex-col gap-3">
          <StatusLight size="S" variant="positive">{status}</StatusLight>
          <div className="flex justify-end">
            <Button variant="primary" onPress={() => window.open(href, "_blank", "noopener,noreferrer")}>Open</Button>
          </div>
        </div>
      </Footer>
    </Card>
  );
}
