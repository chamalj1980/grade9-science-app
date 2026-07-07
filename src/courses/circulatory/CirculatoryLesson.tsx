import { useEffect, useState } from "react";
import { heartParts } from "../../data/heartParts";
import {
  aboGroups,
  compatibleAboDonors,
  type AboGroup
} from "../../utils/transfusion";
import { HeartFigure } from "./HeartFigure";
import type { SectionViewProps } from "../section";

// Correct blood-flow sequence (spec 20.3). Colour switches to red after the lungs.
interface FlowStep {
  node: string;
  oxygen: "poor" | "rich";
  text: string;
}

const flowSteps: FlowStep[] = [
  { node: "Body", oxygen: "poor", text: "Oxygen-poor blood returns from the body." },
  { node: "Vena cava", oxygen: "poor", text: "It enters through the superior and inferior vena cava." },
  { node: "Right atrium", oxygen: "poor", text: "It fills the right atrium." },
  { node: "Tricuspid valve", oxygen: "poor", text: "It passes the tricuspid valve." },
  { node: "Right ventricle", oxygen: "poor", text: "The right ventricle pushes it upward." },
  { node: "Pulmonary artery", oxygen: "poor", text: "The pulmonary artery carries it to the lungs." },
  { node: "Lungs", oxygen: "rich", text: "In the lungs it picks up oxygen and turns red." },
  { node: "Pulmonary veins", oxygen: "rich", text: "The pulmonary veins return it to the heart." },
  { node: "Left atrium", oxygen: "rich", text: "It fills the left atrium." },
  { node: "Bicuspid valve", oxygen: "rich", text: "It passes the bicuspid (mitral) valve." },
  { node: "Left ventricle", oxygen: "rich", text: "The strong left ventricle pushes it out." },
  { node: "Aorta", oxygen: "rich", text: "The aorta carries it to the whole body." }
];

