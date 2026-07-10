import { useEffect } from "react";
import type { Theme } from "../types";
import type { SectionViewProps } from "./section";

export interface RecapPoint {
  term: string;
  detail: string;
}

interface RecapViewProps extends SectionViewProps {
  theme: Theme;
  eyebrow: string;
  title: string;
  intro: string;
  points: RecapPoint[];
}

// A read-only summary card shared by both modules. Reaching the recap is the finish
// line for a module, so it marks itself complete as soon as it is shown.
export function RecapView({
  theme,
  eyebrow,
  title,
  intro,
  points,
  onProgress
}: RecapViewProps) {
  useEffect(() => {
    onProgress({ completed: true });
  }, [onProgress]);

  return (
    <article className={`recap-card ${theme}`}>
      <div className="recap-intro">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>

      <ul className="recap-list">
        {points.map((point) => (
          <li key={point.term}>
            <strong>{point.term}</strong>
            <span>{point.detail}</span>
          </li>
        ))}
      </ul>

      <p className="recap-done" role="status">
        ✅ Chapter finished — this recap is saved to your progress.
      </p>
    </article>
  );
}
