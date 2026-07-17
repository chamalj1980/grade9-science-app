import { useMemo, useState } from "react";
import { AtomFigure } from "../../components/AtomFigure";
import {
  compoundFamilies,
  elements,
  molecules,
  originRules,
  particles,
  separationMethods,
  type SymbolOrigin
} from "../../data/matterElements";
import { mixtureExamples } from "../../data/matterSubstances";
import {
  elementForProtons,
  isNeutral,
  massNumber
} from "../../utils/matter";
import type { SectionViewProps } from "../section";

// The classification tree of chapter 3 — the spine of the whole lesson.
interface TreeNode {
  id: string;
  label: string;
  emoji: string;
  definition: string;
  examples: string;
}

const treeNodes: TreeNode[] = [
  {
    id: "pure",
    label: "Pure substances",
    emoji: "💎",
    definition:
      "Matter that contains only ONE constituent, with its own specific properties.",
    examples: "Aluminium, silver, copper, distilled water, carbon, sulphur, zinc, copper sulphate, sodium chloride"
  },
  {
    id: "mixture",
    label: "Mixtures",
    emoji: "🥣",
    definition:
      "Matter that contains TWO or more constituents, which can be separated again by physical methods.",
    examples: "Air, drinking water, salt solution, sea water, crude oil, fruit salad"
  },
  {
    id: "element",
    label: "Elements",
    emoji: "🔹",
    definition:
      "Pure substances that CANNOT be divided into simpler substances by physical or chemical methods. About 120 have been discovered.",
    examples: "Iron, sulphur, chlorine, silver, zinc, copper"
  },
  {
    id: "compound",
    label: "Compounds",
    emoji: "🔗",
    definition:
      "Pure substances formed by the CHEMICAL combination of two or more elements in a fixed ratio.",
    examples: "Sodium chloride (NaCl), copper sulphate (CuSO₄), glucose (C₆H₁₂O₆)"
  },
  {
    id: "homogeneous",
    label: "Homogeneous mixtures",
    emoji: "🥛",
    definition: "The composition is uniform right the way through the mixture.",
    examples: "Salt solution, sugar solution, sea water"
  },
  {
    id: "heterogeneous",
    label: "Heterogeneous mixtures",
    emoji: "🍨",
    definition: "The composition is NOT uniform — it changes from place to place.",
    examples: "Muddy water, mortar mixture, ice cream, fruit salad"
  }
];

const keyTerms: { term: string; meaning: string }[] = [
  { term: "Matter", meaning: "Anything that has mass and takes up space." },
  { term: "Pure substance", meaning: "Matter with only one constituent." },
  { term: "Element", meaning: "A pure substance made of only one kind of atom." },
  { term: "Compound", meaning: "Two or more elements chemically combined in a fixed ratio." },
  { term: "Mixture", meaning: "Two or more constituents that can be separated physically." },
  { term: "Atom", meaning: "The smallest particle of an element. From the Greek 'atomos' — cannot be divided." },
  { term: "Molecule", meaning: "A unit made by joining one or more atoms together." },
  { term: "Homo-atomic molecule", meaning: "A molecule made from atoms of the SAME kind, e.g. O₂." },
  { term: "Hetero-atomic molecule", meaning: "A molecule made from DIFFERENT atoms, e.g. H₂O." },
  { term: "Nucleus", meaning: "The tiny, positively charged centre of an atom, holding protons and neutrons." },
  { term: "Atomic number (Z)", meaning: "The number of protons — a unique property of each element." },
  { term: "Mass number (A)", meaning: "The number of protons + neutrons in the nucleus." }
];

