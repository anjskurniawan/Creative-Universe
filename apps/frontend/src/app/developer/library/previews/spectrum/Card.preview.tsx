"use client";

import { Card, CardPreview, Content, Image, Text } from "@/components/spectrum/Card";
import { PreviewWrapper } from "../preview-wrapper";

const previewImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360' viewBox='0 0 640 360'%3E%3Crect width='640' height='360' fill='%235d5ce2'/%3E%3Ccircle cx='480' cy='90' r='130' fill='%23a9e8ff' fill-opacity='.65'/%3E%3Cpath d='M0 285 170 145l125 95 95-75 250 195H0Z' fill='%23f5d76e'/%3E%3C/svg%3E";

export function SpectrumCardPreview() {
  return (
    <PreviewWrapper width="md">
      <Card textValue="Project Aurora">
        <CardPreview><Image alt="Abstract purple and yellow landscape" src={previewImage} /></CardPreview>
        <Content>
          <Text slot="title">Project Aurora</Text>
          <Text slot="description">A concise project overview for the design team.</Text>
        </Content>
      </Card>
    </PreviewWrapper>
  );
}
