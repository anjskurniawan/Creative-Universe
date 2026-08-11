/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Cell, Column, Row, TableBody, TableHeader, TableView } from "./TableView";

const meta = { title: "Spectrum/TableView", component: TableView, parameters: { layout: "centered" } } satisfies Meta<typeof TableView>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Basic: Story = { args: { "aria-label": "Projects", children: <><TableHeader><Column isRowHeader>Name</Column><Column>Status</Column></TableHeader><TableBody items={[{id: "one", name: "Aurora", status: "Active"}]}>{item => <Row><Cell>{item.name}</Cell><Cell>{item.status}</Cell></Row>}</TableBody></> } as any };
