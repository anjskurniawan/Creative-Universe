/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TreeView, TreeViewItem } from "./TreeView";

const meta = { title: "Spectrum/TreeView", component: TreeView, parameters: { layout: "centered" } } satisfies Meta<typeof TreeView>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { "aria-label": "Files", items: [{id: "src", name: "src", children: [{id: "app", name: "app"}]}], children: (item: {name: string; children?: unknown[]}) => <TreeViewItem id={item.name} textValue={item.name}>{item.name}</TreeViewItem> } as any };
