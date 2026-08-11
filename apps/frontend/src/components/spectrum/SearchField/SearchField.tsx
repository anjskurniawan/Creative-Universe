"use client";

import { forwardRef, type ComponentRef } from "react";
import { SearchField as SpectrumSearchField, type SearchFieldProps } from "@react-spectrum/s2/SearchField";

export type { SearchFieldProps };

export const SearchField = forwardRef<ComponentRef<typeof SpectrumSearchField>, SearchFieldProps>(function SearchField(props, ref) {
  return <div className="spectrum-component"><SpectrumSearchField {...props} ref={ref} /></div>;
});

SearchField.displayName = "SearchField";
