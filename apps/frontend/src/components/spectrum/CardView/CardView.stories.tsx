/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardView } from "./CardView";
import { AssetCard, CardPreview, Content, Image, Text } from "../Card";

const meta = { title: "Spectrum/CardView", component: CardView, parameters: { layout: "centered" } } satisfies Meta<typeof CardView>;
export default meta;
type Story = StoryObj<typeof meta>;
const image = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='160'%3E%3Crect width='240' height='160' fill='%235d5ce2'/%3E%3C/svg%3E";
export const Basic: Story = { args: { "aria-label": "Nature photos", items: [{ id: "one", title: "Project Aurora" }, { id: "two", title: "Project Nebula" }], children: (item: {title: string}) => <AssetCard><CardPreview><Image alt={item.title} src={image} /></CardPreview><Content><Text slot="title">{item.title}</Text><Text slot="description">Design project</Text></Content></AssetCard> } as any };
