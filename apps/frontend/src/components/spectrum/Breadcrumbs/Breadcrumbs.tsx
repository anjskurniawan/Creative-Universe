"use client";

import { forwardRef, type ComponentRef } from "react";
import { Breadcrumbs as SpectrumBreadcrumbs, Breadcrumb, type BreadcrumbsProps, type BreadcrumbProps } from "@react-spectrum/s2/Breadcrumbs";

export type { BreadcrumbsProps };
export { Breadcrumb };
export type { BreadcrumbProps };

export const Breadcrumbs = forwardRef<ComponentRef<typeof SpectrumBreadcrumbs>, BreadcrumbsProps<object>>(function Breadcrumbs(props, ref) {
  return <div className="spectrum-component"><SpectrumBreadcrumbs {...props} ref={ref} /></div>;
});

Breadcrumbs.displayName = "Breadcrumbs";
