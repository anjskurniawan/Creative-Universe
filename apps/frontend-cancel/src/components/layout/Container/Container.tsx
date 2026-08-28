import type { ReactNode } from "react";
import Workspace from "../Workspace/Workspace";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="relative box-border flex h-screen min-h-screen w-screen flex-col overflow-hidden bg-sky p-0 lg:p-4">
      <Workspace>{children}</Workspace>
    </div>
  );
}
