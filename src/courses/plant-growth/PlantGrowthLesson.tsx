import { useState } from "react";
import {
  apexExperiments,
  artificialSubstances,
  hormones,
  plantGrowthTerms,
  type HormoneId
} from "../../data/plantGrowthData";
import type { LightDir } from "../../utils/plantGrowth";
import { computeOutcome } from "../../utils/plantGrowth";
import type { SectionViewProps } from "../section";
import { PlantFigure } from "./PlantFigure";

const kindLabel: Record<string, string> = {
  promoter: "Promoter",
  inhibitor: "Inhibitor",
  other: "Other"
};

export function PlantGrowthLesson({ onProgress }: SectionViewProps) {
  const [experimentId, setExperimentId] = useState<"height" | "light">("height");
  const [apexOn, setApexOn] = useState(true);
  const experiment = apexExperiments.find((item) => item.id === experimentId)!;

  const [hormoneId, setHormoneId] = useState<HormoneId>("auxin");
  const hormone = hormones.find((item) => item.id === hormoneId)!;

  const [light, setLight] = useState<LightDir>("left");
  const phototropism = computeOutcome({ light, apexPresent: true });

  const [finished, setFinished] = useState(false);

  function finishLesson() {
    setFinished(true);
    onProgress({ completed: true });
  }

  return (
    <article className="lesson">
      <header className="lesson-hero plant plant-hero">
        <div className="plant-hero-sprigs" aria-hidden="true">
          <span className="ps ps1">🌱</span>
          <span className="ps ps2">🌿</span>
          <span className="ps ps3">☀️</span>
        </div>
        <p className="eyebrow">Lesson</p>
        <h2>Plant Growth Substances</h2>
        <p>
          <span aria-hidden="true">🌱</span> Air, water, light and minerals help a plant
          grow — but so do tiny amounts of <strong>chemical substances</strong> the plant
          makes itself. Let's meet these growth substances and see what they do.
        </p>
      </header>

      {/* 1 · The apex experiments */}
      <section className="lesson-block" aria-labelledby="apex-title">
        <h3 id="apex-title">🔍 Why does the tip matter?</h3>
        <p>
          Have you wondered how a stem knows to grow <strong>upwards</strong> and toward
          the light? Two simple experiments point to the <strong>apex</strong> — the
          growing tip. Pick an experiment, then cut or keep the apex.
        </p>

        <div className="part-buttons" role="group" aria-label="Choose an experiment">
          {apexExperiments.map((item) => (
            <button
              key={item.id}
              type="button"
              className={experimentId === item.id ? "is-active" : ""}
              aria-pressed={experimentId === item.id}
              onClick={() => setExperimentId(item.id)}
            >
              <span aria-hidden="true">{item.emoji}</span> {item.title}
            </button>
          ))}
        </div>

        <div key={experiment.id} className="apex-lab plant-reveal">
          <div className="apex-plants" aria-hidden="true">
            <PlantFigure
              bend={experimentId === "light" ? "left" : "up"}
              auxinSide="even"
              bushy={false}
              light={experimentId === "light" ? "left" : "top"}
              title="Plant with its apex"
            />
            <PlantFigure
              bend="none"
              auxinSide="even"
              bushy
              light={experimentId === "light" ? "left" : "top"}
              title="Plant with its apex removed"
            />
          </div>
          <div className="apex-info">
            <p className="lesson-key">{experiment.method}</p>
            <p>
              <strong>🌱 With the apex:</strong> {experiment.withApex}
            </p>
            <p>
              <strong>✂️ Without the apex:</strong> {experiment.withoutApex}
            </p>
            <p className="apex-conclusion">✅ {experiment.conclusion}</p>
          </div>
        </div>
      </section>

      {/* 2 · What plant growth substances are */}
      <section className="lesson-block" aria-labelledby="pgs-title">
        <h3 id="pgs-title">🧪 What are plant growth substances?</h3>
        <p>
          The chemical compounds made in the apex that <strong>regulate</strong> how a
          plant grows are called <strong>plant growth substances</strong>. Some{" "}
          <strong>promote</strong> growth; some <strong>inhibit</strong> it.
        </p>
        <div className="pgs-split">
          <div className="pgs-col pgs-promote">
            <h4>⬆️ Promoters</h4>
            <p>Speed growth up.</p>
            <ul>
              <li>Auxin</li>
              <li>Gibberellin</li>
              <li>Cytokinin</li>
            </ul>
          </div>
          <div className="pgs-col pgs-inhibit">
            <h4>⬇️ Inhibitors</h4>
            <p>Slow growth down.</p>
            <ul>
              <li>Abscisic acid</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3 · Meet the growth substances */}
      <section className="lesson-block" aria-labelledby="hormones-title">
        <h3 id="hormones-title">🌿 Meet the growth substances</h3>
        <p>Click each one to see where it's made and what it does.</p>

        <div className="part-buttons" role="group" aria-label="Growth substances">
          {hormones.map((item) => (
            <button
              key={item.id}
              type="button"
              className={hormoneId === item.id ? "is-active" : ""}
              aria-pressed={hormoneId === item.id}
              onClick={() => setHormoneId(item.id)}
            >
              <span aria-hidden="true">{item.emoji}</span> {item.name}
            </button>
          ))}
        </div>

        <div key={hormone.id} className="hormone-panel plant-reveal" role="status" aria-live="polite">
          <div className="hormone-head">
            <span className="hormone-emoji" aria-hidden="true">
              {hormone.emoji}
            </span>
            <div>
              <h4>{hormone.name}</h4>
              <span className={`hormone-tag tag-${hormone.kind}`}>
                {kindLabel[hormone.kind]}
              </span>
            </div>
          </div>
          <p className="lesson-key">{hormone.tagline}</p>
          <p>{hormone.detail}</p>
          <p className="hormone-made">📍 Made in: {hormone.madeIn}</p>
        </div>
      </section>

      {/* 4 · Phototropism mini-demo */}
      <section className="lesson-block" aria-labelledby="photo-title">
        <h3 id="photo-title">🔦 How auxin bends a shoot toward light</h3>
        <p>
          When light comes from one side, <strong>auxin gathers on the shaded side</strong>
          . Those cells grow longer and the tip curves toward the light — a{" "}
          <strong>positive phototropic movement</strong>. Move the light and watch.
        </p>

        <div className="plant-lab">
          <PlantFigure
            bend={phototropism.bend}
            auxinSide={phototropism.auxinSide}
            bushy={false}
            light={light}
            title={`A shoot lit from the ${light === "top" ? "top" : light}, curving toward the light`}
          />
          <div className="plant-lab-controls">
            <p className="spring-objects-label">Shine the light from:</p>
            <div className="dir-buttons">
              <button type="button" className={light === "left" ? "is-active" : ""} onClick={() => setLight("left")}>
                ⬅️ Left
              </button>
              <button type="button" className={light === "top" ? "is-active" : ""} onClick={() => setLight("top")}>
                ⬆️ Overhead
              </button>
              <button type="button" className={light === "right" ? "is-active" : ""} onClick={() => setLight("right")}>
                ➡️ Right
              </button>
            </div>
            <ul className="graph-legend">
              <li>
                The <strong>orange band</strong> shows where auxin has collected.
              </li>
              <li>The tip always curves <strong>toward</strong> the light.</li>
              <li>Auxin also stops <strong>lateral buds</strong> from growing.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5 · Leaf and fruit fall */}
      <section className="lesson-block" aria-labelledby="fall-title">
        <h3 id="fall-title">🍂 Why ripe leaves and fruits fall</h3>
        <p>
          When a leaf or fruit matures, the amount of growth substance in it{" "}
          <strong>drops</strong>. An <strong>abscission layer</strong> then forms across
          its stalk, so the leaf or fruit falls away cleanly.
        </p>
      </section>

      {/* 6 · Artificial growth substances */}
      <section className="lesson-block" aria-labelledby="art-title">
        <h3 id="art-title">🧑‍🌾 Artificial growth substances</h3>
        <p>
          Farmers and gardeners use <strong>man-made</strong> growth substances to control
          how crops grow.
        </p>
        <div className="art-grid">
          {artificialSubstances.map((substance) => (
            <div key={substance.id} className="art-card">
              <span className="art-emoji" aria-hidden="true">
                {substance.emoji}
              </span>
              <div>
                <h4>
                  {substance.short}
                  {substance.short !== substance.full && (
                    <span className="art-full"> · {substance.full}</span>
                  )}
                </h4>
                <p>{substance.use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7 · Key terms */}
      <section className="lesson-block" aria-labelledby="terms-title">
        <h3 id="terms-title">📖 Key words</h3>
        <dl className="term-list">
          {plantGrowthTerms.map((item) => (
            <div key={item.term} className="term-row">
              <dt>{item.term}</dt>
              <dd>{item.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="lesson-finish">
        <p>Ready? Mark the lesson done, then head to the Phototropism Lab.</p>
        <button
          type="button"
          className="drill-check"
          onClick={finishLesson}
          disabled={finished}
        >
          {finished ? "Lesson complete ✅" : "Mark lesson as done"}
        </button>
      </section>
    </article>
  );
}
