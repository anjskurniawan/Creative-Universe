import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextArea } from "./TextArea";

const meta = { title: "Spectrum/TextArea", component: TextArea, args: { label: "Comment", placeholder: "Share your thoughts" } } satisfies Meta<typeof TextArea>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = {};
export const Required: Story = { args: { isRequired: true, description: "At least 10 characters." } };