export function MatterLesson({ onProgress }: SectionViewProps) {
  const [nodeId, setNodeId] = useState("pure");
  const node = treeNodes.find((candidate) => candidate.id === nodeId);

  const [origin, setOrigin] = useState<SymbolOrigin>("latin");
  const originElements = useMemo(
    () => elements.filter((element) => element.origin === origin),
    [origin]
  );

  const [particleId, setParticleId] = useState("proton");
  const particle = particles.find((candidate) => candidate.id === particleId);

  // Atom builder mini-sim
  const [protons, setProtons] = useState(6);
  const [neutrons, setNeutrons] = useState(6);
  const [electrons, setElectrons] = useState(6);
  const built = elementForProtons(protons);
  const neutral = isNeutral(protons, electrons);

  const [moleculeId, setMoleculeId] = useState("o2");
  const molecule = molecules.find((candidate) => candidate.id === moleculeId);

  const [finished, setFinished] = useState(false);

  function finishLesson() {
    setFinished(true);
    onProgress({ completed: true });
  }

  return (
    <article className="lesson">
      <header className="lesson-hero matter matter-hero">
        <div className="matter-orbits" aria-hidden="true">
          <span className="mo mo1" />
          <span className="mo mo2" />
          <span className="mo mo3" />
        </div>
        <p className="eyebrow">Lesson</p>
        <h2>Nature and Properties of Matter</h2>
        <p>
          <span aria-hidden="true">⚛️</span> Everything around you — the air, the sea,
          your pencil — is matter. Zoom in far enough and it is all built from a few
          kinds of unbelievably tiny particles. Let's sort it out, then build an atom.
        </p>
      </header>

      {/* 1 · Classification tree */}
      <section className="lesson-block" aria-labelledby="tree-title">
        <h3 id="tree-title">🌳 The family tree of matter</h3>
        <p>
          All matter splits into <strong>pure substances</strong> and{" "}
          <strong>mixtures</strong>. Click any branch to explore it.
        </p>

        <div className="matter-tree" role="group" aria-label="Classification of matter">
          <div className="mt-root">
            <span className="mt-node is-root">Matter</span>
          </div>
          <div className="mt-branch">
            {["pure", "mixture"].map((id) => {
              const branch = treeNodes.find((candidate) => candidate.id === id)!;
              return (
                <button
                  key={id}
                  type="button"
                  className={`mt-node ${nodeId === id ? "is-active" : ""}`}
                  aria-pressed={nodeId === id}
                  onClick={() => setNodeId(id)}
                >
                  <span aria-hidden="true">{branch.emoji}</span> {branch.label}
                </button>
              );
            })}
          </div>
          <div className="mt-branch mt-leaves">
            {["element", "compound", "homogeneous", "heterogeneous"].map((id) => {
              const leaf = treeNodes.find((candidate) => candidate.id === id)!;
              return (
                <button
                  key={id}
                  type="button"
                  className={`mt-node is-leaf ${nodeId === id ? "is-active" : ""}`}
                  aria-pressed={nodeId === id}
                  onClick={() => setNodeId(id)}
                >
                  <span aria-hidden="true">{leaf.emoji}</span> {leaf.label}
                </button>
              );
            })}
          </div>
        </div>

        {node && (
          <div key={node.id} className="part-panel matter-reveal" role="status" aria-live="polite">
            <h4>
              <span aria-hidden="true">{node.emoji}</span> {node.label}
            </h4>
            <p className="lesson-key">{node.definition}</p>
            <p className="microbe-examples-label">Examples:</p>
            <p>{node.examples}</p>
          </div>
        )}
      </section>

      {/* 2 · Element symbols */}
      <section className="lesson-block" aria-labelledby="symbols-title">
        <h3 id="symbols-title">🔤 Why is gold called Au?</h3>
        <p>
          Every country uses the same symbols for elements. There are three ways a symbol
          is made — pick one to see the elements that follow that rule.
        </p>

        <div className="part-buttons" role="group" aria-label="Symbol rules">
          {(Object.keys(originRules) as SymbolOrigin[]).map((key) => (
            <button
              key={key}
              type="button"
              className={origin === key ? "is-active" : ""}
              aria-pressed={origin === key}
              onClick={() => setOrigin(key)}
            >
              <span aria-hidden="true">{originRules[key].emoji}</span>{" "}
              {originRules[key].title}
            </button>
          ))}
        </div>

        <p className="lesson-key matter-reveal" key={origin}>
          {originRules[origin].rule}
        </p>

        <div className="symbol-grid">
          {originElements.map((element) => (
            <div key={element.symbol} className="symbol-tile">
              <span className="st-symbol">{element.symbol}</span>
              <span className="st-name">{element.name}</span>
              {element.latin && <span className="st-latin">from “{element.latin}”</span>}
            </div>
          ))}
        </div>
        <p className="sort-help">
          A single-letter symbol is always a CAPITAL. In a two-letter symbol the second
          letter is always small — that is why it is <strong>Cl</strong>, never “CL”.
        </p>
      </section>

      {/* 3 · Inside the atom */}
      <section className="lesson-block" aria-labelledby="atom-title">
        <h3 id="atom-title">⚛️ Inside an atom</h3>
        <p>
          <strong>John Dalton</strong> first used the word <em>atom</em> — from the Greek{" "}
          <em>atomos</em>, “cannot be divided”. Later <strong>Ernest Rutherford</strong>{" "}
          discovered the surprise: most of an atom is <strong>empty space</strong>, with
          almost all its mass packed into a tiny, positively charged{" "}
          <strong>nucleus</strong>.
        </p>

        <div className="part-buttons" role="group" aria-label="Subatomic particles">
          {particles.map((item) => (
            <button
              key={item.id}
              type="button"
              className={particleId === item.id ? "is-active" : ""}
              aria-pressed={particleId === item.id}
              onClick={() => setParticleId(item.id)}
            >
              {item.name}
            </button>
          ))}
        </div>

        {particle && (
          <div key={particle.id} className="part-panel matter-reveal" role="status" aria-live="polite">
            <h4>{particle.name}</h4>
            <div className="particle-stats">
              <div>
                <strong>{particle.location}</strong>
                <span>Location</span>
              </div>
              <div>
                <strong>{particle.mass}</strong>
                <span>Mass (vs proton)</span>
              </div>
              <div>
                <strong>{particle.charge}</strong>
                <span>Charge</span>
              </div>
            </div>
            <p>{particle.fact}</p>
          </div>
        )}
      </section>

      {/* 4 · Atom builder mini-sim */}
      <section className="lesson-block" aria-labelledby="builder-title">
        <h3 id="builder-title">🔧 Build an atom</h3>
        <p>
          Change the particles and watch what happens. Remember:{" "}
          <strong>the protons decide which element you have</strong>.
        </p>

        <div className="atom-lab">
          <AtomFigure
            protons={protons}
            neutrons={neutrons}
            electrons={electrons}
            title={`Atom with ${protons} protons, ${neutrons} neutrons and ${electrons} electrons`}
          />

          <div className="atom-controls">
            {[
              { label: "Protons", value: protons, set: setProtons, cls: "p" },
              { label: "Neutrons", value: neutrons, set: setNeutrons, cls: "n" },
              { label: "Electrons", value: electrons, set: setElectrons, cls: "e" }
            ].map((row) => (
              <div key={row.label} className={`atom-row ${row.cls}`}>
                <span className="ar-label">
                  <span className="ar-dot" aria-hidden="true" /> {row.label}
                </span>
                <div className="ar-buttons">
                  <button
                    type="button"
                    onClick={() => row.set(Math.max(0, row.value - 1))}
                    aria-label={`Remove one ${row.label.slice(0, -1).toLowerCase()}`}
                  >
                    −
                  </button>
                  <span className="ar-value">{row.value}</span>
                  <button
                    type="button"
                    onClick={() => row.set(Math.min(20, row.value + 1))}
                    aria-label={`Add one ${row.label.slice(0, -1).toLowerCase()}`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="atom-readout" role="status" aria-live="polite">
              <div className="atom-notation" aria-hidden="true">
                <span className="an-mass">{massNumber(protons, neutrons)}</span>
                <span className="an-z">{protons}</span>
                <span className="an-symbol">{built ? built.symbol : "?"}</span>
              </div>
              <div className="atom-facts">
                <p>
                  <strong>Atomic number (Z) = {protons}</strong> — the number of protons.
                </p>
                <p>
                  <strong>
                    Mass number (A) = {protons} + {neutrons} = {massNumber(protons, neutrons)}
                  </strong>{" "}
                  — protons + neutrons.
                </p>
                <p className={built ? "lesson-key" : "note-hint"}>
                  {built
                    ? `You have built ${built.name}!`
                    : protons === 0
                      ? "With no protons there is no element at all."
                      : "No element in our table has that many protons."}
                </p>
                <p className={neutral ? "atom-ok" : "atom-warn"}>
                  {neutral
                    ? "⚖️ Neutral atom — protons and electrons are equal."
                    : `⚠️ Not neutral — ${protons} protons but ${electrons} electrons.`}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="sort-help">
          The standard way to write it puts the mass number at the top-left and the atomic
          number at the bottom-left of the symbol — like ²³₁₁Na for sodium.
        </p>
      </section>

      {/* 5 · Molecules */}
      <section className="lesson-block" aria-labelledby="mol-title">
        <h3 id="mol-title">🧩 Atoms join into molecules</h3>
        <p>
          A <strong>molecule</strong> is a unit made of joined atoms. If the atoms are the
          same it is <strong>homo-atomic</strong> (still an element). If they are
          different it is <strong>hetero-atomic</strong> — a compound.
        </p>

        <div className="part-buttons" role="group" aria-label="Molecules">
          {molecules.map((item) => (
            <button
              key={item.id}
              type="button"
              className={moleculeId === item.id ? "is-active" : ""}
              aria-pressed={moleculeId === item.id}
              onClick={() => setMoleculeId(item.id)}
            >
              {item.formula}
            </button>
          ))}
        </div>

        {molecule && (
          <div key={molecule.id} className="part-panel matter-reveal" role="status" aria-live="polite">
            <h4>
              {molecule.name} — {molecule.formula}{" "}
              <span className={`mol-tag ${molecule.kind}`}>
                {molecule.kind === "homo" ? "homo-atomic · element" : "hetero-atomic · compound"}
              </span>
            </h4>
            <div className="mol-atoms" aria-hidden="true">
              {molecule.atoms.flatMap((atom) =>
                Array.from({ length: atom.count }).map((_, index) => (
                  <span key={`${atom.symbol}-${index}`} className={`mol-atom a-${atom.symbol}`}>
                    {atom.symbol}
                  </span>
                ))
              )}
            </div>
            <p>{molecule.note}</p>
          </div>
        )}

        <div className="family-note">
          <h4>The same elements can build very different compounds</h4>
          {compoundFamilies.map((family) => (
            <div key={family.elements} className="family-row">
              <span className="family-label">{family.elements}</span>
              <ul>
                {family.members.map((member) => (
                  <li key={member.formula}>
                    <strong>{member.formula}</strong> {member.name} — {member.use}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 6 · Mixtures */}
      <section className="lesson-block" aria-labelledby="mix-title">
        <h3 id="mix-title">🥣 Mixtures — mixed, not joined</h3>
        <p>
          In a mixture the constituents keep their own properties and can be separated
          again by <strong>physical methods</strong>. Most things around us — air, soil,
          sea water, ice cream — are mixtures.
        </p>

        <div className="mix-columns">
          <div className="mix-col uniform">
            <h4>🥛 Homogeneous — same throughout</h4>
            <ul>
              {mixtureExamples
                .filter((example) => example.uniform)
                .map((example) => (
                  <li key={example.id}>
                    <strong>
                      <span aria-hidden="true">{example.emoji}</span> {example.label}
                    </strong>
                    <span>{example.reason}</span>
                  </li>
                ))}
            </ul>
          </div>
          <div className="mix-col varied">
            <h4>🍨 Heterogeneous — different from place to place</h4>
            <ul>
              {mixtureExamples
                .filter((example) => !example.uniform)
                .map((example) => (
                  <li key={example.id}>
                    <strong>
                      <span aria-hidden="true">{example.emoji}</span> {example.label}
                    </strong>
                    <span>{example.reason}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>

        <h4 className="sep-title">Separating the constituents</h4>
        <div className="sep-grid">
          {separationMethods.map((item) => (
            <div key={item.method} className="sep-card">
              <span className="sep-emoji" aria-hidden="true">
                {item.emoji}
              </span>
              <strong>{item.method}</strong>
              <span>{item.use}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7 · Key terms */}
      <section className="lesson-block" aria-labelledby="terms-title">
        <h3 id="terms-title">📖 Key words</h3>
        <dl className="term-list">
          {keyTerms.map((item) => (
            <div key={item.term} className="term-row">
              <dt>{item.term}</dt>
              <dd>{item.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="lesson-finish">
        <p>Got it? Mark the lesson done, then go and build some atoms.</p>
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
