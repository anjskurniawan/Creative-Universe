/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Breadcrumb, Breadcrumbs } from "./Breadcrumbs";

const meta = { title: "Spectrum/Breadcrumbs", component: Breadcrumbs, parameters: { layout: "centered" } } satisfies Meta<typeof Breadcrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { items: [{id: "home", name: "Home"}, {id: "projects", name: "Projects"}], "aria-label": "Breadcrumbs", children: (item: {name: string}) => <Breadcrumb>{item.name}</Breadcrumb> } as any };
