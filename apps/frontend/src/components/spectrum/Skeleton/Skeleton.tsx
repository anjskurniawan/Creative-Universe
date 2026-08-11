"use client";

import { type SkeletonProps } from "@react-spectrum/s2/Skeleton";

export type { SkeletonProps };

import { Skeleton as SpectrumSkeleton } from "@react-spectrum/s2/Skeleton";
export function Skeleton(props: SkeletonProps) {
  return <div className="spectrum-component"><SpectrumSkeleton {...props} /></div>;
}

Skeleton.displayName = "Skeleton";
