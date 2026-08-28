import { Button } from "@/features/odds/components/OddsTaskDetail/Button/Button";

type RevisionBriefProps = {
  editing: boolean;
  directSubmit?: boolean;
  onEdit: () => void;
  onSubmit: () => void;
};

export function RevisionBrief({ editing, directSubmit = false, onEdit, onSubmit }: RevisionBriefProps) {
  const submitMode = directSubmit || editing;
  return <Button label={directSubmit ? "Kirim Revisi" : submitMode ? "Kirim Brief" : "Revisi"} icon={submitMode ? "send" : "edit_note"} onClick={submitMode ? onSubmit : onEdit} variant="blue" />;
}
