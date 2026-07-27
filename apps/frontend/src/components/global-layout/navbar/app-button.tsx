import { MaterialIcon } from "@/components/material-icon";
export default function AppButton({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) { return <button type="button" aria-label={label} onClick={onClick} className="flex size-9 items-center justify-center rounded-lg hover:bg-slate-100"><MaterialIcon name={icon} size="auto" className="text-xl" /></button>; }
