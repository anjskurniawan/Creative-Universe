import { Button } from "@/features/odds/components/OddsTaskDetail/Button/Button";

export function GroupButton({ onButtonA, onButtonB, primaryLabel = "Start Task", secondaryLabel = "Ask Leader", primaryIcon = "play_arrow", secondaryIcon = "chat_bubble", secondaryDisabled = true, primaryVariant = "default", secondaryVariant = "default" }: { onButtonA?: () => void; onButtonB?: () => void; primaryLabel?: string; secondaryLabel?: string; primaryIcon?: string; secondaryIcon?: string; secondaryDisabled?: boolean; primaryVariant?: "default" | "blue" | "red"; secondaryVariant?: "default" | "blue" | "red" }) {
  return <div className="grid grid-cols-2 gap-2"><Button label={primaryLabel} icon={primaryIcon} onClick={onButtonA} variant={primaryVariant} /><Button label={secondaryLabel} icon={secondaryIcon} onClick={onButtonB} disabled={secondaryDisabled} variant={secondaryVariant} /></div>;
}
