/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ListView, ListViewItem } from "./ListView";

const meta = { title: "Spectrum/ListView", component: ListView, parameters: { layout: "centered" } } satisfies Meta<typeof ListView>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { "aria-label": "Documents", items: [{id: "one", name: "Project brief"}, {id: "two", name: "Research notes"}], children: (item: {name: string}) => <ListViewItem textValue={item.name}>{item.name}</ListViewItem> } as any };
