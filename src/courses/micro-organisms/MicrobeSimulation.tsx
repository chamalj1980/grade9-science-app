import { useState } from "react";
import type { SectionViewProps } from "../section";

// The 3D Microbe Lab is a self-contained Three.js app (its own full-page layout, CDN
// scripts and global CSS). We embed it in an iframe so its styles and scripts stay
// isolated from the React app. The file lives in public/ and is served at
// ./microbe-simulation.html.
const simulationSrc = "./microbe-simulation.html";

export function MicrobeSimulation({ onProgress }: SectionViewProps) {
  const [explored, setExplored] = useState(false);

  function markExplored() {
    setExplored(true);
    onProgress({ completed: true });
  }

  return (
    <article className="lesson">
      <header className="lesson-hero microbes">
        <p className="eyebrow">Explore in 3D</p>
        <h2>3D Microbe Lab</h2>
        <p>
          Build each of the five microbe groups in 3D — drag to rotate, zoom in, and click
          a glowing dot to learn what each part does. Then open the{" "}
          <strong>Fermentation chamber</strong> to watch yeast bubble out carbon dioxide.
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
            title="Interactive 3D microbe lab"
            loading="lazy"
            allowFullScreen
          />
        </div>

        <p className="note-hint">
          Tip: the 3D model needs an internet connection the first time it loads (it
          fetches the 3D graphics library). After that it keeps working.
        </p>

        <p className="lesson-key">
          Notice how a virus is tiny and simple (just a protein coat), while an amoeba and
          spirogyra are much bigger, with a true nucleus — try the <strong>Size compare</strong>{" "}
          button to see how they stack up.
        </p>
      </section>

      <section className="lesson-finish">
        <p>Explored the 3D lab? Mark it done, then move on to the exercises.</p>
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
