import { useState } from "react";

export type TaskCardTitleTaskProps = {
  className?: string;
  title: string;
  editable?: boolean;
  onSave?: (title: string) => Promise<void> | void;
};

export default function TaskCardTitleTask({
  className = "",
  title,
  editable = false,
  onSave,
}: TaskCardTitleTaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title);
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    const nextTitle = value.trim();
    if (!nextTitle || nextTitle === title) {
      setValue(title);
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave?.(nextTitle);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setValue(title);
      alert("Gagal memperbarui judul task");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={["flex items-start p-2.5", className].filter(Boolean).join(" ")}>
      {isEditing ? (
        <input
          autoFocus
          value={value}
          disabled={isSaving}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => void save()}
          onKeyDown={(event) => {
            if (event.key === "Enter") void save();
            if (event.key === "Escape") { setValue(title); setIsEditing(false); }
          }}
          className="w-full rounded border border-[#8474f9] bg-white px-2 py-1 text-[24px] font-semibold leading-normal text-black outline-none"
          aria-label="Judul task"
        />
      ) : (
        <button
          type="button"
          onClick={() => editable && setIsEditing(true)}
          className={`line-clamp-2 whitespace-normal break-words text-left text-[24px] font-semibold leading-normal text-black ${editable ? "cursor-text hover:text-[#6858de]" : "cursor-default"}`}
          aria-label={editable ? "Edit judul task" : undefined}
        >
          {title}
        </button>
      )}
    </div>
  );
}
