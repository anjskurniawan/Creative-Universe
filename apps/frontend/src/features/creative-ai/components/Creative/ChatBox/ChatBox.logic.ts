"use client";

import { useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import type { ChatBoxLogicProps } from "./ChatBox.types";

export function useChatBoxLogic({
  value,
  onChange,
  onSubmit,
  disabled = false,
}: ChatBoxLogicProps) {
  const [internalValue, setInternalValue] = useState("");

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    if (!isControlled) {
      setInternalValue(nextVal);
    }
    onChange?.(nextVal);
  };

  const handleSend = () => {
    const trimmed = currentValue.trim();
    if (!trimmed || disabled) return;

    onSubmit?.(trimmed);
    if (!isControlled) {
      setInternalValue("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return {
    value: currentValue,
    handleChange,
    handleKeyDown,
    handleSubmit,
    handleSend,
    canSubmit: currentValue.trim().length > 0 && !disabled,
  };
}
