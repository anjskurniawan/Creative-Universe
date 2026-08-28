import { UniversalErrorView } from "@/components/feedback/UniversalErrorView";
import { ErrorTetrisGame } from "@/components/feedback/ErrorTetrisGame";
const frame = "contents";
export function UniversalErrorViewPreview() { return <div className={frame}><UniversalErrorView embedded showHomeAction={false} /></div>; }
export function ErrorTetrisGamePreview() { return <div className={frame}><div className="w-full max-w-sm"><ErrorTetrisGame /></div></div>; }
