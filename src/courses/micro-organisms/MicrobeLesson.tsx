import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { microbeGroups } from "../../data/microbeGroups";
import { MicrobeFigure } from "./MicrobeFigure";
import type { SectionViewProps } from "../section";

// Fixed colony positions inside the petri dish (viewBox 0 0 160 160, dish radius ~64).
// Precomputed once so colonies appear in stable spots as the population grows.
const colonySpots = Array.from({ length: 26 }).map((_, i) => {
  const angle = i * 2.399963; // golden-angle spiral → even, natural-looking spread
  const radius = 8 + Math.sqrt(i) * 11;
  return {
    x: 80 + Math.cos(angle) * radius,
    y: 80 + Math.sin(angle) * radius,
    r: 3 + (i % 3)
  };
});

// Temperature steps 1–4 (cold → hot). Warm is best for growth; too hot slows it again.
const tempFactors = [0, 0.15, 0.55, 1, 0.4];
const tempLabels = ["", "Cold ❄️", "Cool", "Warm 🌡️", "Hot 🔥"];

// The four fields where micro-organisms help us (textbook section 1.3.1). Kept inline as
// lesson narrative, the same way the other lessons keep their step lists in the component.
interface BeneficialField {
  id: string;
  label: string;
  emoji: string;
  points: string[];
}

const beneficialFields: BeneficialField[] = [
  {
    id: "agriculture",
    label: "Agriculture",
    emoji: "🌾",
    points: [
      "Rhizobium in legume root nodules and free-living Azotobacter fix atmospheric nitrogen, enriching the soil.",
      "Bacteria and fungi decompose organic matter into compost that adds minerals to the soil.",
      "Bio-pesticides such as the fungus Alternaria control weeds and pests.",
      "Gene technology builds better crops — e.g. golden rice enriched with vitamin A."
    ]
  },
  {
    id: "medicine",
    label: "Medicine",
    emoji: "💊",
    points: [
      "Antibiotics are chemicals made by one microbe to destroy another; penicillin comes from the fungus Penicillium notatum.",
      "Antibiotics kill bacteria and fungi but do NOT work against viruses.",
      "Vaccines are made from weakened, killed, or toxin forms of a microbe to prevent disease.",
      "Anti-toxins are made from microbe toxins with the toxic part removed (e.g. for tetanus)."
    ]
  },
  {
    id: "industry",
    label: "Industry",
    emoji: "🏭",
    points: [
      "Yeast (Saccharomyces) is used in the bakery industry and to make alcohol.",
      "Lactobacillus and Streptococcus make yoghurt, curd, cheese, and butter.",
      "Acetobacter makes vinegar; anaerobic bacteria make biogas (methane) for energy.",
      "Microbes extract metals like copper and uranium (bio-leaching) and separate plant fibres."
    ]
  },
  {
    id: "environment",
    label: "Environment",
    emoji: "🌍",
    points: [
      "Bio-remediation uses microbes to remove pollutants from the environment.",
      "Microbes decompose organic waste in polluted water.",
      "Pseudomonas breaks down the hydrocarbons in ocean oil spills.",
      "Bacteria help make bio-degradable plastics and strip heavy metals (Cr, Pb, Hg) from water."
    ]
  }
];

const keyTerms: { term: string; detail: string }[] = [
  { term: "Micro-organism", detail: "A unicellular or multicellular organism that cannot be seen clearly with the naked eye." },
  { term: "Substrate", detail: "The surface or material on which a microbe grows, such as skin, meat, or moist bread." },
  { term: "Nitrogen fixation", detail: "Converting atmospheric nitrogen into a form plants can use, done by bacteria such as Rhizobium." },
  { term: "Antibiotic", detail: "A chemical made in a microbe's body to destroy or sabotage another micro-organism." },
  { term: "Bio-remediation", detail: "Using micro-organisms to remove pollutants from the environment." },
  { term: "Bio-leaching", detail: "Extracting metals from low-grade ores using microbes." },
  { term: "Pathogen", detail: "A micro-organism that has the potential to cause a disease." },
  { term: "Vector", detail: "An organism, such as a mosquito or fly, that carries a pathogen to a host." },
  { term: "Host", detail: "An organism whose body provides the substrate for a pathogen to grow." }
];

