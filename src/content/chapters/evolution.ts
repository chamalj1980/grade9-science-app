import type { ChapterContent } from "../schema";

// Chapter 9 — The Evolutionary Process — authored entirely as data against the block
// schema. This is the reference example of the content model: the lesson, the ordering
// exercise, and the sort + quiz exercise are all blocks, not bespoke components. The
// recap is still served by RecapView from recaps.ts (unchanged).
export const evolutionChapter: ChapterContent = {
  moduleId: "evolution",
  theme: "evolution",
  sections: [
    // ---- Lesson ----
    {
      id: "lesson",
      hero: {
        variant: "lesson",
        eyebrow: "Lesson",
        title: "The Evolutionary Process",
        decoration: ["🦠", "🐟", "🦖", "🦅"],
        intro:
          "🧬 Every living thing around you is the result of a story billions of years long — from the birth of the Earth, to the first cell, to the huge variety of life today. Let's trace it."
      },
      groups: [
        {
          id: "earth-title",
          heading: "🌍 How the Earth began",
          blocks: [
            {
              type: "prose",
              body: [
                "The Earth is about **4.5 billion years** old. Two scientific theories explain how it and the solar system formed."
              ]
            },
            {
              type: "cardGrid",
              variant: "badges",
              cards: [
                {
                  emoji: "🌫️",
                  title: "Nebular theory",
                  badge: "first scientific",
                  badgeTone: "first-scientific",
                  body: "The first scientific explanation. Tiny particles in the universe were drawn together by gravity, clumped up, and formed the galaxies, the Sun and the planets."
                },
                {
                  emoji: "💥",
                  title: "Big Bang theory",
                  badge: "modern theory",
                  badgeTone: "modern",
                  body: "The modern theory. A single source of enormous energy exploded, creating huge clouds of dust that clumped into galaxies. Our solar system formed in the Milky Way."
                }
              ]
            },
            {
              type: "cardGrid",
              variant: "facts",
              cards: [
                {
                  emoji: "🌍",
                  title: "About 4.5 billion years old",
                  body: "The Earth is believed to have formed around 4.5 billion years ago."
                },
                {
                  emoji: "🌋",
                  title: "From molten to layered",
                  body: "At first the Earth was intensely hot and volcanic. As it cooled, dense metals sank to form the core and light silicon rocks formed the crust."
                },
                {
                  emoji: "☁️",
                  title: "No oxygen at first",
                  body: "The early atmosphere held carbon dioxide (CO₂), methane (CH₄) and hydrogen sulphide (H₂S). The absence of oxygen (O₂) is a key fact."
                },
                {
                  emoji: "🌊",
                  title: "Oceans from endless rain",
                  body: "Evaporated water condensed into clouds and fell as heavy rain for years. This mineral-rich water collected in low lands to form the oceans."
                }
              ]
            }
          ]
        },
        {
          id: "life-title",
          heading: "🧪 How life began",
          blocks: [
            {
              type: "prose",
              body: [
                "Life appeared about **3.5 billion years** ago. Four theories tried to explain it — click each to see what it claimed and whether science accepts it."
              ]
            },
            {
              type: "revealTabs",
              ariaLabel: "Theories of the origin of life",
              defaultId: "biochemical",
              tabs: [
                {
                  id: "special-creation",
                  emoji: "✨",
                  label: "Special creation",
                  title: "Special creation",
                  badge: "❌ Not accepted",
                  badgeTone: "no",
                  lead: "All living things were created by a supernatural power.",
                  body: "There is no scientific evidence, so scientists do not consider it."
                },
                {
                  id: "spontaneous",
                  emoji: "🐀",
                  label: "Spontaneous generation",
                  title: "Spontaneous generation",
                  badge: "❌ Not accepted",
                  badgeTone: "no",
                  lead: "Life arose from non-living things by itself — rats from cloth, maggots from rotten meat, weevils from decayed wood.",
                  body: "Disproved by Louis Pasteur's swan-neck flask experiment (accepted as false in 1862)."
                },
                {
                  id: "cosmozoic",
                  emoji: "☄️",
                  label: "Cosmozoic theory",
                  title: "Cosmozoic theory",
                  badge: "❌ Not accepted",
                  badgeTone: "no",
                  lead: "Life reached Earth from space — on a fallen meteor or a spacecraft from another planet.",
                  body: "Has not been proved scientifically."
                },
                {
                  id: "biochemical",
                  emoji: "🧪",
                  label: "Bio-chemical evolution",
                  title: "Bio-chemical evolution",
                  badge: "✅ Accepted today",
                  badgeTone: "yes",
                  lead: "Atmospheric gases reacted (energy from lightning, volcanoes and UV), dissolved in the rain and collected in the sea as the 'primordial soup', where the first cell formed.",
                  body: "The accepted theory today. Proposed by Haldane & Oparin and proved by Stanley Miller."
                }
              ]
            },
            {
              type: "cardGrid",
              variant: "plain",
              cards: [
                {
                  title: "Louis Pasteur",
                  body: "Disproved spontaneous generation with the swan-neck flask experiment."
                },
                {
                  title: "Haldane & Oparin",
                  body: "Proposed the theory of bio-chemical evolution."
                },
                {
                  title: "Stanley Miller",
                  body: "Proved bio-chemical evolution in the laboratory."
                },
                {
                  title: "Charles Darwin",
                  body: "The father of evolution; put forward the theory of natural selection."
                }
              ]
            }
          ]
        },
        {
          id: "march-title",
          heading: "🐟 The march of life",
          blocks: [
            {
              type: "prose",
              body: [
                "The first life was a simple **unicellular bacterium**. Over billions of years, life grew more complex. This gradual change from simple to complex is **evolution**."
              ]
            },
            {
              type: "sequenceStrip",
              items: [
                { id: "bacteria", emoji: "🦠", label: "Unicellular bacteria" },
                { id: "algae", emoji: "🟢", label: "Unicellular algae (first to photosynthesise)" },
                { id: "multi", emoji: "🪸", label: "Multicellular organisms" },
                { id: "fish", emoji: "🐟", label: "Fish — the first vertebrates" },
                { id: "amph", emoji: "🐸", label: "Amphibians — first onto land" },
                { id: "rept", emoji: "🦎", label: "Reptiles" },
                { id: "birds", emoji: "🦅", label: "Birds and mammals" }
              ],
              note: "Humans evolved about 12 million years ago; modern humans about 5 million years ago."
            }
          ]
        },
        {
          id: "evidence-title",
          heading: "🔎 The evidence for evolution",
          blocks: [
            {
              type: "cardGrid",
              variant: "icons",
              cards: [
                {
                  emoji: "🗺️",
                  title: "Biogeography",
                  body: "Where animals and plants are found across the world."
                },
                {
                  emoji: "🦴",
                  title: "Comparative anatomy",
                  body: "Comparing the body structures of different organisms."
                },
                {
                  emoji: "🦕",
                  title: "Fossils (paleontology)",
                  body: "The main, most detailed evidence — the record in the rocks."
                }
              ]
            }
          ]
        },
        {
          id: "fossil-title",
          heading: "🦴 Fossils — the record in the rock",
          blocks: [
            {
              type: "prose",
              body: [
                "A **fossil** is the preserved remains, part or trace of a dead organism, found in rock, ice, peat, volcanic ash or mud. Step through how a bone becomes a fossil."
              ]
            },
            {
              type: "stepper",
              steps: [
                {
                  emoji: "💀",
                  title: "An organism dies",
                  body: "A plant or animal dies and its soft parts begin to decay."
                },
                {
                  emoji: "🏔️",
                  title: "It is buried",
                  body: "The hard parts (bones, teeth, shells) are quickly buried in mud or sand."
                },
                {
                  emoji: "💧",
                  title: "Minerals seep in",
                  body: "Over ages, mineral-rich mud seeps into the pores and pressure builds."
                },
                {
                  emoji: "🪨",
                  title: "It turns to stone",
                  body: "The remains harden into a bony rock — a fossil — keeping the original shape."
                }
              ]
            },
            {
              type: "callout",
              variant: "key",
              body: "In layered rock, the deepest layers are oldest — so the oldest fossils lie at the bottom. Radioactive carbon (¹⁴C) is used to find a fossil's age."
            },
            {
              type: "cardGrid",
              variant: "living",
              heading: "🐟 Living fossils",
              intro:
                "Some organisms have barely changed for millions of years — these are called **living fossils**.",
              cards: [
                {
                  emoji: "🐟",
                  title: "Coelacanth",
                  body: "A fish thought extinct for 70 million years — found alive off South Africa in 1938."
                },
                {
                  emoji: "🐚",
                  title: "Lingula",
                  body: "Found around Thambalagamuwa bay in Trincomalee, Sri Lanka."
                },
                { emoji: "🪰", title: "Dragonfly", body: "Little changed for millions of years." },
                {
                  emoji: "🪳",
                  title: "Cockroach",
                  body: "One of the great survivors — barely changed."
                },
                {
                  emoji: "🐠",
                  title: "Lungfish",
                  body: "A fish that can breathe air, almost unchanged."
                },
                { emoji: "🌿", title: "Tree fern ('Ginihota')", body: "A living plant fossil." }
              ]
            },
            {
              type: "callout",
              variant: "help",
              body: "The **horse** has a complete fossil record — its ancestor lived 54 million years ago in North America, was dog-sized, and had three toes on its front legs."
            }
          ]
        },
        {
          id: "ns-title",
          heading: "🏆 Natural selection & bio-diversity",
          blocks: [
            {
              type: "prose",
              body: [
                "Organisms compete for limited resources. The ones that succeed are naturally selected and become established; their population grows. Over time this — and speciation, where new species arise from old ones — builds the huge bio-diversity we see today."
              ]
            },
            {
              type: "callout",
              variant: "feature",
              emoji: "👴",
              body: "**Charles Darwin** — the father of evolution — put forward the **theory of natural selection**, the accepted scientific explanation of how evolution works."
            }
          ]
        },
        {
          id: "terms-title",
          heading: "📖 Key words",
          blocks: [
            {
              type: "termList",
              terms: [
                {
                  term: "Evolution",
                  meaning: "The gradual development of simple organisms into modern, complex ones over time."
                },
                {
                  term: "Nebular theory",
                  meaning: "The first scientific idea for the origin of the solar system, by gravity pulling particles together."
                },
                {
                  term: "Big Bang theory",
                  meaning: "The modern theory: a giant explosion of energy created the galaxies."
                },
                {
                  term: "Primordial soup",
                  meaning: "The mineral- and chemical-rich early sea in which the first cell is thought to have formed."
                },
                {
                  term: "Bio-chemical evolution",
                  meaning: "The accepted theory of the origin of life from chemical reactions in the primordial soup."
                },
                {
                  term: "Fossil",
                  meaning: "The preserved remains, part or trace of a dead organism."
                },
                {
                  term: "Living fossil",
                  meaning: "An organism that has survived almost unchanged for millions of years, e.g. the Coelacanth."
                },
                {
                  term: "Natural selection",
                  meaning: "The process where better-suited organisms survive, reproduce and become established."
                },
                {
                  term: "Speciation",
                  meaning: "The forming of a new species from a former one, adding to bio-diversity."
                }
              ]
            }
          ]
        },
        {
          className: "lesson-finish",
          blocks: [
            {
              type: "markDone",
              prompt: "Ready? Mark the lesson done, then build the timeline of life.",
              label: "Mark lesson as done",
              doneLabel: "Lesson complete ✅"
            }
          ]
        }
      ]
    },

    // ---- Exercise 1: ordering ----
    {
      id: "exercise-1",
      hero: {
        variant: "exercise",
        eyebrow: "Exercise 1",
        title: "Timeline of Life",
        intro:
          "Tap the stages into the timeline in the right order — earliest first. Fill every slot, then check your work."
      },
      groups: [
        {
          blocks: [
            {
              type: "orderTimeline",
              successNote:
                "🎉 Every timeline solved! You can trace life from the first cell to today.",
              rounds: [
                {
                  id: "earth-to-life",
                  title: "Level 1 · From Earth to first life",
                  prompt: "Put these events in order, earliest first.",
                  order: [
                    { id: "earth", emoji: "🌍", label: "The Earth forms (4.5 billion yrs ago)" },
                    { id: "atmos", emoji: "☁️", label: "Early atmosphere: CO₂, CH₄ — no oxygen" },
                    { id: "oceans", emoji: "🌊", label: "Rain collects to form the oceans" },
                    { id: "soup", emoji: "🥣", label: "The 'primordial soup' forms" },
                    { id: "cell", emoji: "🦠", label: "The first living cell appears (3.5 billion yrs ago)" }
                  ]
                },
                {
                  id: "animals",
                  title: "Level 2 · The march of animal life",
                  prompt: "Order these life forms from earliest to most recent.",
                  order: [
                    { id: "bacteria", emoji: "🦠", label: "Unicellular bacteria" },
                    { id: "algae", emoji: "🟢", label: "Unicellular algae (first to photosynthesise)" },
                    { id: "multi", emoji: "🪸", label: "Multicellular organisms" },
                    { id: "fish", emoji: "🐟", label: "Fish — the first vertebrates" },
                    { id: "amph", emoji: "🐸", label: "Amphibians — first onto land" },
                    { id: "rept", emoji: "🦎", label: "Reptiles" },
                    { id: "birds", emoji: "🦅", label: "Birds and mammals" }
                  ]
                },
                {
                  id: "plants",
                  title: "Level 3 · How plants appeared",
                  prompt: "Order the plant groups from earliest to most recent.",
                  order: [
                    { id: "p-algae", emoji: "🌿", label: "Photosynthetic algae in the oceans" },
                    { id: "p-simple", emoji: "🌱", label: "Simple, less-developed plants" },
                    { id: "p-nonflower", emoji: "🌲", label: "Non-flowering plants" },
                    { id: "p-flower", emoji: "🌸", label: "Flowering plants" }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    // ---- Exercise 2: sort + quiz ----
    {
      id: "exercise-2",
      wrapperClass: "sort-calc evolution-sort",
      hero: {
        variant: "intro",
        eyebrow: "Exercise 2",
        title: "Fact or Myth?",
        intro:
          "Decide whether each statement about evolution is true or false, then take the recap quiz."
      },
      groups: [
        {
          className: "sort-panel",
          blocks: [
            {
              type: "sortBins",
              title: "Part A · True or false?",
              wrapperClass: "evolution-bins",
              bins: [
                { id: "true", title: "True", emoji: "✅", hint: "a correct fact" },
                { id: "false", title: "False", emoji: "❌", hint: "a myth or error" }
              ],
              items: [
                {
                  id: "s1",
                  text: "The Earth formed about 4.5 billion years ago.",
                  binId: "true",
                  reason: "Correct — the Earth is about 4.5 billion years old."
                },
                {
                  id: "s2",
                  text: "The early Earth's atmosphere was rich in oxygen.",
                  binId: "false",
                  reason: "False — the early atmosphere had CO₂, CH₄ and H₂S, but NO oxygen."
                },
                {
                  id: "s3",
                  text: "Louis Pasteur disproved spontaneous generation.",
                  binId: "true",
                  reason: "Correct — his swan-neck flask experiment showed life does not appear by itself."
                },
                {
                  id: "s4",
                  text: "Bio-chemical evolution is the accepted theory of the origin of life.",
                  binId: "true",
                  reason: "Correct — proposed by Haldane & Oparin and proved by Stanley Miller."
                },
                {
                  id: "s5",
                  text: "The first living organism was a multicellular plant.",
                  binId: "false",
                  reason: "False — the first organism was a unicellular bacterium."
                },
                {
                  id: "s6",
                  text: "Fossils are the ONLY evidence used to study evolution.",
                  binId: "false",
                  reason: "False — biogeography and comparative anatomy are also used."
                },
                {
                  id: "s7",
                  text: "Lingula, found in Sri Lanka, is a living fossil.",
                  binId: "true",
                  reason: "Correct — it is found around Trincomalee and is barely changed."
                },
                {
                  id: "s8",
                  text: "Modern humans appeared about 4.5 billion years ago.",
                  binId: "false",
                  reason: "False — modern humans appeared about 5 million years ago."
                },
                {
                  id: "s9",
                  text: "Living fossils change rapidly over millions of years.",
                  binId: "false",
                  reason: "False — living fossils are organisms that have hardly changed."
                },
                {
                  id: "s10",
                  text: "Charles Darwin proposed the theory of natural selection.",
                  binId: "true",
                  reason: "Correct — he is called the father of evolution."
                },
                {
                  id: "s11",
                  text: "In rock layers, the oldest fossils lie at the bottom.",
                  binId: "true",
                  reason: "Correct — rocks are deposited on top of each other, so the deepest are oldest."
                },
                {
                  id: "s12",
                  text: "Evolution means simple organisms developing into complex ones over time.",
                  binId: "true",
                  reason: "Correct — that gradual change from simple to complex is evolution."
                }
              ]
            }
          ]
        },
        {
          className: "lesson-block",
          blocks: [
            {
              type: "mcq",
              title: "Part B · Quick recap quiz",
              questions: [
                {
                  id: "ev-q1",
                  prompt: "About how long ago did the Earth form?",
                  options: ["4.5 billion years", "3.5 million years", "5 000 years", "54 million years"],
                  answer: 0
                },
                {
                  id: "ev-q2",
                  prompt: "Which gas was ABSENT from the early Earth's atmosphere?",
                  options: ["Carbon dioxide", "Methane", "Oxygen", "Hydrogen sulphide"],
                  answer: 2
                },
                {
                  id: "ev-q3",
                  prompt: "The theory of the origin of life accepted today is…",
                  options: [
                    "Special creation",
                    "Spontaneous generation",
                    "The cosmozoic theory",
                    "Bio-chemical evolution"
                  ],
                  answer: 3
                },
                {
                  id: "ev-q4",
                  prompt: "Who disproved the spontaneous generation theory?",
                  options: ["Charles Darwin", "Louis Pasteur", "Stanley Miller", "Oparin"],
                  answer: 1
                },
                {
                  id: "ev-q5",
                  prompt: "Which shows the correct order of evolution?",
                  options: [
                    "Fish → bacteria → amphibians → reptiles",
                    "Bacteria → algae → fish → amphibians → reptiles",
                    "Reptiles → fish → bacteria → birds",
                    "Algae → fish → bacteria → mammals"
                  ],
                  answer: 1
                },
                {
                  id: "ev-q6",
                  prompt: "A 'living fossil' is an organism that…",
                  options: [
                    "has changed rapidly over time",
                    "is only known from fossils",
                    "has survived almost unchanged for millions of years",
                    "lived before the Earth cooled"
                  ],
                  answer: 2
                },
                {
                  id: "ev-q7",
                  prompt: "Who is considered the father of evolution?",
                  options: ["Charles Darwin", "Louis Pasteur", "John Dalton", "Ernest Rutherford"],
                  answer: 0
                },
                {
                  id: "ev-q8",
                  prompt: "In a stack of rock layers, the oldest fossils are found…",
                  options: ["at the top", "at the bottom", "in the middle", "spread evenly"],
                  answer: 1
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
