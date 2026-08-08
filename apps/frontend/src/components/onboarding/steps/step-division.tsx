"use client";

import React, { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/form/input";
import { DropdownMenu } from "@/components/ui/form/dropdown-menu";
import { type OnboardingDivision } from "@/core/auth";

export interface StepDivisionProps {
  divisions: OnboardingDivision[];
  isLoadingData: boolean;
  divisionId: string;
  onSelectDivision: (id: string) => void;
  onNext: () => void;
}

export function StepDivision({
  divisions,
  isLoadingData,
  divisionId,
  onSelectDivision,
  onNext,
}: StepDivisionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const divisionLabel = divisions.find((d) => d.id.toString() === divisionId)?.name || "";

  const dropdownItems = divisions.map((div) => ({
    value: div.id.toString(),
    label: div.name,
  }));

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-col gap-4 items-start w-full mb-8">
        <div className="flex items-start pb-1 pt-[3px] px-[5px] size-[40px]">
          <Logo size={35} />
        </div>
        <h2 className="font-sans font-semibold text-cu-dark text-[32px] leading-tight">
          Pilih divisi kerja
        </h2>
      </div>
      <div className="flex flex-col gap-8 w-full relative">
        <div className="relative w-full z-20">
          <Input
            id="division"
            label="Divisi"
            type="dropdown"
            placeholder={isLoadingData ? "Memuat..." : "Pilih divisi"}
            value={divisionLabel}
            onClick={() => !isLoadingData && setIsOpen(!isOpen)}
            disabled={isLoadingData}
            active={isOpen}
          />
          <DropdownMenu
            isOpen={isOpen && !isLoadingData}
            items={dropdownItems}
            onSelect={(val) => {
              onSelectDivision(val);
              setIsOpen(false);
            }}
            onClose={() => setIsOpen(false)}
          />
        </div>
        <Button
          onClick={onNext}
          disabled={!divisionId || isLoadingData}
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
}
