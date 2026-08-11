/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Menu, MenuItem } from "./Menu";

const meta = { title: "Spectrum/Menu", component: Menu, parameters: { layout: "centered" } } satisfies Meta<typeof Menu>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { "aria-label": "Actions", items: [{id: "edit", name: "Edit"}, {id: "delete", name: "Delete"}], children: (item: {id: string; name: string}) => <MenuItem id={item.id}>{item.name}</MenuItem> } as any };
