import { UniversalErrorView } from "@/components/feedback/universal-error-view";
import { ErrorTetrisGame } from "@/components/feedback/error-tetris-game";
const frame = "contents";
export function UniversalErrorViewPreview() { return <div className={frame}><UniversalErrorView embedded showHomeAction={false} /></div>; }
export function ErrorTetrisGamePreview() { return <div className={frame}><div className="w-full max-w-sm"><ErrorTetrisGame /></div></div>; }
