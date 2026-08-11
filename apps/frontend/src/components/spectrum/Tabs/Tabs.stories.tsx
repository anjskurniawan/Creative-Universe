/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

const meta = { title: "Spectrum/Tabs", component: Tabs, parameters: { layout: "centered" } } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { "aria-label": "Sections", children: <><TabList><Tab id="overview">Overview</Tab><Tab id="details">Details</Tab></TabList><TabPanel id="overview">Overview content</TabPanel><TabPanel id="details">Details content</TabPanel></> } as any };
