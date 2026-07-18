import { useState } from "react";
import { ForceArrow } from "../../components/ForceArrow";
import {
  easingExamples,
  forceEffects,
  forceTerms,
  weighables,
  type EffectId
} from "../../data/forceData";
import { directionLabels, mainDirections, type Direction } from "../../utils/force";
import type { SectionViewProps } from "../section";

const SPRING_MAX = 20; // newtons the sim's balance can show

export function ForceLesson({ onProgress }: SectionViewProps) {
  const [effectId, setEffectId] = useState<EffectId>("move");
  const effect = forceEffects.find((item) => item.id === effectId);

  const [force, setForce] = useState(8);

  const [magnitude, setMagnitude] = useState(6);
  const [direction, setDirection] = useState<Direction>("right");

  const [finished, setFinished] = useState(false);

  function finishLesson() {
    setFinished(true);
    onProgress({ completed: true });
  }

  return (
    <article className="lesson">
      <header className="lesson-hero force force-hero">
        <div className="force-hero-arrows" aria-hidden="true">
          <span className="fh fh1">→</span>
          <span className="fh fh2">↗</span>
          <span className="fh fh3">↓</span>
        </div>
        <p className="eyebrow">Lesson</p>
        <h2>Basic Concepts Associated with Force</h2>
        <p>
          <span aria-hidden="true">💪</span> Every time you push, pull, kick, lift or
          squeeze, you use a <strong>force</strong>. Let's see what forces can do, how we
          measure them, and how scientists draw them.
        </p>
      </header>

      {/* 1 · What is a force */}
      <section className="lesson-block" aria-labelledby="what-title">
        <h3 id="what-title">🤔 What is a force?</h3>
        <p>
          A <strong>force is simply a push or a pull</strong>. You can move a book by
          pushing it, but you can't move a wall no matter how hard you push — so a force
          doesn't always cause motion. Click each effect to see what a force can do.
        </p>

        <div className="part-buttons" role="group" aria-label="Effects of a force">
          {forceEffects.map((item) => (
            <button
              key={item.id}
              type="button"
              className={effectId === item.id ? "is-active" : ""}
              aria-pressed={effectId === item.id}
              onClick={() => setEffectId(item.id)}
            >
              <span aria-hidden="true">{item.emoji}</span> {item.title}
            </button>
          ))}
        </div>

        {effect && (
          <div key={effect.id} className="part-panel force-reveal" role="status" aria-live="polite">
            <div className={`effect-demo demo-${effect.id}`} aria-hidden="true">
              <span className="ed-ball" />
              {effect.id === "shape" ? <span className="ed-hand" /> : <span className="ed-arrow" />}
            </div>
            <h4>
              <span aria-hidden="true">{effect.emoji}</span> {effect.title}
            </h4>
            <p className="lesson-key">{effect.summary}</p>
            <p>{effect.example}</p>
          </div>
        )}
      </section>

      {/* 2 · Magnitude + spring balance */}
      <section className="lesson-block" aria-labelledby="mag-title">
        <h3 id="mag-title">📏 How big is the force?</h3>
        <p>
          A gentle hit moves a ball slowly; a hard hit moves it fast — so a force has a{" "}
          <strong>magnitude</strong> (a size). We measure it in{" "}
          <strong>newtons (N)</strong> using a <strong>spring balance</strong>, whose
          spring stretches further for a bigger force.
        </p>

        <div className="spring-lab">
          <svg className="spring-balance" viewBox="0 0 120 240" role="img" aria-label={`Spring balance reading ${force} newtons`}>
            <rect x="42" y="8" width="36" height="150" rx="6" className="sb-body" />
            <line x1="60" y1="8" x2="60" y2="0" className="sb-hook-top" />
            {/* spring: more coils compressed = more stretch shown by pointer */}
            <line x1="60" y1="14" x2="60" y2={30 + force * 5.5} className="sb-spring" />
            <line
              x1="46"
              y1={30 + force * 5.5}
              x2="74"
              y2={30 + force * 5.5}
              className="sb-pointer"
            />
            <text x="82" y={34 + force * 5.5} className="sb-reading">
              {force} N
            </text>
            {/* hanging object */}
            <line x1="60" y1={30 + force * 5.5} x2="60" y2={175} className="sb-thread" />
            <circle cx="60" cy="192" r="17" className="sb-weight" />
          </svg>

          <div className="spring-controls">
            <label className="slider-control" htmlFor="force-slider">
              <span>
                Force on the balance: <strong>{force} N</strong>
              </span>
              <input
                id="force-slider"
                type="range"
                min={0}
                max={SPRING_MAX}
                value={force}
                onChange={(event) => setForce(Number(event.target.value))}
              />
            </label>
            <p className="spring-objects-label">Or hang something on it:</p>
            <div className="spring-objects">
              {weighables.map((object) => (
                <button
                  key={object.id}
                  type="button"
                  className={force === object.newtons ? "is-active" : ""}
                  onClick={() => setForce(object.newtons)}
                >
                  <span aria-hidden="true">{object.emoji}</span> {object.label}
                  <span className="so-n">{object.newtons} N</span>
                </button>
              ))}
            </div>
            <p className="note-hint">
              When you hang an object, the reading is its <strong>weight</strong> — the
              gravitational force the Earth pulls it down with. School balances read in
              newtons; shop balances usually read in grams or kilograms.
            </p>
          </div>
        </div>
      </section>

      {/* 3 · Force is a vector */}
      <section className="lesson-block" aria-labelledby="vec-title">
        <h3 id="vec-title">🧭 Force has a direction too</h3>
        <p>
          To open a drawer you pull it towards you; to close it you push the other way. So
          a force also has a <strong>direction</strong>. And where you apply it matters:
          push a bottle low down and it slides, push it high up and it topples — that spot
          is the <strong>point of application</strong>.
        </p>
        <p className="lesson-key">
          A quantity with both a magnitude and a direction is a{" "}
          <strong>vector</strong>. Force is a vector.
        </p>
      </section>

      {/* 4 · Graphical representation (interactive) */}
      <section className="lesson-block" aria-labelledby="graph-title">
        <h3 id="graph-title">✏️ Drawing a force</h3>
        <p>
          Scientists draw a force as an arrow. Change the two controls and watch all three
          parts of the arrow update.
        </p>

        <div className="force-draw">
          <ForceArrow
            magnitude={magnitude}
            direction={direction}
            title={`A force of ${magnitude} newtons pointing ${directionLabels[direction]}`}
            showParts
          />
          <div className="force-draw-controls">
            <label className="slider-control" htmlFor="mag-slider">
              <span>
                Magnitude → arrow <strong>length</strong>: {magnitude} N
              </span>
              <input
                id="mag-slider"
                type="range"
                min={0}
                max={14}
                value={magnitude}
                onChange={(event) => setMagnitude(Number(event.target.value))}
              />
            </label>

            <p className="spring-objects-label">
              Direction → the <strong>arrow head</strong>:
            </p>
            <div className="dir-buttons">
              {mainDirections.map((dir) => (
                <button
                  key={dir}
                  type="button"
                  className={direction === dir ? "is-active" : ""}
                  onClick={() => setDirection(dir)}
                >
                  {directionLabels[dir]}
                </button>
              ))}
            </div>

            <ul className="graph-legend">
              <li>
                <strong>Length</strong> shows the magnitude — a 10 N arrow is twice as
                long as a 5 N one.
              </li>
              <li>
                <strong>Arrow head</strong> shows the direction.
              </li>
              <li>
                <strong>Dot</strong> at the start shows the point of application.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5 · Making work easier */}
      <section className="lesson-block" aria-labelledby="easy-title">
        <h3 id="easy-title">🛠️ Using forces cleverly</h3>
        <p>
          In everyday life we change the <strong>direction</strong> or{" "}
          <strong>point of application</strong> of a force to make a job easier.
        </p>
        <div className="easing-grid">
          {easingExamples.map((example) => (
            <div key={example.id} className="easing-card">
              <h4>{example.title}</h4>
              <p className="easing-problem">😓 {example.problem}</p>
              <p className="easing-fix">
                ✅ {example.fix}
                <span className={`easing-tag ${example.changes}`}>
                  changes the {example.changes === "point" ? "point of application" : "direction"}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6 · Key terms */}
      <section className="lesson-block" aria-labelledby="terms-title">
        <h3 id="terms-title">📖 Key words</h3>
        <dl className="term-list">
          {forceTerms.map((item) => (
            <div key={item.term} className="term-row">
              <dt>{item.term}</dt>
              <dd>{item.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="lesson-finish">
        <p>Ready? Mark the lesson done, then go and draw some forces.</p>
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
