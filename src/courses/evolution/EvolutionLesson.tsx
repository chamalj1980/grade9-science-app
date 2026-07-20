import { useState } from "react";
import {
  earthFacts,
  earthTheories,
  evidenceTypes,
  evolutionTerms,
  fossilFormation,
  lifeScientists,
  lifeTheories,
  livingFossils,
  naturalSelection,
  timelineRounds
} from "../../data/evolutionData";
import type { SectionViewProps } from "../section";

const lifeStages = timelineRounds.find((round) => round.id === "animals")!.order;

export function EvolutionLesson({ onProgress }: SectionViewProps) {
  const [lifeTheoryId, setLifeTheoryId] = useState("biochemical");
  const lifeTheory = lifeTheories.find((theory) => theory.id === lifeTheoryId);

  const [step, setStep] = useState(1);
  const fossilStep = fossilFormation.find((item) => item.step === step);

  const [finished, setFinished] = useState(false);

  function finishLesson() {
    setFinished(true);
    onProgress({ completed: true });
  }

  return (
    <article className="lesson">
      <header className="lesson-hero evolution evo-hero">
        <div className="evo-swirl" aria-hidden="true">
          <span className="es es1">🦠</span>
          <span className="es es2">🐟</span>
          <span className="es es3">🦖</span>
          <span className="es es4">🦅</span>
        </div>
        <p className="eyebrow">Lesson</p>
        <h2>The Evolutionary Process</h2>
        <p>
          <span aria-hidden="true">🧬</span> Every living thing around you is the result of
          a story billions of years long — from the birth of the Earth, to the first cell,
          to the huge variety of life today. Let's trace it.
        </p>
      </header>

      {/* 1 · Origin of the Earth */}
      <section className="lesson-block" aria-labelledby="earth-title">
        <h3 id="earth-title">🌍 How the Earth began</h3>
        <p>
          The Earth is about <strong>4.5 billion years</strong> old. Two scientific theories
          explain how it and the solar system formed.
        </p>
        <div className="theory-pair">
          {earthTheories.map((theory) => (
            <div key={theory.id} className="theory-card">
              <h4>
                <span aria-hidden="true">{theory.emoji}</span> {theory.name}
                <span className={`theory-tag ${theory.status}`}>
                  {theory.status === "first-scientific" ? "first scientific" : "modern theory"}
                </span>
              </h4>
              <p>{theory.summary}</p>
            </div>
          ))}
        </div>
        <div className="evo-facts">
          {earthFacts.map((fact) => (
            <div key={fact.id} className="evo-fact">
              <span className="ef-emoji" aria-hidden="true">
                {fact.emoji}
              </span>
              <div>
                <strong>{fact.title}</strong>
                <span>{fact.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2 · Origin of life */}
      <section className="lesson-block" aria-labelledby="life-title">
        <h3 id="life-title">🧪 How life began</h3>
        <p>
          Life appeared about <strong>3.5 billion years</strong> ago. Four theories tried to
          explain it — click each to see what it claimed and whether science accepts it.
        </p>

        <div className="part-buttons" role="group" aria-label="Theories of the origin of life">
          {lifeTheories.map((theory) => (
            <button
              key={theory.id}
              type="button"
              className={lifeTheoryId === theory.id ? "is-active" : ""}
              aria-pressed={lifeTheoryId === theory.id}
              onClick={() => setLifeTheoryId(theory.id)}
            >
              <span aria-hidden="true">{theory.emoji}</span> {theory.name}
            </button>
          ))}
        </div>

        {lifeTheory && (
          <div key={lifeTheory.id} className="part-panel evo-reveal" role="status" aria-live="polite">
            <h4>
              <span aria-hidden="true">{lifeTheory.emoji}</span> {lifeTheory.name}
              <span className={`theory-verdict ${lifeTheory.accepted ? "yes" : "no"}`}>
                {lifeTheory.accepted ? "✅ Accepted today" : "❌ Not accepted"}
              </span>
            </h4>
            <p className="lesson-key">{lifeTheory.claim}</p>
            <p>{lifeTheory.verdict}</p>
          </div>
        )}

        <div className="scientist-strip">
          {lifeScientists.map((scientist) => (
            <div key={scientist.name} className="scientist-card">
              <strong>{scientist.name}</strong>
              <span>{scientist.contribution}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3 · The march of life */}
      <section className="lesson-block" aria-labelledby="march-title">
        <h3 id="march-title">🐟 The march of life</h3>
        <p>
          The first life was a simple <strong>unicellular bacterium</strong>. Over billions
          of years, life grew more complex. This gradual change from simple to complex is{" "}
          <strong>evolution</strong>.
        </p>
        <ol className="march-strip" aria-label="The sequence of life, earliest first">
          {lifeStages.map((stage, index) => (
            <li key={stage.id} style={{ animationDelay: `${index * 0.12}s` }}>
              <span className="ms-emoji" aria-hidden="true">
                {stage.emoji}
              </span>
              <span className="ms-label">{stage.label}</span>
            </li>
          ))}
        </ol>
        <p className="sort-help">
          Humans evolved about 12 million years ago; modern humans about 5 million years ago.
        </p>
      </section>

      {/* 4 · Evidence */}
      <section className="lesson-block" aria-labelledby="evidence-title">
        <h3 id="evidence-title">🔎 The evidence for evolution</h3>
        <div className="evidence-grid">
          {evidenceTypes.map((evidence) => (
            <div key={evidence.id} className="evidence-card">
              <span className="ev-emoji" aria-hidden="true">
                {evidence.emoji}
              </span>
              <strong>{evidence.name}</strong>
              <span>{evidence.detail}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5 · Fossils */}
      <section className="lesson-block" aria-labelledby="fossil-title">
        <h3 id="fossil-title">🦴 Fossils — the record in the rock</h3>
        <p>
          A <strong>fossil</strong> is the preserved remains, part or trace of a dead
          organism, found in rock, ice, peat, volcanic ash or mud. Step through how a bone
          becomes a fossil.
        </p>

        <div className="fossil-stepper">
          <div className="fossil-stage" aria-hidden="true">
            <span className="fs-emoji">{fossilStep?.emoji}</span>
            <span className="fs-num">Step {step} of {fossilFormation.length}</span>
          </div>
          <div className="fossil-copy" role="status" aria-live="polite">
            <h4>{fossilStep?.title}</h4>
            <p>{fossilStep?.detail}</p>
            <div className="fossil-dots">
              {fossilFormation.map((item) => (
                <button
                  key={item.step}
                  type="button"
                  className={item.step === step ? "is-active" : ""}
                  aria-label={`Step ${item.step}`}
                  onClick={() => setStep(item.step)}
                />
              ))}
            </div>
            <button
              type="button"
              className="drill-next"
              onClick={() => setStep((s) => (s % fossilFormation.length) + 1)}
            >
              Next step →
            </button>
          </div>
        </div>

        <p className="lesson-key">
          In layered rock, the deepest layers are oldest — so the oldest fossils lie at the
          bottom. Radioactive carbon (¹⁴C) is used to find a fossil's age.
        </p>

        <h4 className="living-title">🐟 Living fossils</h4>
        <p>
          Some organisms have barely changed for millions of years — these are called{" "}
          <strong>living fossils</strong>.
        </p>
        <div className="living-grid">
          {livingFossils.map((fossil) => (
            <div key={fossil.id} className="living-card">
              <span className="lf-emoji" aria-hidden="true">
                {fossil.emoji}
              </span>
              <strong>{fossil.name}</strong>
              <span>{fossil.note}</span>
            </div>
          ))}
        </div>
        <p className="sort-help">
          The <strong>horse</strong> has a complete fossil record — its ancestor lived 54
          million years ago in North America, was dog-sized, and had three toes on its front
          legs.
        </p>
      </section>

      {/* 6 · Natural selection */}
      <section className="lesson-block" aria-labelledby="ns-title">
        <h3 id="ns-title">🏆 Natural selection &amp; bio-diversity</h3>
        <p>{naturalSelection}</p>
        <div className="darwin-card">
          <span className="dc-emoji" aria-hidden="true">👴</span>
          <div>
            <strong>Charles Darwin</strong> — the father of evolution — put forward the{" "}
            <strong>theory of natural selection</strong>, the accepted scientific
            explanation of how evolution works.
          </div>
        </div>
      </section>

      {/* 7 · Key terms */}
      <section className="lesson-block" aria-labelledby="terms-title">
        <h3 id="terms-title">📖 Key words</h3>
        <dl className="term-list">
          {evolutionTerms.map((item) => (
            <div key={item.term} className="term-row">
              <dt>{item.term}</dt>
              <dd>{item.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="lesson-finish">
        <p>Ready? Mark the lesson done, then build the timeline of life.</p>
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
