import { RouterProvider } from "react-aria-components";
import React, { ReactNode, useState } from "react";

export function RoutedSideNav(props: {
  children: ({ selectedRoute }: { selectedRoute: string }) => ReactNode;
  defaultSelectedRoute: string;
}) {
  const { children } = props;
  const [selectedRoute, setSelectedRoute] = useState<string>(props.defaultSelectedRoute);

  const updateSelection = (href: string) => {
    setSelectedRoute(href);
  };

  return <RouterProvider navigate={updateSelection}>{children({ selectedRoute })}</RouterProvider>;
}