export function MicrobeLesson({ onProgress }: SectionViewProps) {
  const [selectedGroupId, setSelectedGroupId] = useState(microbeGroups[0].id);
  const selectedGroup = microbeGroups.find((group) => group.id === selectedGroupId);

  const [selectedFieldId, setSelectedFieldId] = useState(beneficialFields[0].id);
  const selectedField = beneficialFields.find((field) => field.id === selectedFieldId);

  // ---- Culture-lab growth mini-sim ----
  const [temp, setTemp] = useState(3); // 1 cold … 4 hot
  const [food, setFood] = useState(3); // 1 low … 4 high nutrients/moisture
  const [incubating, setIncubating] = useState(false);
  const [population, setPopulation] = useState(4);

  const rate = tempFactors[temp] * (food / 4);

  // Logistic growth toward a full dish while "incubating"; speed set by the sliders.
  useEffect(() => {
    if (!incubating) {
      return;
    }
    const timer = window.setInterval(() => {
      setPopulation((current) =>
        Math.min(100, current + rate * 7 * (1.05 - current / 100) + rate * 0.5)
      );
    }, 200);
    return () => window.clearInterval(timer);
  }, [incubating, rate]);

  const colonyCount = Math.round((population / 100) * colonySpots.length);
  const growthStyle = useMemo(
    () => ({ "--growth": `${Math.round(population)}%` }) as CSSProperties,
    [population]
  );
  const speedLabel =
    rate > 0.7 ? "Fast" : rate > 0.35 ? "Medium" : rate > 0.1 ? "Slow" : "Almost none";
  const cultureMessage =
    temp === 1
      ? "Cold slows microbes right down — this is why we keep food in the fridge."
      : temp === 4
        ? "Very hot conditions also slow or kill many microbes — a reason we cook and boil food."
        : food <= 1
          ? "With few nutrients, microbes grow slowly. Dry, low-nutrient food keeps longer."
          : "Warm, moist and full of nutrients — microbes multiply fast. Great for industry, but it's also why food spoils quickly.";

  const [finished, setFinished] = useState(false);

  function finishLesson() {
    setFinished(true);
    onProgress({ completed: true });
  }

  return (
    <article className="lesson">
      <header className="lesson-hero microbes microbe-hero">
        <div className="microbe-swarm" aria-hidden="true">
          <span className="mb mb1">🦠</span>
          <span className="mb mb2">🍄</span>
          <span className="mb mb3">🐛</span>
          <span className="mb mb4">🌿</span>
          <span className="mb mb5">🧬</span>
        </div>
        <p className="eyebrow">Lesson</p>
        <h2>Applications of Micro-organisms</h2>
        <p>
          <span aria-hidden="true">🦠</span> They are far too small to see, yet microbes
          live in soil, water, the air up to about 6 km high, and even inside your body.
          Most are helpful — a few cause trouble. Let's meet them.
        </p>
      </header>

      {/* Where microbes live */}
      <section className="lesson-block" aria-labelledby="where-title">
        <h3 id="where-title">🌏 Microbes are everywhere</h3>
        <p>
          Micro-organisms live in every ecosystem on Earth. They grow on meat, fish,
          fruits, and vegetables, and on human skin, mouth, and the alimentary canal.
          Some even survive extreme places like hot water springs, salt marshes, and
          liquids such as petrol and diesel.
        </p>
        <p className="lesson-key">
          They grow fast, reproduce quickly, and adapt to almost any environment.
        </p>
      </section>

      {/* Category explorer */}
      <section className="lesson-block" aria-labelledby="groups-title">
        <h3 id="groups-title">🔬 Meet the five groups</h3>
        <p>
          Micro-organisms are grouped into bacteria, fungi, protozoa, and algae. Viruses
          show both living and non-living characteristics, so they are studied here too.
          Click a group to explore it.
        </p>

        <div className="part-buttons" role="group" aria-label="Micro-organism groups">
          {microbeGroups.map((group) => (
            <button
              key={group.id}
              type="button"
              className={group.id === selectedGroupId ? "is-active" : ""}
              aria-pressed={group.id === selectedGroupId}
              onClick={() => setSelectedGroupId(group.id)}
            >
              <span aria-hidden="true">{group.emoji}</span> {group.name}
            </button>
          ))}
        </div>

        {selectedGroup && (
          <div className="microbe-explore">
            <MicrobeFigure
              key={`fig-${selectedGroup.id}`}
              type={selectedGroup.id}
              title={`Animated view of ${selectedGroup.name}`}
            />
            <div
              key={`panel-${selectedGroup.id}`}
              className="part-panel microbe-reveal"
              role="status"
              aria-live="polite"
            >
              <h4>
                <span className="microbe-spin" aria-hidden="true">
                  {selectedGroup.emoji}
                </span>{" "}
                {selectedGroup.name}
              </h4>
              <p className="lesson-key">{selectedGroup.tagline}</p>
              <ul>
                {selectedGroup.characteristics.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p className="microbe-examples-label">Examples:</p>
              <ul className="microbe-examples">
                {selectedGroup.examples.map((example) => (
                  <li key={example.name}>
                    <strong>{example.name}</strong> — {example.note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <p className="sort-help">
          You do not need to memorise the scientific names — just know each group and what
          it can do.
        </p>
      </section>

      {/* Culture-lab growth mini-sim */}
      <section className="lesson-block" aria-labelledby="culture-title">
        <h3 id="culture-title">🧫 Culture lab — what makes microbes grow?</h3>
        <p>
          Microbes need the right conditions to multiply. Set the temperature and the food
          (nutrients and moisture), press <strong>Incubate</strong>, and watch the dish.
        </p>

        <div className="lesson-controls">
          <label className="slider-control" htmlFor="culture-temp">
            <span>
              Temperature <strong>{tempLabels[temp]}</strong>
            </span>
            <input
              id="culture-temp"
              type="range"
              min="1"
              max="4"
              step="1"
              value={temp}
              onChange={(event) => setTemp(Number(event.target.value))}
            />
          </label>
          <label className="slider-control" htmlFor="culture-food">
            <span>
              Food &amp; moisture{" "}
              <strong>{["", "Low", "Some", "Rich", "Very rich"][food]}</strong>
            </span>
            <input
              id="culture-food"
              type="range"
              min="1"
              max="4"
              step="1"
              value={food}
              onChange={(event) => setFood(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="culture-stage">
          <svg
            className="culture-dish"
            viewBox="0 0 160 160"
            role="img"
            aria-label={`Petri dish, about ${Math.round(population)}% full of microbe colonies.`}
          >
            <circle cx="80" cy="80" r="70" fill="#eef7f1" stroke="#cfe3d6" strokeWidth="3" />
            <circle cx="80" cy="80" r="64" fill="#f6fcf8" />
            {colonySpots.slice(0, colonyCount).map((spot, index) => (
              <circle
                key={index}
                className="colony"
                cx={spot.x}
                cy={spot.y}
                r={spot.r}
              />
            ))}
          </svg>

          <div className="culture-readout" style={growthStyle}>
            <p>
              Growth speed: <strong>{speedLabel}</strong>
            </p>
            <div className="growth-meter" aria-hidden="true">
              <span />
            </div>
            <p>
              Dish is <strong>{Math.round(population)}%</strong> full.
            </p>
            <div className="drill-buttons">
              <button
                type="button"
                className="drill-check"
                onClick={() => setIncubating((value) => !value)}
              >
                {incubating ? "⏸ Pause" : "▶ Incubate"}
              </button>
              <button
                type="button"
                className="drill-next"
                onClick={() => {
                  setIncubating(false);
                  setPopulation(4);
                }}
              >
                🧼 Reset dish
              </button>
            </div>
            <p className="lesson-key">{cultureMessage}</p>
          </div>
        </div>
      </section>

      {/* Beneficial effects */}
      <section className="lesson-block" aria-labelledby="good-title">
        <h3 id="good-title">✅ How microbes help us</h3>
        <p>
          Humans have used microbes for a long time in four big fields. Pick a field to
          see how.
        </p>

        <div className="part-buttons" role="group" aria-label="Fields where microbes help">
          {beneficialFields.map((field) => (
            <button
              key={field.id}
              type="button"
              className={field.id === selectedFieldId ? "is-active" : ""}
              aria-pressed={field.id === selectedFieldId}
              onClick={() => setSelectedFieldId(field.id)}
            >
              <span aria-hidden="true">{field.emoji}</span> {field.label}
            </button>
          ))}
        </div>

        {selectedField && (
          <div
            key={selectedField.id}
            className="part-panel microbe-reveal"
            role="status"
            aria-live="polite"
          >
            <h4>
              <span aria-hidden="true">{selectedField.emoji}</span> {selectedField.label}
            </h4>
            <ul>
              {selectedField.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        )}
        <p className="lesson-key">
          Microbes work fast, need little energy, are often free from the environment, and
          cause minimal pollution — so they are perfect for industry.
        </p>
      </section>

      {/* Adverse effects */}
      <section className="lesson-block" aria-labelledby="bad-title">
        <h3 id="bad-title">⚠️ How microbes can harm</h3>
        <p>
          Some microbes are harmful. A micro-organism that can cause a disease is a{" "}
          <strong>pathogen</strong>. A <strong>vector</strong> (like a mosquito or fly)
          carries it to a <strong>host</strong>, whose body it grows in.
        </p>
        <div className="everyday-grid">
          <div className="everyday-col increase">
            <h4>🤒 Causing disease</h4>
            <ul>
              <li>Viruses: colds, dengue, AIDS</li>
              <li>Bacteria: tuberculosis, typhoid, cholera</li>
              <li>Protozoa: malaria, amoebic dysentery</li>
              <li>Fungi: skin rashes (pityriasis)</li>
            </ul>
          </div>
          <div className="everyday-col decrease">
            <h4>🍞 Other harm</h4>
            <ul>
              <li>Food spoilage — microbes change food and make it unfit to eat</li>
              <li>Plant diseases — powdery mildew, late blight, wilting</li>
              <li>Damage to non-living surfaces</li>
              <li>Biological weapons — e.g. Bacillus anthracis (anthrax)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Key terms */}
      <section className="lesson-block" aria-labelledby="terms-title">
        <h3 id="terms-title">📖 Key terms</h3>
        <dl className="term-list">
          {keyTerms.map((item) => (
            <div key={item.term} className="term-row">
              <dt>{item.term}</dt>
              <dd>{item.detail}</dd>
            </div>
          ))}
        </dl>
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
