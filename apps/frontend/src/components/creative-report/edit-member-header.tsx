import React from "react";

export interface EditMemberHeaderProps {
  name: string;
}

export function EditMemberHeader({ name }: EditMemberHeaderProps) {
  return (
    <header className="flex min-h-[45px] items-center justify-between gap-6 pb-4">
      <div>
        <span className="hidden">
          ← Kembali ke Staff
        </span>
        <h1 className="text-4xl font-medium leading-none tracking-[-0.72px] text-[#24252b]">
          {name}
        </h1>
      </div>
    </header>
  );
}
