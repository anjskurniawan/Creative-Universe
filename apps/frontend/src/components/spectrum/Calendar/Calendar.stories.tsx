import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { parseDate } from "@internationalized/date";
import { useState } from "react";
import { Calendar, type DateValue } from "./Calendar";

const meta = {
  title: "Spectrum/Calendar",
  component: Calendar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Calendar React Spectrum S2 untuk memilih satu tanggal dengan dukungan controlled value, validasi tanggal, beberapa bulan, dan kalender internasional.",
      },
    },
  },
  args: {
    "aria-label": "Tanggal pilihan",
    defaultValue: parseDate("2025-02-03"),
  },
  argTypes: {
    visibleMonths: {
      control: { type: "number", min: 1, max: 3, step: 1 },
      description: "Jumlah bulan yang ditampilkan bersamaan.",
    },
    firstDayOfWeek: {
      control: "select",
      options: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
      description: "Hari pertama dalam satu minggu kalender.",
    },
    isDisabled: {
      control: "boolean",
      description: "Menonaktifkan seluruh interaksi Calendar.",
    },
    isReadOnly: {
      control: "boolean",
      description: "Mempertahankan nilai tanpa mengizinkan perubahan oleh pengguna.",
    },
    isInvalid: {
      control: "boolean",
      description: "Menandai nilai saat ini sebagai tidak valid menurut aturan aplikasi.",
    },
    pageBehavior: {
      control: "radio",
      options: ["visible", "single"],
      description: "Menentukan apakah navigasi bulan melompat per tampilan atau per satu bulan.",
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoMonths: Story = {
  args: {
    visibleMonths: 2,
  },
};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

function ControlledCalendarExample() {
  const [date, setDate] = useState<DateValue>(parseDate("2025-02-03"));

  return (
    <div>
      <Calendar aria-label="Tanggal pilihan" value={date} onChange={setDate} />
      <p>Selected date: {date.toString()}</p>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledCalendarExample />,
};
