/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tag, TagGroup } from "./TagGroup";

const meta = { title: "Spectrum/TagGroup", component: TagGroup, parameters: { layout: "centered" } } satisfies Meta<typeof TagGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { label: "Topics", items: [{id: "design", name: "Design"}, {id: "research", name: "Research"}], children: (item: {name: string}) => <Tag>{item.name}</Tag> } as any };
