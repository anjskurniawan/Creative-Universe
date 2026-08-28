"use client";

import React from "react";
import { Logo } from "@/components/ui/Logo/Logo";
import { Input } from "@/components/ui/form/Input/Input";
import { Button } from "@/components/ui/Button/Button";

export interface StepFullNameProps {
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
}

export function StepFullName({ value, onChange, onNext }: StepFullNameProps) {
  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-col gap-4 items-start w-full mb-8">
        <div className="flex items-start pb-1 pt-[3px] px-[5px] size-[40px]">
          <Logo size={35} />
        </div>
        <h2 className="font-sans font-semibold text-cu-dark text-[32px] leading-tight">
          Lengkapi identitasmu
        </h2>
      </div>
      <div className="flex flex-col gap-8 w-full">
        <Input
          id="fullname"
          label="Nama Lengkap"
          type="text"
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Masukkan nama lengkap"
        />
        <Button
          onClick={onNext}
          disabled={!value}
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
}
