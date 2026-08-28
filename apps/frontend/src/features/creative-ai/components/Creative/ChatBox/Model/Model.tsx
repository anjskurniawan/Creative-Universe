"use client";

import React from "react";
import { Menu, MenuTrigger, MenuItem, Text, MenuSection } from "@react-spectrum/s2/Menu";
import { Button as AriaButton } from "react-aria-components";
import { IconSpectrum } from "@/components/spectrum/IconSpectrum";
import { DEFAULT_MODEL_CONFIG } from "./Model.config";
import type { ModelProps } from "./Model.types";

export type { ModelProps, ModelItem } from "./Model.types";

/**
 * Child Component: Tombol & Menu Popover Selector Model AI menggunakan Spectrum S2 Menu
 * Menggunakan direction="top" dan shouldFlip={false} pada MenuTrigger dengan z-index tinggi.
 */
export function Model({
  selectedModel = DEFAULT_MODEL_CONFIG.defaultModel,
  onSelectModel,
  models = DEFAULT_MODEL_CONFIG.models,
  disabled = false,
  className = "",
  "aria-label": ariaLabel = DEFAULT_MODEL_CONFIG.ariaLabel,
}: ModelProps) {
  // Ambil label yang sedang aktif
  const currentModelName =
    models.find((m) => m.id === selectedModel || m.name === selectedModel)?.name ??
    selectedModel;

  return (
    <MenuTrigger direction="top" align="end" shouldFlip={false}>
      <AriaButton
        isDisabled={disabled}
        aria-label={ariaLabel}
        className={`flex h-10 shrink-0 items-center gap-1 rounded-full bg-transparent px-3 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:cursor-not-allowed disabled:opacity-40 ${className}`.trim()}
      >
        <span className="truncate max-w-[130px]">{currentModelName}</span>
        <IconSpectrum name={DEFAULT_MODEL_CONFIG.iconName} />
      </AriaButton>
      <Menu
        aria-label="Daftar Model AI"
        UNSAFE_className="!z-[9999]"
        UNSAFE_style={{ zIndex: 9999 }}
        onAction={(key) => onSelectModel?.(String(key))}
      >
        <MenuSection>
          {models.map((model) => (
            <MenuItem key={model.id} id={model.id} textValue={model.name}>
              <Text slot="label">{model.name}</Text>
              {model.description && (
                <Text slot="description">{model.description}</Text>
              )}
            </MenuItem>
          ))}
        </MenuSection>
      </Menu>
    </MenuTrigger>
  );
}

export default Model;
