import { useEffect, useState } from "react";
import { earParts } from "../../data/earParts";
import { eyeParts } from "../../data/eyeParts";
import {
  correctionLensFor,
  imageLandsOn,
  type ObjectDistance,
  type RefractiveState
} from "../../utils/visionDefects";
import { soundRisk, type SoundRisk } from "../../utils/soundSafety";
import { EarFigure } from "./EarFigure";
import { EyeFigure } from "./EyeFigure";
import type { SectionViewProps } from "../section";

// Path a sound takes from the air to the brain (textbook section 2.4).
const soundSteps = [
  { node: "Sound wave", text: "A sound wave travels through the air toward the ear." },
  { node: "Pinna", text: "The pinna catches the wave and funnels it inward." },
  { node: "Auditory canal", text: "The canal carries the sound to the eardrum." },
  { node: "Eardrum", text: "The tympanic membrane vibrates to and fro." },
  { node: "Ossicles", text: "The three ossicles pass the vibration onward." },
  { node: "Cochlea", text: "The cochlea turns the vibration into nerve signals." },
  { node: "Auditory nerve", text: "The auditory nerve carries the signals to the brain." },
  { node: "Brain", text: "The brain interprets the signals as sound." }
];

// A few labelled points on the loudness scale for the meter.
const dbExamples = [
  { db: 30, label: "Woodland / bedroom" },
  { db: 60, label: "Conversation" },
  { db: 85, label: "Street traffic" },
  { db: 110, label: "Rock concert" },
  { db: 140, label: "Jet engine" }
];

const riskLabel: Record<SoundRisk, string> = {
  safe: "Safe",
  caution: "Caution",
  dangerous: "Dangerous",
  harmful: "Harmful — pain"
};

// Where the focused image sits on the ray-demo SVG (x in a 0 0 340 200 viewBox).
const RETINA_X = 292;
const focusXFor: Record<string, number> = {
  "on-retina": RETINA_X,
  "front-of-retina": 258,
  "behind-retina": 324
};

