import Link from "next/link";
import { MaterialIcon } from "@/components/material-icon";
import { RecommendationButton } from "./recommendation-button";

type Palette = { primary: string; secondary: string; accent: string; soft: string };

type StatusProps = {
  compact?: boolean;
  isDone: boolean;
  isOverdue: boolean;
  isReview: boolean;
  palette: Palette;
  status: string;
  statusDescription: string;
  feedbackHref?: string;
};

export function TaskCardStatusBlock({ compact = false, isDone, isOverdue, isReview, palette, status, statusDescription, feedbackHref }: StatusProps) {
  return (
    <div className={`flex min-w-0 items-center ${compact ? "gap-2" : "gap-3"}`}>
      <span className={`flex shrink-0 items-center justify-center ${compact ? "size-7" : "size-8"} rounded-full ${isDone ? "bg-emerald-50 text-emerald-600" : isOverdue ? "bg-rose-50 text-rose-500" : `${palette.soft} ${palette.accent}`}`}>
        <MaterialIcon name={isDone ? "task_alt" : isReview ? "hourglass_bottom" : "timer"} size="xs" />
      </span>
      <div className="min-w-0">
        <p className={`truncate text-[13px] font-semibold ${palette.primary}`}>{status}</p>
        <p className={`truncate text-[11px] ${palette.secondary}`}>{feedbackHref ? <Link href={feedbackHref} className="underline-offset-2 hover:underline">{statusDescription}</Link> : statusDescription}</p>
      </div>
    </div>
  );
}

type WideStatusProps = {
  isDone: boolean;
  isReview: boolean;
  status: string;
  statusDescription: string;
  feedbackHref?: string;
  highlightLabel?: string;
  highlightValue?: string;
  rating?: number;
  timerText: string;
  onRecommendation: () => void;
  recommendationDisabled?: boolean;
};

export function TaskCardWideStatusPanel({ isDone, isReview, status, statusDescription, feedbackHref, highlightLabel, highlightValue, rating, timerText, onRecommendation, recommendationDisabled = false }: WideStatusProps) {
  const showsRating = isDone || rating !== undefined;
  const ratingValue = rating ?? 0;

  return (
    <div className={`flex w-[205px] shrink-0 flex-col justify-center gap-3 px-4 py-4 text-white ${isDone ? "bg-[#17633d]" : "bg-[#0077bf]"}`}>
      {highlightLabel ? (
        <RecommendationButton label={highlightLabel} onClick={onRecommendation} disabled={recommendationDisabled} />
      ) : showsRating ? (
        <div className="flex h-[42px] items-center gap-1.5" aria-label={rating != null ? `Rating ${rating} dari 5` : "Belum ada rating"}>
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, index) => <MaterialIcon key={index} name="star" size="xs" className={index < Math.round(ratingValue) ? "text-amber-300" : "text-white/30"} />)}
          </span>
          {rating != null && <span className="text-xs font-semibold text-white/90">{rating}/5</span>}
        </div>
      ) : highlightValue ? (
        <span className="flex h-[42px] items-center font-mono text-[30px] font-bold leading-none tracking-tight">{highlightValue}</span>
      ) : (
        <span className="flex h-[42px] items-center font-mono text-[30px] font-bold leading-none tracking-tight">{timerText}</span>
      )}
      <div className="flex items-center gap-2 border-t border-white/30 pt-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20"><MaterialIcon name={isDone ? "task_alt" : isReview ? "hourglass_bottom" : "timer"} size="xs" /></span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold leading-tight">{status}</p>
          <p className="truncate text-[9px] leading-tight text-white/80">{feedbackHref ? <Link href={feedbackHref} className="underline-offset-2 hover:underline">{statusDescription}</Link> : statusDescription}</p>
        </div>
      </div>
    </div>
  );
}
