import { useEffect, useRef } from "react";

export function useDropdownDismiss(isOpen: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const handlePointer = (event: PointerEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) onClose(); };
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("pointerdown", handlePointer); document.removeEventListener("keydown", handleKey); };
  }, [isOpen, onClose]);
  return ref;
}
