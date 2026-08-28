"use client";

import React, { useState } from "react";
import { Logo } from "@/components/ui/Logo/Logo";
import { Input } from "@/components/ui/form/Input/Input";
import { Button } from "@/components/ui/Button/Button";
import { DropdownMenu } from "@/components/ui/form/DropdownMenu/DropdownMenu";

export interface StepPositionProps {
  isCreativeDivision: boolean;
  availablePositions: { id: number; name: string }[];
  positionId: string;
  onSelectPositionId: (id: string) => void;
  positionName: string;
  onChangePositionName: (val: string) => void;
  onNext: () => void;
}

export function StepPosition({
  isCreativeDivision,
  availablePositions,
  positionId,
  onSelectPositionId,
  positionName,
  onChangePositionName,
  onNext,
}: StepPositionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionLabel = availablePositions.find((p) => p.id.toString() === positionId)?.name || "";

  const dropdownItems = availablePositions.map((pos) => ({
    value: pos.id.toString(),
    label: pos.name,
  }));

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-col gap-4 items-start w-full mb-8">
        <div className="flex items-start pb-1 pt-[3px] px-[5px] size-[40px]">
          <Logo size={35} />
        </div>
        <h2 className="font-sans font-semibold text-cu-dark text-[32px] leading-tight">
          Pilih jabatan kerja
        </h2>
      </div>
      <div className="flex flex-col gap-8 w-full relative">
        <div className="relative w-full z-20">
          {isCreativeDivision ? (
            <>
              <Input
                id="position"
                label="Jabatan"
                type="dropdown"
                placeholder="Pilih jabatan"
                value={positionLabel}
                onClick={() => setIsOpen(!isOpen)}
                active={isOpen}
              />
              <DropdownMenu
                isOpen={isOpen}
                items={dropdownItems}
                onSelect={(val) => {
                  onSelectPositionId(val);
                  setIsOpen(false);
                }}
                onClose={() => setIsOpen(false)}
              />
            </>
          ) : (
            <Input
              id="position"
              label="Jabatan"
              type="text"
              required
              value={positionName}
              onChange={(e) => onChangePositionName(e.target.value)}
              placeholder="Masukkan jabatan Anda"
            />
          )}
        </div>
        <Button
          onClick={onNext}
          disabled={isCreativeDivision ? !positionId : !positionName}
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
}