export function CirculatoryLesson({ onProgress }: SectionViewProps) {
  const [selectedPartId, setSelectedPartId] = useState(heartParts[0].id);
  const selectedPart = heartParts.find((part) => part.id === selectedPartId);

  const [flowIndex, setFlowIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);

  // Auto-advance the flow while playing; loops back to the body.
  useEffect(() => {
    if (!playing) {
      return;
    }

    const timer = window.setInterval(() => {
      setFlowIndex((current) => (current + 1) % flowSteps.length);
    }, 1300);

    return () => window.clearInterval(timer);
  }, [playing]);

  const activeStep = flowSteps[flowIndex];

  function finishLesson() {
    setFinished(true);
    onProgress({ completed: true });
  }

  return (
    <article className="lesson">
      <header className="lesson-hero circulatory">
        <p className="eyebrow">Lesson</p>
        <h2>The Human Circulatory System</h2>
        <p>
          <span className="beating-heart" aria-hidden="true">
            ❤️
          </span>{" "}
          This muscle pumps about 100,000 times a day. Let's look inside.
        </p>
      </header>

      {/* Structure of the heart */}
      <section className="lesson-block" aria-labelledby="structure-title">
        <h3 id="structure-title">🫀 Structure of the heart</h3>
        <p>
          The heart has four chambers: two atria on top receive blood, two ventricles
          below pump it out. Click a marker or a name to learn about each part.
        </p>

        <div className="heart-explore">
          <HeartFigure title="Interactive heart section">
            {heartParts.map((part, index) => (
              <g
                key={part.id}
                className={
                  part.id === selectedPartId
                    ? "heart-hotspot is-active"
                    : "heart-hotspot"
                }
                role="button"
                tabIndex={0}
                aria-label={part.label}
                onClick={() => setSelectedPartId(part.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelectedPartId(part.id);
                  }
                }}
              >
                <circle cx={part.marker.x} cy={part.marker.y} r="12" />
                <text x={part.marker.x} y={part.marker.y + 4}>
                  {index + 1}
                </text>
              </g>
            ))}
          </HeartFigure>

          <div className="heart-info">
            <div className="part-panel" role="status" aria-live="polite">
              <h4>{selectedPart?.label}</h4>
              <p>{selectedPart?.short}</p>
            </div>
            <div className="part-buttons">
              {heartParts.map((part, index) => (
                <button
                  key={part.id}
                  type="button"
                  className={part.id === selectedPartId ? "is-active" : ""}
                  onClick={() => setSelectedPartId(part.id)}
                >
                  {index + 1}. {part.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blood flow animation */}
      <section className="lesson-block" aria-labelledby="flow-title">
        <h3 id="flow-title">🔄 Blood flow</h3>
        <p>
          Follow one trip around the heart. Blue means oxygen-poor blood; red means
          oxygen-rich blood.
        </p>

        <ol className="flow-track" aria-label="Blood flow steps">
          {flowSteps.map((step, index) => (
            <li
              key={step.node}
              className={[
                "flow-node",
                step.oxygen === "rich" ? "rich" : "poor",
                index === flowIndex ? "is-active" : ""
              ].join(" ")}
            >
              {step.node}
            </li>
          ))}
        </ol>

        <p className={`flow-status ${activeStep.oxygen}`} role="status" aria-live="polite">
          <strong>
            {flowIndex + 1}. {activeStep.node}:
          </strong>{" "}
          {activeStep.text}
        </p>

        <div className="flow-controls">
          <button type="button" className="drill-check" onClick={() => setPlaying((value) => !value)}>
            {playing ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            type="button"
            className="drill-hint"
            onClick={() => {
              setPlaying(false);
              setFlowIndex((current) => (current + 1) % flowSteps.length);
            }}
          >
            Step
          </button>
          <button
            type="button"
            className="drill-next"
            onClick={() => {
              setPlaying(false);
              setFlowIndex(0);
            }}
          >
            Reset
          </button>
        </div>
        <p className="lesson-key">
          The pulmonary artery carries oxygen-poor blood to the lungs; the pulmonary
          veins carry oxygen-rich blood back to the heart.
        </p>
      </section>

      {/* Vessels */}
      <section className="lesson-block" aria-labelledby="vessel-title">
        <h3 id="vessel-title">🩸 Blood vessels</h3>
        <div className="vessel-grid">
          <div className="vessel-card">
            <svg viewBox="0 0 100 100" role="img" aria-label="Artery cross-section">
              <circle cx="50" cy="50" r="42" fill="#f7b8c2" />
              <circle cx="50" cy="50" r="16" fill="#ffffff" />
            </svg>
            <h4>Artery</h4>
            <p>Carries blood away from the heart. Thick elastic walls, high pressure.</p>
          </div>
          <div className="vessel-card">
            <svg viewBox="0 0 100 100" role="img" aria-label="Vein cross-section">
              <circle cx="50" cy="50" r="42" fill="#bcd4f5" />
              <circle cx="50" cy="50" r="30" fill="#ffffff" />
              <path d="M20 50 h60 M34 44 v12 M66 44 v12" stroke="#2563eb" strokeWidth="3" fill="none" />
            </svg>
            <h4>Vein</h4>
            <p>Carries blood toward the heart. Thin walls, valves to stop backflow.</p>
          </div>
          <div className="vessel-card">
            <svg viewBox="0 0 100 100" role="img" aria-label="Capillary cross-section">
              <circle cx="50" cy="50" r="26" fill="#ffe0e6" />
              <circle cx="50" cy="50" r="20" fill="#ffffff" />
            </svg>
            <h4>Capillary</h4>
            <p>Walls one cell thick. Gases, nutrients, and wastes are exchanged here.</p>
          </div>
        </div>
        <p className="flow-chain">
          artery → arterioles → capillaries → venules → veins
        </p>
      </section>

      {/* Blood components */}
      <section className="lesson-block" aria-labelledby="blood-title">
        <h3 id="blood-title">🧪 What is in blood?</h3>
        <div className="blood-grid">
          <svg viewBox="0 0 200 200" role="img" aria-label="Blood is about 55% plasma and 45% corpuscles">
            <path d="M100 100 L100 15 A85 85 0 0 1 179 130 Z" fill="#f5d76e" />
            <path d="M100 100 L179 130 A85 85 0 1 1 100 15 Z" fill="#dc2626" />
            <text x="128" y="72" fontSize="11" fill="#5b4700">Plasma 55%</text>
            <text x="52" y="140" fontSize="11" fill="#ffffff">Cells 45%</text>
          </svg>
          <div className="blood-cards">
            <div className="blood-card"><strong>💧 Plasma (~55%)</strong><span>Liquid that transports dissolved substances.</span></div>
            <div className="blood-card"><strong>🔴 Red cells (erythrocytes)</strong><span>Carry oxygen using haemoglobin.</span></div>
            <div className="blood-card"><strong>⚪ White cells (leukocytes)</strong><span>Defend the body and make antibodies.</span></div>
            <div className="blood-card"><strong>🩹 Platelets</strong><span>Help blood clot. Dengue and leptospirosis can lower platelet count.</span></div>
          </div>
        </div>
      </section>

      {/* Transfusion */}
      <section className="lesson-block" aria-labelledby="transfuse-title">
        <h3 id="transfuse-title">🩸 Blood groups &amp; transfusion</h3>
        <p>
          There are four groups: A, B, AB, O. <strong>O is the universal donor</strong>{" "}
          and <strong>AB is the universal recipient</strong>. If bloods do not match,
          the red cells <strong>agglutinate</strong> (clump together).
        </p>
        <table className="compat-table">
          <caption>Who can receive from whom (ABO groups)</caption>
          <thead>
            <tr>
              <th scope="col">Recipient</th>
              <th scope="col">Can receive</th>
            </tr>
          </thead>
          <tbody>
            {aboGroups.map((group: AboGroup) => (
              <tr key={group}>
                <th scope="row">{group}</th>
                <td>{compatibleAboDonors[group].join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="lesson-key">
          Rhesus factor: Rh⁺ can receive Rh⁺ and Rh⁻; Rh⁻ can receive Rh⁻ only.
        </p>
      </section>

      <section className="lesson-finish">
        <p>Now try the exercises: label the heart, then run the transfusion lab.</p>
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
