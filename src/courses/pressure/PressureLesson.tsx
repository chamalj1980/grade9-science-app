import { useMemo, useState, type CSSProperties } from "react";
import { calculatePressure } from "../../utils/pressure";
import type { SectionViewProps } from "../section";

const squareMetre = "m²";

// Strap width slider (1 = narrow, 10 = broad) mapped to a contact area in m².
function strapAreaFromWidth(width: number): number {
  return 0.002 + (width - 1) * 0.002; // 0.002 m² (narrow) up to 0.020 m² (broad)
}

export function PressureLesson({ onProgress }: SectionViewProps) {
  // Hook: school bag
  const [bagWeight, setBagWeight] = useState(80);
  const [strapWidth, setStrapWidth] = useState(3);
  const strapArea = strapAreaFromWidth(strapWidth);
  const shoulderPressure = Math.round(calculatePressure(bagWeight, strapArea));
  // Comfort falls as pressure rises; clamped to 0-100 for the meter.
  const comfort = Math.max(
    0,
    Math.min(100, Math.round(100 - shoulderPressure / 600))
  );
  const comfortLabel = comfort > 66 ? "Comfy" : comfort > 33 ? "Okay" : "Ouch!";

  // Factor 1: soap and wire
  const [sandBags, setSandBags] = useState(2);
  const wireForce = sandBags * 50; // 50 N per sand bag
  const cutTime = Math.round((600 / wireForce) * 10) / 10; // more force -> less time

  // Factor 2: block on sponge
  const [smallFace, setSmallFace] = useState(false);

  // Worked examples reveal
  const [showExample1, setShowExample1] = useState(false);
  const [showExample2, setShowExample2] = useState(false);

  const [finished, setFinished] = useState(false);

  const comfortStyle = useMemo(
    () => ({ "--comfort": `${comfort}%` }) as CSSProperties,
    [comfort]
  );

  // Derived values that drive the lesson's SVG animations.
  const strapVizWidth = 12 + strapWidth * 8; // broader strap = wider band
  const faceEmoji = comfort > 66 ? "🙂" : comfort > 33 ? "😐" : "😣";
  const cutDepth = Math.min(52, sandBags * 6); // more sand bags = deeper cut

  function finishLesson() {
    setFinished(true);
    onProgress({ completed: true });
  }

  return (
    <article className="lesson">
      <header className="lesson-hero pressure">
        <p className="eyebrow">Lesson</p>
        <h2>Pressure Exerted by Solids</h2>
        <p>
          Why does a thin strap dig into your shoulder, but a broad one feels fine?
          The same weight can make very different <strong>pressure</strong>. Let's
          find out how.
        </p>
      </header>

      {/* Hook: school bag */}
      <section className="lesson-block" aria-labelledby="hook-title">
        <h3 id="hook-title">🎒 The school bag</h3>
        <p>
          Change the bag's weight and the strap's width. Watch the pressure on the
          shoulder and the comfort meter.
        </p>

        <div className="lesson-controls">
          <label className="slider-control" htmlFor="bag-weight">
            <span>
              Bag weight (force) <strong>{bagWeight} N</strong>
            </span>
            <input
              id="bag-weight"
              type="range"
              min="20"
              max="140"
              step="10"
              value={bagWeight}
              onChange={(event) => setBagWeight(Number(event.target.value))}
            />
          </label>
          <label className="slider-control" htmlFor="strap-width">
            <span>
              Strap width <strong>{strapWidth <= 3 ? "narrow" : strapWidth <= 7 ? "medium" : "broad"}</strong>
            </span>
            <input
              id="strap-width"
              type="range"
              min="1"
              max="10"
              step="1"
              value={strapWidth}
              onChange={(event) => setStrapWidth(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="hook-stage">
          {/* Shoulder + strap: the strap band widens with the slider and the face
              reacts to the pressure. */}
          <svg
            className="lesson-svg"
            viewBox="0 0 220 170"
            role="img"
            aria-label={`Shoulder carrying the bag. Comfort: ${comfortLabel}.`}
          >
            <rect x="0" y="118" width="220" height="52" fill="#f0d9c4" />
            <ellipse cx="110" cy="118" rx="72" ry="26" fill="#f6c9a0" />
            <rect
              x={110 - strapVizWidth / 2}
              y="18"
              width={strapVizWidth}
              height="104"
              rx="8"
              fill="#4a5b70"
            />
            <text x="110" y="104" fontSize="34" textAnchor="middle">
              {faceEmoji}
            </text>
          </svg>

          <div className="lesson-readout" style={comfortStyle}>
            <p>
              Shoulder pressure:{" "}
              <strong>{shoulderPressure.toLocaleString()} Pa</strong>
            </p>
            <div className="comfort-meter" aria-hidden="true">
              <span />
            </div>
            <p className="comfort-label">
              Comfort: <strong>{comfortLabel}</strong>
            </p>
          </div>
        </div>

        <p className="lesson-key">
          Same force + smaller area = higher pressure. Same force + larger area =
          lower pressure.
        </p>
      </section>

      {/* Factor 1: force */}
      <section className="lesson-block" aria-labelledby="force-title">
        <h3 id="force-title">1️⃣ Factor one: force</h3>
        <p>
          In the soap-and-wire activity, a wire rests on soap. Adding sand bags adds{" "}
          <strong>force</strong>. More force means more pressure, so the wire cuts
          faster.
        </p>
        <div className="factor-stage">
          <div>
            <label className="slider-control" htmlFor="sand-bags">
              <span>
                Sand bags <strong>{sandBags}</strong>
              </span>
              <input
                id="sand-bags"
                type="range"
                min="1"
                max="8"
                step="1"
                value={sandBags}
                onChange={(event) => setSandBags(Number(event.target.value))}
              />
            </label>
            <div className="factor-readout">
              <span>
                Force ≈ <strong>{wireForce} N</strong>
              </span>
              <span>
                Cutting time ≈ <strong>{cutTime} s</strong>
              </span>
            </div>
          </div>

          {/* Soap + wire: sand bags stack up and the wire cuts deeper into the soap. */}
          <svg
            className="lesson-svg"
            viewBox="0 0 220 170"
            role="img"
            aria-label={`${sandBags} sand bags press the wire into the soap. Cutting time about ${cutTime} seconds.`}
          >
            <rect x="40" y="95" width="140" height="52" rx="6" fill="#f6e2a8" stroke="#e3c766" />
            {/* the cut the wire makes, growing with force */}
            <rect x="108" y="95" width="4" height={cutDepth} fill="#fff" />
            {/* the wire */}
            <line x1="110" y1="30" x2="110" y2="95" stroke="#8a99ad" strokeWidth="2" />
            {/* stack of sand bags on the wire */}
            {Array.from({ length: sandBags }).map((_, index) => (
              <rect
                key={index}
                x="98"
                y={84 - index * 9}
                width="24"
                height="8"
                rx="2"
                fill="#c99a5b"
                stroke="#a97c3f"
              />
            ))}
            {/* label painted last so the cut bar never covers it */}
            <text x="110" y="140" fontSize="12" textAnchor="middle" fill="#8a6d1e">
              SOAP
            </text>
          </svg>
        </div>
        <p className="lesson-key">
          When area is kept constant, pressure increases as force increases.
        </p>
      </section>

      {/* Factor 2: area */}
      <section className="lesson-block" aria-labelledby="area-title">
        <h3 id="area-title">2️⃣ Factor two: area</h3>
        <p>
          Now the same wooden block rests on a sponge. The weight does not change —
          only the face touching the sponge. A smaller face squashes the sponge more.
        </p>
        <div className="face-toggle" role="group" aria-label="Choose the contact face">
          <button
            type="button"
            aria-pressed={!smallFace}
            className={!smallFace ? "is-active" : ""}
            onClick={() => setSmallFace(false)}
          >
            Large face (big area)
          </button>
          <button
            type="button"
            aria-pressed={smallFace}
            className={smallFace ? "is-active" : ""}
            onClick={() => setSmallFace(true)}
          >
            Small face (small area)
          </button>
        </div>
        <div className={`sponge-demo ${smallFace ? "small" : "large"}`}>
          <div className="sponge-block" aria-hidden="true" />
          <div className="sponge-pad" aria-hidden="true">
            <span className="sponge-dent" />
          </div>
          <p>
            {smallFace
              ? "Small area → the same weight makes higher pressure → a deep dent."
              : "Large area → the same weight makes lower pressure → a shallow dent."}
          </p>
        </div>
        <p className="lesson-key">
          When force is kept constant, pressure increases as area decreases.
        </p>
      </section>

      {/* Definition + formula */}
      <section className="lesson-block highlight" aria-labelledby="def-title">
        <h3 id="def-title">💡 What is pressure?</h3>
        <p className="definition">
          Pressure is the perpendicular force acting on a unit area.
        </p>
        <p className="formula-big">P = F / A</p>
        <ul>
          <li>
            <strong>Perpendicular</strong> means acting at right angles to the surface.
          </li>
          <li>
            <strong>Unit area</strong> means one square metre when we use SI units.
          </li>
        </ul>
      </section>

      {/* Units */}
      <section className="lesson-block" aria-labelledby="units-title">
        <h3 id="units-title">📏 The unit: the pascal</h3>
        <p>
          Dividing newtons by square metres gives the unit of pressure:
        </p>
        <p className="formula-big">
          N ÷ {squareMetre} = Nm⁻² = Pa
        </p>
        <p className="lesson-key">1 Nm⁻² = 1 Pa</p>
        <p>
          The pascal is the SI unit of pressure. It is named after{" "}
          <strong>Blaise Pascal</strong>, a scientist who studied pressure.
        </p>
      </section>

      {/* Worked examples */}
      <section className="lesson-block" aria-labelledby="examples-title">
        <h3 id="examples-title">✏️ Worked examples</h3>

        <div className="worked-example">
          <p>
            <strong>Example 1.</strong> A force of 300 N acts on an area of 2{" "}
            {squareMetre}. Find the pressure.
          </p>
          {showExample1 ? (
            <ol>
              <li>P = F / A</li>
              <li>P = 300 N / 2 {squareMetre}</li>
              <li>P = 150 Nm⁻² = 150 Pa</li>
            </ol>
          ) : (
            <button type="button" onClick={() => setShowExample1(true)}>
              Show solution
            </button>
          )}
        </div>

        <div className="worked-example">
          <p>
            <strong>Example 2.</strong> A box exerts a pressure of 200 Pa with a
            force of 400 N. Find the contact area.
          </p>
          {showExample2 ? (
            <ol>
              <li>P = F / A, so A = F / P</li>
              <li>A = 400 N / 200 Pa</li>
              <li>A = 2 {squareMetre}</li>
            </ol>
          ) : (
            <button type="button" onClick={() => setShowExample2(true)}>
              Show solution
            </button>
          )}
        </div>
      </section>

      {/* Everyday connections */}
      <section className="lesson-block" aria-labelledby="everyday-title">
        <h3 id="everyday-title">🌍 Pressure in everyday life</h3>
        <div className="everyday-grid">
          <div className="everyday-col increase">
            <h4>⬆ Increasing pressure</h4>
            <p className="everyday-note">Small area or large force.</p>
            <ul>
              <li>🔪 Sharp knife</li>
              <li>⛸️ Ice-skate blade</li>
              <li>🧵 Thin cutting wire</li>
              <li>📌 Drawing pin</li>
              <li>👠 High heel</li>
            </ul>
          </div>
          <div className="everyday-col decrease">
            <h4>⬇ Decreasing pressure</h4>
            <p className="everyday-note">Large area or small force.</p>
            <ul>
              <li>🎒 Broad bag strap</li>
              <li>🚚 Truck with many wheels</li>
              <li>🐫 Camel's wide feet</li>
              <li>🚜 Tractor's wide tyres</li>
              <li>👟 Flat shoe</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Finish */}
      <section className="lesson-finish">
        <p>Ready to practise? Mark the lesson complete, then try the exercises.</p>
        <button
          type="button"
          className="drill-check"
          onClick={finishLesson}
          disabled={finished}
        >
          {finished ? "Lesson complete ✅" : "Mark lesson complete"}
        </button>
      </section>
    </article>
  );
}
