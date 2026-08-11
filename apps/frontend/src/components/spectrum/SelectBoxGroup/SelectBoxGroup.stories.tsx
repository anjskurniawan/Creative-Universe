/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SelectBox, SelectBoxGroup } from "./SelectBoxGroup";

const meta = { title: "Spectrum/SelectBoxGroup", component: SelectBoxGroup, parameters: { layout: "centered" } } satisfies Meta<typeof SelectBoxGroup>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { "aria-label": "Options", children: <><SelectBox id="one">One</SelectBox><SelectBox id="two">Two</SelectBox></> } as any };
