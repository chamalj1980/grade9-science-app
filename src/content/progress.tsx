import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";
import type { SectionProgressUpdate } from "../utils/progress";

// What one assessment block reports about itself. `required` blocks must all be complete
// for the section to count as completed; score/total/streak are summed across blocks.
export interface BlockProgress {
  score?: number;
  total?: number;
  streak?: number;
  complete?: boolean;
  required?: boolean;
}

type Reporter = (id: string, progress: BlockProgress) => void;

const ProgressContext = createContext<Reporter>(() => {});

export const ProgressProvider = ProgressContext.Provider;

// Assessment blocks call this to push their state up to the section aggregator.
export function useReportProgress(): Reporter {
  return useContext(ProgressContext);
}

// Aggregates every assessment block in a section into ONE SectionProgressUpdate:
// score/total/streak are summed; the section is completed only when all blocks that
// mark themselves `required` are complete. This mirrors the old per-section contract,
// so App's upward-only score merge and localStorage persistence keep working unchanged.
export function useSectionProgress(
  onProgress: (update: SectionProgressUpdate) => void
): Reporter {
  const [blocks, setBlocks] = useState<Record<string, BlockProgress>>({});

  const report = useCallback<Reporter>((id, progress) => {
    setBlocks((current) => {
      const previous = current[id];
      if (
        previous &&
        previous.score === progress.score &&
        previous.total === progress.total &&
        previous.streak === progress.streak &&
        previous.complete === progress.complete &&
        previous.required === progress.required
      ) {
        return current; // no change — avoid a needless re-render/report
      }
      return { ...current, [id]: progress };
    });
  }, []);

  useEffect(() => {
    const entries = Object.values(blocks);
    if (entries.length === 0) {
      return; // nothing has reported yet — don't fire a spurious 0/0 update
    }
    const sum = (key: "score" | "total" | "streak") =>
      entries.reduce((total, entry) => total + (entry[key] ?? 0), 0);
    const required = entries.filter((entry) => entry.required);
    const completed = required.length > 0 && required.every((entry) => entry.complete);
    onProgress({
      score: sum("score"),
      total: sum("total"),
      streak: sum("streak"),
      completed
    });
  }, [blocks, onProgress]);

  return report;
}
