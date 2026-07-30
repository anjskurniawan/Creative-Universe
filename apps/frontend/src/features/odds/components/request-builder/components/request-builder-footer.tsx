import { MaterialIcon } from "@/components/material-icon";
import type { RequestBuilderTheme } from "../types";

export function RequestBuilderFooter({
  currentStep,
  canContinue,
  loading,
  initializing,
  uploadingAttachments,
  savingDraft,
  canSaveDraft,
  onPrevious,
  onNext,
  onSaveDraft,
  theme,
}: {
  currentStep: number;
  canContinue: boolean;
  loading: boolean;
  initializing: boolean;
  uploadingAttachments: boolean;
  savingDraft: boolean;
  canSaveDraft: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  theme: RequestBuilderTheme;
}) {
  return (
    <footer className="mt-auto flex justify-between border-t border-black/5 pt-4 dark:border-white/5">
      <div className="flex items-center gap-2">
        {currentStep > 1 ? (
          <button type="button" onClick={onPrevious} className={theme.secondaryButtonClass}>
            <MaterialIcon name="chevron_left" size="auto" className="text-lg" />
            <span>Sebelumnya</span>
          </button>
        ) : (
          <div />
        )}

        {canSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={savingDraft}
            className={theme.secondaryButtonClass}
          >
            <MaterialIcon name="draft" size="auto" className="text-lg" />
            <span>{savingDraft ? "Menyimpan..." : "Simpan Draft"}</span>
          </button>
        )}
      </div>

      {currentStep < 5 ? (
        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className={theme.primaryButtonClass}
        >
          <span>Lanjutkan</span>
          <MaterialIcon name="chevron_right" size="auto" className="text-lg" />
        </button>
      ) : (
        <button
          type="submit"
          disabled={loading || initializing || uploadingAttachments}
          className={theme.primaryButtonClass}
        >
          <MaterialIcon name="send" size="auto" className="text-lg" />
          <span>{loading ? "Mengirim..." : "Kirim Request"}</span>
        </button>
      )}
    </footer>
  );
}
