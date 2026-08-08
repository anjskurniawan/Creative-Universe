"use client";

import React from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form/input";

export interface StepWhatsappProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function StepWhatsapp({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: StepWhatsappProps) {
  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-col gap-4 items-start w-full mb-8">
        <div className="flex items-start pb-1 pt-[3px] px-[5px] size-[40px]">
          <Logo size={35} />
        </div>
        <h2 className="font-sans font-semibold text-cu-dark text-[32px] leading-tight">
          Nomor WhatsApp
        </h2>
      </div>
      <div className="flex flex-col gap-8 w-full">
        <Input
          id="wa-number"
          label="Nomor WhatsApp"
          type="phone"
          required
          disabled={isSubmitting}
          value={value}
          onChange={(e) =>
            onChange(e.target.value.replace(/[^0-9-]/g, "").replace(/^0+/, ""))
          }
          placeholder="812-xxxx-xxxx"
        />
        <Button
          onClick={onSubmit}
          disabled={!value || isSubmitting}
          loading={isSubmitting}
        >
          Selesai
        </Button>
      </div>
    </div>
  );
}
