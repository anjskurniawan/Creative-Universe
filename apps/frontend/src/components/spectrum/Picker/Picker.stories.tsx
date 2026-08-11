/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Picker, PickerItem } from "./Picker";

const meta = { title: "Spectrum/Picker", component: Picker, parameters: { layout: "centered" } } satisfies Meta<typeof Picker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { label: "Permission", items: [{id: "read", name: "Read"}, {id: "write", name: "Write"}], children: (item: {id: string; name: string}) => <PickerItem id={item.id}>{item.name}</PickerItem> } as any };
