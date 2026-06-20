"use client";

import React from "react";

interface MaterialIconProps extends React.SVGProps<SVGSVGElement> {
  name?: string;
  size?: "auto" | "xs" | "sm" | "md" | "lg" | "xl";
  weight?: "normal" | "light";
}

export function MaterialIcon({
  name,
  size = "auto",
  weight,
  className = "",
  ...props
}: MaterialIconProps) {
  const sizeClasses = {
    auto: "cu-material-icon-auto",
    xs: "size-4",
    sm: "size-5",
    md: "size-6",
    lg: "size-8",
    xl: "size-10",
  };

  // Resolve icon name from class name if name prop is omitted (mimics legacy blade logic)
  let resolvedName = name || "";
  if (!resolvedName && className) {
    const iconClass = className.split(/\s+/).find((c) => c.startsWith("cu-icon-"));
    if (iconClass) {
      resolvedName = iconClass.substring(8).replace(/-/g, "_");
    }
  }

  // Clean the icon name and replace any dashes with underscores
  resolvedName = resolvedName.replace(/-/g, "_").replace(/[^a-z0-9_]/g, "") || "info";

  // Check if we should render the light variant
  const isLight =
    weight === "light" ||
    (weight === undefined && ["auto", "xs", "sm"].includes(size));
  const symbolSuffix = isLight ? "-light" : "";
  const weightClass = isLight ? "cu-material-icon-light" : "";

  // Map back underscores to dashes for css class mapping
  const resolvedIconClass = `cu-icon-${resolvedName.replace(/_/g, "-")}`;
  const generatedIconClass = className.includes("cu-icon-") ? "" : resolvedIconClass;

  const classes = `cu-material-icon inline-block shrink-0 ${generatedIconClass} ${
    sizeClasses[size] || sizeClasses.auto
  } ${weightClass} ${className}`.trim();

  // The ID in the sprite sheet has underscores, match the legacy format (e.g. #material-icon-person_add)
  const idSuffix = resolvedName.replace(/_/g, "_");

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 -960 960 960"
      className={classes}
      {...props}
    >
      <use
        href={`/images/icons/material-symbols.svg#material-icon-${idSuffix}${symbolSuffix}`}
        width="100%"
        height="100%"
      />
    </svg>
  );
}
