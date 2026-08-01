import { MaterialIcon } from "@/components/ui/material-icon";
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
          <button type="button" onClick={onPrevious} aria-label="Sebelumnya" title="Sebelumnya" className={`${theme.secondaryButtonClass} h-[58px] w-[58px] px-0 sm:w-auto sm:px-6`}>
            <MaterialIcon name="chevron_left" size="auto" className="text-lg" />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>
        ) : (
          <div />
        )}
      </div>

      <div className="flex items-center gap-2">
        {canSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={savingDraft}
            aria-label={savingDraft ? "Menyimpan draft" : "Simpan draft"}
            title={savingDraft ? "Menyimpan draft" : "Simpan draft"}
            className={`${theme.secondaryButtonClass} h-[58px] w-[58px] px-0`}
          >
            <MaterialIcon name="draft" size="auto" className="text-lg" />
          </button>
        )}

        {currentStep < 5 ? (
          <button key="btn-next" type="button" disabled={!canContinue} onClick={onNext} aria-label="Lanjutkan" title="Lanjutkan" className={`${theme.primaryButtonClass} h-[58px] w-[58px] px-0 sm:w-auto sm:px-6`}>
            <span className="hidden sm:inline">Lanjutkan</span>
            <MaterialIcon name="chevron_right" size="auto" className="text-lg" />
          </button>
        ) : (
          <button key="btn-submit" type="submit" disabled={loading || initializing || uploadingAttachments} aria-label={loading ? "Mengirim" : "Kirim Request"} title={loading ? "Mengirim" : "Kirim Request"} className={`${theme.primaryButtonClass} h-[58px] w-[58px] px-0 sm:w-auto sm:px-6`}>
            <MaterialIcon name="send" size="auto" className="text-lg" />
            <span className="hidden sm:inline">{loading ? "Mengirim..." : "Kirim Request"}</span>
          </button>
        )}
      </div>
    </footer>
  );
}
