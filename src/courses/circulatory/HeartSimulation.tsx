import { useState } from "react";
import type { SectionViewProps } from "../section";

// The 3D heart is a self-contained Three.js app (its own full-page layout, CDN scripts
// and global CSS). We embed it in an iframe so its styles and scripts stay isolated from
// the React app. The file lives in public/ and is served at ./heart-simulation.html.
const simulationSrc = "./heart-simulation.html";

export function HeartSimulation({ onProgress }: SectionViewProps) {
  const [explored, setExplored] = useState(false);

  function markExplored() {
    setExplored(true);
    onProgress({ completed: true });
  }

  return (
    <article className="lesson">
      <header className="lesson-hero circulatory">
        <p className="eyebrow">Explore in 3D</p>
        <h2>3D Heart Simulation</h2>
        <p>
          Drag to rotate the heart, zoom in and out, and press play to watch it beat.
          Switch to the "Chambers" view to see inside, or click a glowing marker to
          learn what each part does.
        </p>
      </header>

      <section className="lesson-block" aria-labelledby="sim-title">
        <div className="sort-header">
          <h3 id="sim-title">Interactive model</h3>
          <a
            className="drill-hint sim-open"
            href={simulationSrc}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open full screen ↗
          </a>
        </div>

        <div className="sim-frame">
          <iframe
            src={simulationSrc}
            title="Interactive 3D heart simulation"
            loading="lazy"
            allowFullScreen
          />
        </div>

        <p className="note-hint">
          Tip: the 3D model needs an internet connection the first time it loads (it
          fetches the 3D graphics library). After that it keeps working.
        </p>

        <p className="lesson-key">
          Watch how the right side (blue) sends oxygen-poor blood to the lungs, and the
          left side (red) pumps oxygen-rich blood to the body — the same journey from
          the lesson, now in 3D.
        </p>
      </section>

      <section className="lesson-finish">
        <p>Explored the 3D heart? Mark it done, then move on to the exercises.</p>
        <button
          type="button"
          className="drill-check"
          onClick={markExplored}
          disabled={explored}
        >
          {explored ? "Explored ✅" : "Mark as explored"}
        </button>
      </section>
    </article>
  );
}
