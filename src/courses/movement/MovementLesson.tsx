import { useEffect, useRef, useState } from "react";
import {
  animalMovers,
  muscleFeatures,
  movementTerms,
  nasticMovements,
  tropisms,
  type AnimalMover
} from "../../data/movementData";
import type { SectionViewProps } from "../section";

type SunPos = "left" | "center" | "right";
const SUN_X: Record<SunPos, number> = { left: 45, center: 120, right: 195 };
const LEAN: Record<SunPos, number> = { left: -46, center: 0, right: 46 };

const GROUP_LABELS: Record<AnimalMover["group"], string> = {
  microscopic: "Tiny movers",
  limbed: "Limbs, wings & flippers",
  "no-appendage": "No special appendage"
};

export function MovementLesson({ onProgress }: SectionViewProps) {
  const [animalId, setAnimalId] = useState("amoeba");
  const animal = animalMovers.find((item) => item.id === animalId);

  // Interactive elbow: true = biceps contracted (arm bent up).
  const [flexed, setFlexed] = useState(false);

  // Phototropism: where the light is.
  const [sun, setSun] = useState<SunPos>("center");

  // Mimosa: folded when touched (auto-reopens) or at night.
  const [touched, setTouched] = useState(false);
  const [night, setNight] = useState(false);
  const touchTimer = useRef<number | null>(null);
  const folded = touched || night;

  useEffect(() => {
    return () => {
      if (touchTimer.current) {
        window.clearTimeout(touchTimer.current);
      }
    };
  }, []);

  function touchMimosa() {
    setTouched(true);
    if (touchTimer.current) {
      window.clearTimeout(touchTimer.current);
    }
    touchTimer.current = window.setTimeout(() => setTouched(false), 2600);
  }

  const [tropismId, setTropismId] = useState("photo");
  const tropism = tropisms.find((item) => item.id === tropismId);
  const [nasticId, setNasticId] = useState("haptonastic");
  const nastic = nasticMovements.find((item) => item.id === nasticId);

  const [finished, setFinished] = useState(false);
  function finishLesson() {
    setFinished(true);
    onProgress({ completed: true });
  }

  return (
    <article className="lesson">
      <header className="lesson-hero movement movement-hero">
        <div className="mv-runners" aria-hidden="true">
          <span className="mvr mvr1">🐆</span>
          <span className="mvr mvr2">🐬</span>
          <span className="mvr mvr3">🐦</span>
        </div>
        <p className="eyebrow">Lesson</p>
        <h2>Support and Movements of Organisms</h2>
        <p>
          <span aria-hidden="true">🏃</span> Living things move — an amoeba creeps, a
          cheetah sprints, and even a rooted plant bends towards the light. Let's see how
          animals and plants move, and what holds them up.
        </p>
      </header>

      {/* 1 · Animal locomotion */}
      <section className="lesson-block" aria-labelledby="loco-title">
        <h3 id="loco-title">🐾 How animals move</h3>
        <p>
          A <strong>movement</strong> is a change of position in response to a stimulus.
          Most animals move using <strong>muscles</strong>, but different animals use
          different body parts (appendages). Click an animal to find out.
        </p>

        <div className="part-buttons" role="group" aria-label="Animals">
          {animalMovers.map((item) => (
            <button
              key={item.id}
              type="button"
              className={animalId === item.id ? "is-active" : ""}
              aria-pressed={animalId === item.id}
              onClick={() => setAnimalId(item.id)}
            >
              <span aria-hidden="true">{item.emoji}</span> {item.animal}
            </button>
          ))}
        </div>

        {animal && (
          <div key={animal.id} className="part-panel movement-reveal" role="status" aria-live="polite">
            <h4>
              <span aria-hidden="true">{animal.emoji}</span> {animal.animal}
              <span className="mv-group-tag">{GROUP_LABELS[animal.group]}</span>
            </h4>
            <p className="lesson-key">Moves using: {animal.appendage}</p>
            <p>{animal.fact}</p>
          </div>
        )}
      </section>

      {/* 2 · Bones, muscles & the elbow */}
      <section className="lesson-block" aria-labelledby="elbow-title">
        <h3 id="elbow-title">💪 Bones, muscles &amp; joints</h3>
        <p>
          Invertebrates move with muscles alone; vertebrates (like us) use{" "}
          <strong>bones and muscles together</strong>. A muscle can only{" "}
          <strong>pull</strong>, never push — so muscles work in pairs. At the elbow, the{" "}
          <strong>biceps</strong> and <strong>triceps</strong> are an antagonistic pair.
          Try it:
        </p>

        <div className="elbow-lab">
          <svg className="elbow-figure" viewBox="0 0 200 240" role="img"
            aria-label={flexed ? "A bent arm: biceps contracted" : "A straight arm: triceps contracted"}>
            {/* shoulder + humerus */}
            <circle cx="60" cy="42" r="11" className="el-joint" />
            <rect x="52" y="46" width="16" height="92" rx="8" className="el-bone" />
            {/* biceps (front) */}
            <ellipse
              cx="43" cy="92"
              rx={flexed ? 15 : 9} ry={flexed ? 30 : 24}
              className={`el-muscle biceps ${flexed ? "is-contracted" : ""}`}
            />
            {/* triceps (back) */}
            <ellipse
              cx="77" cy="92"
              rx={!flexed ? 14 : 9} ry={!flexed ? 30 : 24}
              className={`el-muscle triceps ${!flexed ? "is-contracted" : ""}`}
            />
            {/* elbow pivot */}
            <circle cx="60" cy="138" r="7" className="el-joint" />
            {/* forearm rotates about the elbow */}
            <g
              className="el-forearm"
              style={{
                transformOrigin: "60px 138px",
                transform: flexed ? "rotate(-128deg)" : "rotate(0deg)"
              }}
            >
              <rect x="53" y="138" width="14" height="86" rx="7" className="el-bone" />
              <circle cx="60" cy="228" r="12" className="el-hand" />
            </g>
          </svg>

          <div className="elbow-controls">
            <div className="drill-buttons">
              <button
                type="button"
                className={flexed ? "drill-check is-on" : "drill-check"}
                onClick={() => setFlexed(true)}
              >
                Contract biceps
              </button>
              <button
                type="button"
                className={!flexed ? "drill-check is-on" : "drill-check"}
                onClick={() => setFlexed(false)}
              >
                Contract triceps
              </button>
            </div>

            <div className="part-panel movement-reveal" key={String(flexed)} role="status" aria-live="polite">
              {flexed ? (
                <>
                  <h4>Biceps contracted → arm bends up</h4>
                  <p>
                    The <strong>biceps</strong> shortens and pulls the radius bone, so the
                    forearm lifts. Meanwhile the triceps relaxes.
                  </p>
                </>
              ) : (
                <>
                  <h4>Triceps contracted → arm straightens</h4>
                  <p>
                    The <strong>triceps</strong> shortens and pulls the ulna bone, so the
                    forearm straightens. The biceps relaxes back to its resting length.
                  </p>
                </>
              )}
            </div>

            <ul className="muscle-features">
              {muscleFeatures.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3 · Plant support */}
      <section className="lesson-block" aria-labelledby="support-title">
        <h3 id="support-title">🌳 What holds a plant up?</h3>
        <div className="support-columns">
          <div className="support-card soft">
            <h4>🌱 Soft (non-woody) plants</h4>
            <p>
              A balsam plant droops on a hot day when it loses water. Soft plants stay
              erect because water fills their cells and keeps them firm (turgor). No
              water → they wilt.
            </p>
          </div>
          <div className="support-card woody">
            <h4>🪵 Woody plants</h4>
            <p>
              A mango tree stays upright even in dry weather because{" "}
              <strong>cellulose and lignin</strong> are deposited in its walls and
              heartwood, giving it lasting rigidity.
            </p>
          </div>
        </div>
      </section>

      {/* 4 · Tropic movements + phototropism sim */}
      <section className="lesson-block" aria-labelledby="tropic-title">
        <h3 id="tropic-title">📈 Plant movements: tropic</h3>
        <p>
          Plants can't walk, but they <strong>grow</strong> in response to a stimulus.
          A <strong>tropic movement</strong> is a growth whose direction is linked to the
          stimulus, driven by growth substances. <strong>Positive</strong> = towards the
          stimulus, <strong>negative</strong> = away. Move the light and watch the stem
          follow it — that's positive phototropism.
        </p>

        <div className="photo-lab">
          <svg className="photo-figure" viewBox="0 0 240 210" role="img"
            aria-label={`A plant bending towards the light on the ${sun}`}>
            {/* sun */}
            <g className="pt-sun" style={{ transform: `translateX(${SUN_X[sun] - 120}px)` }}>
              <circle cx="120" cy="34" r="17" className="pt-sun-core" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1="120" y1="34" x2="120" y2="6"
                  className="pt-ray"
                  transform={`rotate(${deg} 120 34)`}
                />
              ))}
            </g>
            {/* pot */}
            <path d="M92 168 h56 l-6 32 h-44 Z" className="pt-pot" />
            <rect x="88" y="160" width="64" height="12" rx="3" className="pt-soil" />
            {/* stem grows from soil towards the light */}
            <path
              d={`M120 162 Q ${120 + LEAN[sun] * 0.5} 110 ${120 + LEAN[sun]} 66`}
              className="pt-stem"
              style={{ transition: "d 0.7s ease" }}
            />
            <circle cx={120 + LEAN[sun]} cy="62" r="10" className="pt-leaf" />
            {/* roots grow down (geotropism) */}
            <path d="M120 162 q-10 20 -16 34 M120 162 q10 20 16 34 M120 162 v30" className="pt-roots" />
          </svg>

          <div className="photo-controls">
            <p className="spring-objects-label">Move the light:</p>
            <div className="dir-buttons">
              {(["left", "center", "right"] as SunPos[]).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  className={sun === pos ? "is-active" : ""}
                  onClick={() => setSun(pos)}
                >
                  {pos === "left" ? "☀️ Left" : pos === "right" ? "Right ☀️" : "☀️ Above"}
                </button>
              ))}
            </div>
            <p className="lesson-key">
              The shoot grows <strong>towards</strong> the light — positive phototropism.
              At the same time the roots grow <strong>down</strong> — positive geotropism.
            </p>

            <div className="part-buttons" role="group" aria-label="Tropic movements" style={{ marginTop: "0.75rem" }}>
              {tropisms.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={tropismId === item.id ? "is-active" : ""}
                  aria-pressed={tropismId === item.id}
                  onClick={() => setTropismId(item.id)}
                >
                  <span aria-hidden="true">{item.emoji}</span> {item.name.replace("Positive ", "").replace("Negative ", "")}
                </button>
              ))}
            </div>
            {tropism && (
              <div key={tropism.id} className="part-panel movement-reveal" role="status" aria-live="polite">
                <h4>
                  <span aria-hidden="true">{tropism.emoji}</span> {tropism.name}
                </h4>
                <p className="lesson-key">
                  Stimulus: {tropism.stimulus} · {tropism.direction} tropism
                </p>
                <p>{tropism.example}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5 · Nastic movements + Mimosa */}
      <section className="lesson-block" aria-labelledby="nastic-title">
        <h3 id="nastic-title">💤 Plant movements: nastic</h3>
        <p>
          A <strong>nastic movement</strong> always happens in the same fixed way, whatever
          the direction of the stimulus. It's not growth — it's a fast{" "}
          <strong>turgor change</strong> in a swelling called the <strong>pulvinus</strong>.
          Touch the Mimosa, or turn night on, and watch its leaves fold.
        </p>

        <div className="mimosa-lab">
          <svg className={`mimosa-figure ${folded ? "is-folded" : ""} ${night ? "is-night" : ""}`}
            viewBox="0 0 220 170" role="img"
            aria-label={folded ? "A Mimosa with its leaves folded closed" : "A Mimosa with its leaves open"}>
            <rect x="0" y="0" width="220" height="170" className="mi-sky" />
            {/* stem + petiole */}
            <path d="M40 160 Q 70 120 110 96" className="mi-stem" />
            <line x1="110" y1="96" x2="196" y2="70" className="mi-petiole" />
            {/* leaflets in two rows along the petiole */}
            <g className="mi-leaves">
              {[0, 1, 2, 3, 4].map((i) => {
                const x = 118 + i * 17;
                const y = 94 - i * 5;
                return (
                  <g key={i}>
                    <ellipse cx={x} cy={y - 9} rx="9" ry="4" className="mi-leaf up" style={{ transformOrigin: `${x}px ${y}px` }} />
                    <ellipse cx={x} cy={y + 9} rx="9" ry="4" className="mi-leaf down" style={{ transformOrigin: `${x}px ${y}px` }} />
                  </g>
                );
              })}
            </g>
          </svg>

          <div className="mimosa-controls">
            <div className="drill-buttons">
              <button type="button" className="drill-check" onClick={touchMimosa}>
                👆 Touch the plant
              </button>
              <button
                type="button"
                className={night ? "drill-next is-on" : "drill-next"}
                onClick={() => setNight((value) => !value)}
              >
                {night ? "🌙 Night (on)" : "🌞 Turn night on"}
              </button>
            </div>
            <p className="note-hint">
              Touch → leaves fold at once: a <strong>haptonastic</strong> movement. Leaves
              also fold as darkness falls: a <strong>nyctinastic</strong> ('sleep')
              movement. Neither depends on which direction the stimulus came from.
            </p>

            <div className="part-buttons" role="group" aria-label="Nastic movements">
              {nasticMovements.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={nasticId === item.id ? "is-active" : ""}
                  aria-pressed={nasticId === item.id}
                  onClick={() => setNasticId(item.id)}
                >
                  <span aria-hidden="true">{item.emoji}</span> {item.name}
                </button>
              ))}
            </div>
            {nastic && (
              <div key={nastic.id} className="part-panel movement-reveal" role="status" aria-live="polite">
                <h4>
                  <span aria-hidden="true">{nastic.emoji}</span> {nastic.name}
                </h4>
                <p className="lesson-key">Triggered by: {nastic.trigger}</p>
                <p>{nastic.example}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6 · In-situ conservation */}
      <section className="lesson-block" aria-labelledby="conserve-title">
        <h3 id="conserve-title">🌲 Plants can't run away</h3>
        <p>
          Animals escape danger by moving away. Plants are rooted, so we protect them
          where they grow. Conserving an organism in its own natural habitat is{" "}
          <strong>in-situ conservation</strong> — like the strict reserves that protect
          ebony, satinwood and vitex trees (for example, the Wilpattu reserve).
        </p>
      </section>

      {/* 7 · Key terms */}
      <section className="lesson-block" aria-labelledby="terms-title">
        <h3 id="terms-title">📖 Key words</h3>
        <dl className="term-list">
          {movementTerms.map((item) => (
            <div key={item.term} className="term-row">
              <dt>{item.term}</dt>
              <dd>{item.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="lesson-finish">
        <p>All moved? Mark the lesson done, then match the movers.</p>
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
