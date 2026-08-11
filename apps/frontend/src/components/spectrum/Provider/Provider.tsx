"use client";

import { type ProviderProps } from "@react-spectrum/s2/Provider";

export type { ProviderProps };

import { Provider as SpectrumProvider } from "@react-spectrum/s2/Provider";
export function Provider(props: ProviderProps) {
  return <div className="spectrum-component"><SpectrumProvider {...props} /></div>;
}

Provider.displayName = "Provider";
