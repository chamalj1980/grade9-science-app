import { useEffect, useState } from "react";
import { useReportProgress } from "../progress";
import { richText } from "../richText";
import type { MarkDoneBlock } from "../schema";

// The finisher that completes a lesson section. Reports `complete` so the section flips
// to "completed" in progress once the student clicks it.
export function MarkDone({ block, blockId }: { block: MarkDoneBlock; blockId: string }) {
  const report = useReportProgress();
  const [done, setDone] = useState(false);

  useEffect(() => {
    report(blockId, { complete: done, required: true });
  }, [report, blockId, done]);

  // The enclosing group supplies the `lesson-finish` wrapper (see evolution.ts).
  return (
    <>
      {block.prompt && <p>{richText(block.prompt)}</p>}
      <button
        type="button"
        className="drill-check"
        onClick={() => setDone(true)}
        disabled={done}
      >
        {done ? block.doneLabel ?? "Complete ✅" : block.label ?? "Mark as done"}
      </button>
    </>
  );
}