export function SensoryLesson({ onProgress }: SectionViewProps) {
  // Clickable anatomy
  const [eyePartId, setEyePartId] = useState(eyeParts[0].id);
  const [earPartId, setEarPartId] = useState(earParts[0].id);
  const selectedEye = eyeParts.find((p) => p.id === eyePartId);
  const selectedEar = earParts.find((p) => p.id === earPartId);

  // Blind-spot hook: the slider slides the red dot across the card. As it passes over the
  // blind-spot zone (centred at x=210 in the 320-wide viewBox) it fades out and back in.
  const [blindPos, setBlindPos] = useState(0);
  const blindDotX = 110 + (blindPos / 100) * 190; // 110 (near the ✚) → 300 (far right)
  const blindDistFromSpot = Math.abs(blindDotX - 210);
  const blindDotOpacity =
    blindDistFromSpot <= 12 ? 0 : blindDistFromSpot >= 34 ? 1 : (blindDistFromSpot - 12) / 22;
  const blindDotGone = blindDotOpacity < 0.35;

  // Focusing & vision defects ray demo
  const [refractive, setRefractive] = useState<RefractiveState>("normal");
  const [distance, setDistance] = useState<ObjectDistance>("far");
  const [glasses, setGlasses] = useState(false);
  const correctionLens = correctionLensFor(refractive);
  const imagePos = imageLandsOn(refractive, distance, glasses);
  const focusX = focusXFor[imagePos];
  const objectX = distance === "far" ? 34 : 96;
  const clear = imagePos === "on-retina";

  // Eye diseases
  const [disease, setDisease] = useState<"healthy" | "cataract" | "glaucoma">(
    "healthy"
  );

  // Sound path stepper
  const [soundIndex, setSoundIndex] = useState(0);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const soundStep = soundSteps[soundIndex];

  // Loudness meter
  const [db, setDb] = useState(60);
  const risk = soundRisk(db);

  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!soundPlaying) {
      return;
    }
    const timer = window.setInterval(() => {
      setSoundIndex((current) => (current + 1) % soundSteps.length);
    }, 1300);
    return () => window.clearInterval(timer);
  }, [soundPlaying]);

  function finishLesson() {
    setFinished(true);
    onProgress({ completed: true });
  }

  // Ray endpoints for the vision demo.
  const rayLensTop = 78;
  const rayLensBottom = 122;

  return (
    <article className="lesson">
      <header className="lesson-hero sensory-system">
        <p className="eyebrow">Lesson</p>
        <h2>How We See and Hear</h2>
        <p>
          <span aria-hidden="true">👁️</span> The eye is our optical sense organ and{" "}
          <span aria-hidden="true">👂</span> the ear is our audio sense organ. Let's
          look inside both and see how they work.
        </p>
      </header>

      {/* Hook: blind spot */}
      <section className="lesson-block" aria-labelledby="hook-title">
        <h3 id="hook-title">🔴 Find your blind spot</h3>
        <p>
          Stare at the ✚ and slide the red dot to the right. As it moves, it slips into a
          zone where it <strong>disappears</strong>, then comes back. That gap is your{" "}
          <strong>blind spot</strong> — the place where the optic nerve leaves the retina,
          so there are no light-sensitive cells there.
        </p>
        <svg
          className="blind-svg"
          viewBox="0 0 320 90"
          role="img"
          aria-label={
            blindDotGone
              ? "The red dot has vanished into the blind spot"
              : "A red dot to the right of a fixation cross"
          }
        >
          <rect x="0" y="0" width="320" height="90" rx="10" fill="#f7f9fc" />
          <text x="60" y="52" fontSize="30" textAnchor="middle" fill="#20303a">✚</text>
          <circle cx={blindDotX} cy="45" r="12" fill="#e5484d" opacity={blindDotOpacity} />
        </svg>
        <label className="slider-control" htmlFor="blind-pos">
          <span>
            Move the red dot →{" "}
            <strong>{blindDotGone ? "gone — that's your blind spot!" : "keep sliding…"}</strong>
          </span>
          <input
            id="blind-pos"
            type="range"
            min="0"
            max="100"
            step="1"
            value={blindPos}
            onChange={(event) => setBlindPos(Number(event.target.value))}
          />
        </label>
        <p className="note-hint">
          Try it for real: cover your <strong>left</strong> eye, keep staring at the ✚ with
          your <strong>right</strong> eye, and slowly move the screen towards your face — the
          dot pops out of sight when it lands on your blind spot.
        </p>
      </section>

      {/* The eye */}
      <section className="lesson-block" aria-labelledby="eye-title">
        <h3 id="eye-title">👁️ Structure of the eye</h3>
        <p>
          Light enters through the cornea and pupil, the lens focuses it, and a real,
          inverted image forms on the retina. Click a marker or a name to explore.
        </p>
        <div className="heart-explore">
          <EyeFigure title="Interactive eye section">
            {eyeParts.map((part, index) => (
              <g
                key={part.id}
                className={part.id === eyePartId ? "heart-hotspot is-active" : "heart-hotspot"}
                role="button"
                tabIndex={0}
                aria-label={part.label}
                onClick={() => setEyePartId(part.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setEyePartId(part.id);
                  }
                }}
              >
                <circle cx={part.marker.x} cy={part.marker.y} r="12" />
                <text x={part.marker.x} y={part.marker.y + 4}>
                  {index + 1}
                </text>
              </g>
            ))}
          </EyeFigure>
          <div className="heart-info">
            <div className="part-panel" role="status" aria-live="polite">
              <h4>{selectedEye?.label}</h4>
              <p>{selectedEye?.short}</p>
            </div>
            <div className="part-buttons">
              {eyeParts.map((part, index) => (
                <button
                  key={part.id}
                  type="button"
                  className={part.id === eyePartId ? "is-active" : ""}
                  onClick={() => setEyePartId(part.id)}
                >
                  {index + 1}. {part.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Focusing & vision defects */}
      <section className="lesson-block" aria-labelledby="focus-title">
        <h3 id="focus-title">🔍 Focusing &amp; vision defects</h3>
        <p>
          A normal eye changes its lens shape (<strong>accommodation</strong>) to focus
          both near and far objects on the retina. If the image lands off the retina, the
          picture is blurry — and a lens can fix it.
        </p>

        <div className="ray-demo">
          <div>
            <div className="face-toggle" role="group" aria-label="Choose eye">
              {(["normal", "myopia", "hypermetropia"] as RefractiveState[]).map((state) => (
                <button
                  key={state}
                  type="button"
                  className={refractive === state ? "is-active" : ""}
                  aria-pressed={refractive === state}
                  onClick={() => {
                    setRefractive(state);
                    setGlasses(false);
                    setDistance(state === "hypermetropia" ? "near" : "far");
                  }}
                >
                  {state === "normal"
                    ? "Normal"
                    : state === "myopia"
                      ? "Short sight"
                      : "Long sight"}
                </button>
              ))}
            </div>
            <div className="face-toggle" role="group" aria-label="Object distance">
              <button
                type="button"
                className={distance === "far" ? "is-active" : ""}
                aria-pressed={distance === "far"}
                onClick={() => setDistance("far")}
              >
                Far object
              </button>
              <button
                type="button"
                className={distance === "near" ? "is-active" : ""}
                aria-pressed={distance === "near"}
                onClick={() => setDistance("near")}
              >
                Near object
              </button>
            </div>
            {refractive !== "normal" && (
              <button
                type="button"
                className="drill-check"
                onClick={() => setGlasses((value) => !value)}
              >
                {glasses
                  ? "Remove glasses"
                  : `Add ${correctionLens} lens glasses`}
              </button>
            )}
            <p className={`sense-status ${clear ? "ok" : "no"}`} role="status" aria-live="polite">
              {clear && refractive === "normal" && "Sharp image on the retina — clear vision."}
              {clear && refractive !== "normal" && glasses &&
                `The ${correctionLens} lens moves the image back onto the retina — clear again!`}
              {clear && refractive !== "normal" && !glasses &&
                "This distance focuses on the retina — try the other distance to see the defect."}
              {imagePos === "front-of-retina" &&
                "Short sight: the image forms in front of the retina, so distant objects look blurry. A concave lens fixes it."}
              {imagePos === "behind-retina" &&
                "Long sight: the image forms behind the retina, so near objects look blurry. A convex lens fixes it."}
            </p>
          </div>

          <svg className="ray-svg" viewBox="0 0 340 200" role="img" aria-label="Light rays focusing in the eye">
            {/* eyeball */}
            <circle cx="232" cy="100" r="64" fill="#eef4fb" stroke="#c3ccd9" strokeWidth="2" />
            {/* retina line at the back */}
            <path d="M292 66 A64 64 0 0 1 292 134" fill="none" stroke="#e0a0b0" strokeWidth="4" />
            {/* eye lens */}
            <ellipse cx="182" cy="100" rx="10" ry="34" fill="#cfe6fb" stroke="#83abd6" strokeWidth="2" />

            {/* corrective glasses lens in front of the eye */}
            {glasses && correctionLens === "convex" && (
              <ellipse cx="140" cy="100" rx="9" ry="30" fill="#d7ecff" stroke="#5a6acf" strokeWidth="2" />
            )}
            {glasses && correctionLens === "concave" && (
              <path
                d="M132 70 h16 l-8 30 l8 30 h-16 l8 -30 Z"
                fill="#d7ecff"
                stroke="#5a6acf"
                strokeWidth="2"
              />
            )}

            {/* object (arrow) */}
            <line x1={objectX} y1="72" x2={objectX} y2="128" stroke="#0f766e" strokeWidth="3" />
            <path d={`M${objectX} 72 l-5 8 h10 Z`} fill="#0f766e" />

            {/* two rays converging through the lens to the focus point */}
            <polyline
              points={`${objectX},80 176,${rayLensTop} ${focusX},100`}
              fill="none"
              stroke="#f5b700"
              strokeWidth="2"
              strokeDasharray={imagePos === "behind-retina" ? "5 4" : "0"}
            />
            <polyline
              points={`${objectX},120 176,${rayLensBottom} ${focusX},100`}
              fill="none"
              stroke="#f5b700"
              strokeWidth="2"
              strokeDasharray={imagePos === "behind-retina" ? "5 4" : "0"}
            />
            {/* focus point */}
            <circle cx={focusX} cy="100" r="5" fill={clear ? "#0f766e" : "#e5484d"} />
          </svg>
        </div>
        <p className="lesson-key">
          Short sight (myopia) → concave lens. Long sight (hypermetropia) → convex lens.
        </p>
      </section>

      {/* Eye diseases */}
      <section className="lesson-block" aria-labelledby="disease-title">
        <h3 id="disease-title">🩺 Eye diseases</h3>
        <p>See how two common diseases change what the eye can see.</p>
        <div className="face-toggle" role="group" aria-label="Eye condition">
          {(["healthy", "cataract", "glaucoma"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={disease === option ? "is-active" : ""}
              aria-pressed={disease === option}
              onClick={() => setDisease(option)}
            >
              {option === "healthy" ? "Healthy" : option === "cataract" ? "Cataract" : "Glaucoma"}
            </button>
          ))}
        </div>
        <div className={`vision-scene ${disease}`}>
          <svg viewBox="0 0 200 120" role="img" aria-label="A simple scene as this eye would see it">
            <rect x="0" y="0" width="200" height="120" fill="#cfe8ff" />
            <rect x="0" y="82" width="200" height="38" fill="#bfe3b0" />
            <circle cx="160" cy="30" r="16" fill="#ffd54a" />
            <path d="M70 82 v-26 h26 v26 Z" fill="#e08a5a" />
            <path d="M62 56 l21 -22 l21 22 Z" fill="#c0603a" />
            <rect x="30" y="60" width="10" height="22" fill="#7a5a3a" />
            <circle cx="35" cy="52" r="14" fill="#4f9d52" />
          </svg>
          <span className="scene-overlay" aria-hidden="true" />
        </div>
        <p className="sense-note">
          {disease === "healthy" &&
            "A healthy eye sees the scene clearly."}
          {disease === "cataract" && (
            <>
              <strong>Cataract:</strong> the lens turns cloudy (often with age or UV
              light), so everything looks milky and blurred. <span className="sense-badge no">Not reversible without surgery</span>
            </>
          )}
          {disease === "glaucoma" && (
            <>
              <strong>Glaucoma:</strong> high pressure damages the optic nerve and the
              field of view slowly closes in. <span className="sense-badge no">Damage is irreversible</span>
            </>
          )}
        </p>
      </section>

      {/* Binocular vision */}
      <section className="lesson-block" aria-labelledby="binocular-title">
        <h3 id="binocular-title">👀 Two eyes, one picture</h3>
        <p>
          Our eyes face forward, so both see almost the same area. This{" "}
          <strong>binocular vision</strong> gives us <strong>stereoscopic vision</strong> —
          the ability to judge depth and distance. That's why threading a needle is easier
          with both eyes open.
        </p>
      </section>

      {/* The ear */}
      <section className="lesson-block" aria-labelledby="ear-title">
        <h3 id="ear-title">👂 Structure of the ear</h3>
        <p>
          The ear has three parts: the <strong>outer</strong>, <strong>middle</strong>, and{" "}
          <strong>inner</strong> ear. Click a marker or a name to explore.
        </p>
        <div className="heart-explore">
          <EarFigure title="Interactive ear section">
            {earParts.map((part, index) => (
              <g
                key={part.id}
                className={part.id === earPartId ? "heart-hotspot is-active" : "heart-hotspot"}
                role="button"
                tabIndex={0}
                aria-label={part.label}
                onClick={() => setEarPartId(part.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setEarPartId(part.id);
                  }
                }}
              >
                <circle cx={part.marker.x} cy={part.marker.y} r="12" />
                <text x={part.marker.x} y={part.marker.y + 4}>
                  {index + 1}
                </text>
              </g>
            ))}
          </EarFigure>
          <div className="heart-info">
            <div className="part-panel" role="status" aria-live="polite">
              <h4>{selectedEar?.label}</h4>
              <p>{selectedEar?.short}</p>
            </div>
            <div className="part-buttons">
              {earParts.map((part, index) => (
                <button
                  key={part.id}
                  type="button"
                  className={part.id === earPartId ? "is-active" : ""}
                  onClick={() => setEarPartId(part.id)}
                >
                  {index + 1}. {part.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sound path */}
      <section className="lesson-block" aria-labelledby="sound-title">
        <h3 id="sound-title">🔊 How we hear</h3>
        <p>Follow a sound from the air all the way to the brain.</p>
        <ol className="flow-track" aria-label="Sound path steps">
          {soundSteps.map((step, index) => (
            <li
              key={step.node}
              className={["flow-node", index === soundIndex ? "is-active" : ""].join(" ")}
            >
              {step.node}
            </li>
          ))}
        </ol>
        <p className="flow-status sound" role="status" aria-live="polite">
          <strong>
            {soundIndex + 1}. {soundStep.node}:
          </strong>{" "}
          {soundStep.text}
        </p>
        <div className="flow-controls">
          <button type="button" className="drill-check" onClick={() => setSoundPlaying((v) => !v)}>
            {soundPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            type="button"
            className="drill-hint"
            onClick={() => {
              setSoundPlaying(false);
              setSoundIndex((current) => (current + 1) % soundSteps.length);
            }}
          >
            Step
          </button>
          <button
            type="button"
            className="drill-next"
            onClick={() => {
              setSoundPlaying(false);
              setSoundIndex(0);
            }}
          >
            Reset
          </button>
        </div>
        <p className="lesson-key">
          The cochlea handles hearing; the semicircular canals keep your balance.
        </p>
      </section>

      {/* Loudness meter */}
      <section className="lesson-block" aria-labelledby="loud-title">
        <h3 id="loud-title">📊 How loud is too loud?</h3>
        <p>
          We hear sounds from <strong>20 Hz to 20,000 Hz</strong>. Very loud sounds damage
          the ear. Slide to see the risk.
        </p>
        <label className="slider-control" htmlFor="db-slider">
          <span>
            Loudness <strong>{db} dB</strong>
          </span>
          <input
            id="db-slider"
            type="range"
            min="0"
            max="140"
            step="5"
            value={db}
            onChange={(event) => setDb(Number(event.target.value))}
          />
        </label>
        <div className="db-meter" aria-hidden="true">
          <i className={`db-fill ${risk}`} style={{ width: `${(db / 140) * 100}%` }} />
        </div>
        <p className={`sense-status ${risk === "safe" ? "ok" : "no"}`} role="status" aria-live="polite">
          <strong>{riskLabel[risk]}.</strong>{" "}
          {risk === "safe" && "Comfortable for your ears."}
          {risk === "caution" && "Fine briefly, but tiring over long periods."}
          {risk === "dangerous" && "Long exposure damages hearing — use ear protection."}
          {risk === "harmful" && "Near the pain threshold — protect your ears now."}
        </p>
        <div className="db-scale">
          {dbExamples.map((example) => (
            <span key={example.db}>
              {example.db} dB · {example.label}
            </span>
          ))}
        </div>
      </section>

      <section className="lesson-finish">
        <p>Next, label the eye and ear, then diagnose patients in the Sense Clinic.</p>
        <button type="button" className="drill-check" onClick={finishLesson} disabled={finished}>
          {finished ? "Lesson complete ✅" : "Mark lesson complete"}
        </button>
      </section>
    </article>
  );
}
