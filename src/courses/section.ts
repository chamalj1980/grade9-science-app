import type { SectionProgressUpdate } from "../utils/progress";

// Every lesson / exercise / recap view receives the same callback so it can push
// progress (score, streak, completion) up to App, which persists it to localStorage.
export interface SectionViewProps {
  onProgress: (update: SectionProgressUpdate) => void;
}
