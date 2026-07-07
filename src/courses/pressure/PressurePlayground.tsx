import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent
} from "react";
import {
  createHalvePressureBaseline,
  createPressureReading,
  gaugeLowBandPercent,
  gaugeMediumBandPercent,
  getDentDepthPx,
  getPressureGaugePercent,
  getPressureLevel,
  pressureChallenges,
  validatePressureChallenge,
  type HalvePressureBaseline,
  type PressureChallengeId
} from "../../utils/pressureChallenges";
import type { SectionViewProps } from "../section";

const halveChallengeStart = createHalvePressureBaseline(300, 1);
const squareMetreUnit = "m\u00b2";

function formatNumber(value: number): string {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

function getGaugeLabel(level: ReturnType<typeof getPressureLevel>): string {
  if (level === "low") {
    return "Low pressure";
  }

  if (level === "medium") {
    return "Medium pressure";
  }

  return "High pressure";
}

function clampValue(value: number, min: number, max: number, decimals: number): number {
  const clampedValue = Math.min(max, Math.max(min, value));

  return Number(clampedValue.toFixed(decimals));
}

function handleSliderKeyDown(
  event: KeyboardEvent<HTMLInputElement>,
  currentValue: number,
  setValue: (value: number) => void,
  options: { min: number; max: number; step: number; decimals: number }
) {
  const largeStep = options.step * 10;
  const nextValueByKey: Record<string, number> = {
    ArrowDown: currentValue - options.step,
    ArrowLeft: currentValue - options.step,
    ArrowRight: currentValue + options.step,
    ArrowUp: currentValue + options.step,
    End: options.max,
    Home: options.min,
    PageDown: currentValue - largeStep,
    PageUp: currentValue + largeStep
  };
  const nextValue = nextValueByKey[event.key];

  if (nextValue === undefined) {
    return;
  }

  event.preventDefault();
  setValue(clampValue(nextValue, options.min, options.max, options.decimals));
}

export function PressurePlayground({ onProgress }: SectionViewProps) {
  const [forceN, setForceN] = useState(300);
  const [areaM2, setAreaM2] = useState(2);
  const [activeChallengeId, setActiveChallengeId] =
    useState<PressureChallengeId>("target-150");
  const [halveBaseline, setHalveBaseline] =
    useState<HalvePressureBaseline>(halveChallengeStart);
  // Remember which challenges have been solved so progress reflects "2/3" style completion.
  const [solvedIds, setSolvedIds] = useState<PressureChallengeId[]>([]);

  const reading = useMemo(
    () => createPressureReading(forceN, areaM2),
    [forceN, areaM2]
  );
  const activeChallenge = pressureChallenges.find(
    (challenge) => challenge.id === activeChallengeId
  );
  const feedback = validatePressureChallenge(
    activeChallengeId,
    reading,
    activeChallengeId === "halve-pressure" ? halveBaseline : undefined
  );
  const pressureLevel = getPressureLevel(reading.pressurePa);
  const dentDepth = getDentDepthPx(reading.pressurePa);
  const gaugePercent = getPressureGaugePercent(reading.pressurePa);
  // Contact footprint width tracks AREA (0.1–5 m² -> 72–192 px) so a bigger area
  // slider visibly widens the block; the dent DEPTH tracks pressure separately.
  const contactWidth = Math.round(72 + (areaM2 / 5) * 120);
  const visualStyle = {
    "--dent-depth": `${dentDepth}px`,
    "--block-shift": `${Math.round(dentDepth * 0.24)}px`,
    "--gauge-position": `${gaugePercent}%`,
    "--contact-width": `${contactWidth}px`,
    // colour-band edges derived from the same thresholds as the Low/Med/High label
    "--gauge-low": `${gaugeLowBandPercent}%`,
    "--gauge-med": `${gaugeMediumBandPercent}%`
  } as CSSProperties;

  // Lock in a challenge the moment the current reading satisfies it.
  useEffect(() => {
    if (feedback.isCorrect && !solvedIds.includes(activeChallengeId)) {
      setSolvedIds((previous) => [...previous, activeChallengeId]);
    }
  }, [feedback.isCorrect, activeChallengeId, solvedIds]);

  // Report progress upward: solved count out of the three challenges.
  useEffect(() => {
    onProgress({
      score: solvedIds.length,
      total: pressureChallenges.length,
      completed: solvedIds.length === pressureChallenges.length
    });
  }, [solvedIds, onProgress]);

  function selectChallenge(challengeId: PressureChallengeId) {
    setActiveChallengeId(challengeId);

    if (challengeId === "halve-pressure") {
      setForceN(halveChallengeStart.forceN);
      setAreaM2(halveChallengeStart.areaM2);
      setHalveBaseline(halveChallengeStart);
    }
  }

  return (
    <article className="pressure-playground" style={visualStyle}>
      <div className="playground-intro">
        <p className="eyebrow">Exercise 1</p>
        <h2>Pressure Playground</h2>
        <p>
          Change force and contact area. Watch how the pressure changes the dent
          in the soft surface.
        </p>
      </div>

      <div className="playground-grid">
        <section
          className="playground-panel controls-panel"
          aria-labelledby="controls-title"
        >
          <h3 id="controls-title">Controls</h3>

          <label className="slider-control" htmlFor="force-slider">
            <span>
              Force, F <strong>{forceN} N</strong>
            </span>
            <input
              id="force-slider"
              type="range"
              min="50"
              max="1000"
              step="10"
              value={forceN}
              onChange={(event) => setForceN(Number(event.target.value))}
              onKeyDown={(event) =>
                handleSliderKeyDown(event, forceN, setForceN, {
                  min: 50,
                  max: 1000,
                  step: 10,
                  decimals: 0
                })
              }
            />
          </label>

          <label className="slider-control" htmlFor="area-slider">
            <span>
              Contact area, A{" "}
              <strong>
                {formatNumber(areaM2)} {squareMetreUnit}
              </strong>
            </span>
            <input
              id="area-slider"
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={areaM2}
              onChange={(event) => setAreaM2(Number(event.target.value))}
              onKeyDown={(event) =>
                handleSliderKeyDown(event, areaM2, setAreaM2, {
                  min: 0.1,
                  max: 5,
                  step: 0.1,
                  decimals: 1
                })
              }
            />
          </label>

          <div className="formula-readout" aria-live="polite">
            <span>P = F / A</span>
            <strong>
              P = {forceN} N / {formatNumber(areaM2)} {squareMetreUnit} ={" "}
              {formatNumber(reading.pressurePa)} Pa
            </strong>
          </div>
        </section>

        <section
          className="playground-panel visual-panel"
          aria-labelledby="visual-title"
        >
          <div className="visual-heading">
            <h3 id="visual-title">Block on soft surface</h3>
            <strong>{getGaugeLabel(pressureLevel)}</strong>
          </div>

          <div className="sponge-scene" aria-label="A block pressing into a soft surface">
            <div className="force-arrow" aria-hidden="true" />
            <div className="pressure-block" aria-hidden="true">
              {forceN} N
            </div>
            <div className="sponge-surface" aria-hidden="true">
              <div className="dent" />
            </div>
          </div>

          <div
            className="pressure-gauge"
            aria-label={`Pressure gauge: ${getGaugeLabel(pressureLevel)}`}
          >
            <div className="gauge-track" aria-hidden="true">
              <span className="gauge-fill" />
              <span className="gauge-pointer" />
            </div>
            <div className="gauge-labels">
              <span className={pressureLevel === "low" ? "is-active" : ""}>Low</span>
              <span className={pressureLevel === "medium" ? "is-active" : ""}>
                Medium
              </span>
              <span className={pressureLevel === "high" ? "is-active" : ""}>High</span>
            </div>
          </div>
        </section>
      </div>

      <section
        className="playground-panel challenge-panel"
        aria-labelledby="challenge-title"
      >
        <div className="challenge-heading">
          <div>
            <h3 id="challenge-title">Mini-challenges</h3>
            <p>{activeChallenge?.goal}</p>
          </div>
          <p className="solved-count" aria-live="polite">
            Solved {solvedIds.length}/{pressureChallenges.length}
          </p>
          {activeChallengeId === "halve-pressure" && (
            <p className="baseline-note">
              Start: {halveBaseline.forceN} N, {formatNumber(halveBaseline.areaM2)}{" "}
              {squareMetreUnit}, {formatNumber(halveBaseline.pressurePa)} Pa
            </p>
          )}
        </div>

        <div className="challenge-tabs" aria-label="Choose a pressure challenge">
          {pressureChallenges.map((challenge) => (
            <button
              key={challenge.id}
              type="button"
              className={
                challenge.id === activeChallengeId
                  ? "challenge-tab is-active"
                  : "challenge-tab"
              }
              aria-pressed={challenge.id === activeChallengeId}
              onClick={() => selectChallenge(challenge.id)}
            >
              <span>
                {challenge.label}
                {solvedIds.includes(challenge.id) ? " ✅" : ""}
              </span>
              <strong>{challenge.goal}</strong>
            </button>
          ))}
        </div>

        <div
          className={feedback.isCorrect ? "feedback-panel is-correct" : "feedback-panel"}
          role="status"
          aria-live="polite"
        >
          <strong>{feedback.title}</strong>
          <p>{feedback.explanation}</p>
        </div>
      </section>
    </article>
  );
}