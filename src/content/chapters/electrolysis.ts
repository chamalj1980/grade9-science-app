import type { ChapterContent } from "../schema";

// Chapter 10 — Electrolysis — authored data-first against the block schema (no bespoke
// components). Content follows the Grade 9 textbook: electrolytes vs non-electrolytes,
// ionic compounds and their states, electrolysis of copper sulphate and of water, and
// electroplating. The recap is served by RecapView from recaps.ts.
export const electrolysisChapter: ChapterContent = {
  moduleId: "electrolysis",
  theme: "electrolysis",
  sections: [
    // ---- Lesson ----
    {
      id: "lesson",
      hero: {
        variant: "lesson",
        eyebrow: "Lesson",
        title: "Electrolysis",
        decoration: ["⚡", "🔋", "🧪", "💧"],
        intro:
          "⚡ A woman once got an electric shock while pouring coconut milk into her curry — without even touching the hot plate. The current had leaked through the liquid. Some liquids carry electricity, and that one fact powers everything from extracting metals to gold-plating jewellery."
      },
      groups: [
        {
          id: "conduct-title",
          heading: "⚡ Which liquids carry electricity?",
          blocks: [
            {
              type: "prose",
              body: [
                "Dip two carbon rods connected to a battery and an **ammeter** into different liquids. If the needle moves, a current is flowing — the liquid conducts."
              ]
            },
            {
              type: "cardGrid",
              variant: "badges",
              cards: [
                {
                  emoji: "✅",
                  title: "Electrolytes",
                  badge: "conduct",
                  body: "Liquids that **conduct electricity**. They contain **mobile ions** that carry the current. Examples: salt solution, copper sulphate solution, acidified water."
                },
                {
                  emoji: "🚫",
                  title: "Non-electrolytes",
                  badge: "don't conduct",
                  body: "Liquids that **do not conduct**. They have **no mobile ions**. Examples: kerosene, distilled water, sugar solution."
                }
              ]
            },
            {
              type: "callout",
              variant: "key",
              body: "The rule: a liquid conducts **only if it contains mobile ions**."
            }
          ]
        },
        {
          id: "ionic-title",
          heading: "🧊 The secret of ionic compounds",
          blocks: [
            {
              type: "prose",
              body: [
                "Compounds like **sodium chloride** (table salt) and **copper sulphate** are **ionic** — built from positive and negative ions. But those ions can only carry a current when they are free to move. Explore each state:"
              ]
            },
            {
              type: "revealTabs",
              ariaLabel: "States of an ionic compound",
              defaultId: "aqueous",
              tabs: [
                {
                  id: "solid",
                  emoji: "🧊",
                  label: "Solid",
                  title: "Solid ionic compound",
                  badge: "❌ Does not conduct",
                  badgeTone: "no",
                  lead: "The ions are locked in a rigid lattice.",
                  body: "They cannot move, so a solid ionic compound does NOT conduct electricity."
                },
                {
                  id: "aqueous",
                  emoji: "💧",
                  label: "Dissolved in water",
                  title: "Aqueous solution",
                  badge: "✅ Conducts",
                  badgeTone: "yes",
                  lead: "Water frees the ions to move around.",
                  body: "So an aqueous solution of an ionic compound is a good conductor of electricity."
                },
                {
                  id: "fused",
                  emoji: "🔥",
                  label: "Melted (fused)",
                  title: "Fused (molten) compound",
                  badge: "✅ Conducts",
                  badgeTone: "yes",
                  lead: "Heating the solid until it melts also frees the ions.",
                  body: "A fused ionic compound conducts electricity too."
                }
              ]
            }
          ]
        },
        {
          id: "electrolysis-title",
          heading: "🔋 What the current does: electrolysis",
          blocks: [
            {
              type: "prose",
              body: [
                "The rods that carry current into and out of the liquid are the **electrodes**. The one joined to the battery's **+** terminal is the **positive electrode**; the one joined to the **−** terminal is the **negative electrode**.",
                "Pass a current through blue **copper sulphate** solution and watch it change:"
              ]
            },
            {
              type: "figure",
              size: "medium",
              alt: "An electrolysis cell: two carbon electrodes in copper sulphate solution wired to a battery.",
              caption:
                "An electrolysis cell. The current drives **copper** onto the negative electrode and releases **oxygen** at the positive one.",
              svg: `<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="86" y="10" width="68" height="20" rx="4" fill="#1f2937"/>
  <rect x="154" y="15" width="5" height="10" fill="#1f2937"/>
  <text x="95" y="24" font-size="12" fill="#fbbf24" font-weight="bold">+</text>
  <text x="135" y="24" font-size="12" fill="#93c5fd" font-weight="bold">−</text>
  <path d="M96 30 V38 H92 V44" fill="none" stroke="#374151" stroke-width="2"/>
  <path d="M144 30 V38 H148 V44" fill="none" stroke="#374151" stroke-width="2"/>
  <path d="M46 58 L46 162 Q46 172 56 172 L184 172 Q194 172 194 162 L194 58" fill="none" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
  <path d="M50 92 Q120 84 190 92 L190 166 Q120 174 50 166 Z" fill="#bfdbfe"/>
  <path d="M50 92 Q120 84 190 92" fill="none" stroke="#60a5fa" stroke-width="2"/>
  <rect x="88" y="44" width="9" height="106" rx="2" fill="#475569"/>
  <text x="80" y="41" font-size="14" fill="#b91c1c" font-weight="bold">+</text>
  <circle cx="86" cy="104" r="3" fill="#eff6ff" stroke="#60a5fa"/>
  <circle cx="99" cy="116" r="2.5" fill="#eff6ff" stroke="#60a5fa"/>
  <circle cx="88" cy="128" r="3.4" fill="#eff6ff" stroke="#60a5fa"/>
  <text x="66" y="122" font-size="9" fill="#1d4ed8">O₂</text>
  <rect x="143" y="44" width="9" height="106" rx="2" fill="#475569"/>
  <rect x="140" y="96" width="15" height="54" rx="2" fill="#c2660c"/>
  <text x="156" y="41" font-size="14" fill="#1d4ed8" font-weight="bold">−</text>
  <text x="159" y="122" font-size="9" fill="#7c2d12">Cu</text>
  <text x="120" y="192" font-size="9" fill="#475569" text-anchor="middle">Copper sulphate solution</text>
</svg>`
            },
            {
              type: "cardGrid",
              variant: "facts",
              cards: [
                {
                  emoji: "🟫",
                  title: "Copper appears",
                  body: "A reddish-brown layer of **copper** builds up on the negative electrode."
                },
                {
                  emoji: "🫧",
                  title: "Oxygen bubbles",
                  body: "**Oxygen** gas is released at the positive electrode."
                },
                {
                  emoji: "🌫️",
                  title: "Blue fades",
                  body: "The blue colour of the solution slowly fades as it is used up."
                }
              ]
            },
            {
              type: "callout",
              variant: "key",
              body: "**Electrolysis** is the chemical change caused by passing an electric current through an electrolyte — splitting it into simpler substances."
            },
            {
              type: "callout",
              variant: "help",
              body: "Electrodes that don't react with the electrolyte are **inert electrodes** — carbon (graphite) and platinum are examples."
            }
          ]
        },
        {
          id: "water-title",
          heading: "💧 Splitting water",
          blocks: [
            {
              type: "prose",
              body: [
                "Add a few drops of acid to water and electrolyse it. The water itself splits into two gases:"
              ]
            },
            {
              type: "cardGrid",
              variant: "facts",
              cards: [
                {
                  emoji: "🎈",
                  title: "Hydrogen · negative electrode",
                  body: "**Hydrogen** collects at the negative electrode — about **twice** the volume. A lighted splint makes it burn with a squeaky **'pop'**."
                },
                {
                  emoji: "🔥",
                  title: "Oxygen · positive electrode",
                  body: "**Oxygen** collects at the positive electrode. A **glowing** splint pushed into it **reignites**."
                }
              ]
            },
            {
              type: "callout",
              variant: "key",
              body: "Electrolysis splits water into its elements — **hydrogen** and **oxygen**."
            }
          ]
        },
        {
          id: "plating-title",
          heading: "🥇 Electroplating",
          blocks: [
            {
              type: "prose",
              body: [
                "**Electroplating** uses electrolysis to coat one metal with a thin layer of another — for looks, or to stop rusting. Dip a copper plate and an iron nail in copper sulphate, pass a current, and copper moves from the plate onto the nail."
              ]
            },
            {
              type: "cardGrid",
              variant: "facts",
              cards: [
                {
                  emoji: "➕",
                  title: "Plating metal → positive electrode",
                  body: "The metal you coat WITH (e.g. silver, gold) is the positive electrode. It slowly dissolves into the solution."
                },
                {
                  emoji: "➖",
                  title: "Object → negative electrode",
                  body: "The object being coated (e.g. the iron nail) is the negative electrode."
                },
                {
                  emoji: "🧪",
                  title: "Electrolyte → a salt of the plating metal",
                  body: "The solution must be a salt of the metal being plated — a silver salt to plate silver, and so on."
                }
              ]
            },
            {
              type: "callout",
              variant: "help",
              body: "**High-quality** plating is thin, even and shiny — it forms only when the change happens **slowly**: a dilute solution and a low current."
            },
            {
              type: "cardGrid",
              variant: "icons",
              heading: "✨ Why we electroplate",
              cards: [
                {
                  emoji: "🛡️",
                  title: "Rust protection",
                  body: "Nickel or chromium on an iron tray stops rust and looks bright."
                },
                {
                  emoji: "💍",
                  title: "Added value",
                  body: "Gold on copper jewellery gives a rich look and resists corrosion."
                },
                {
                  emoji: "🚗",
                  title: "Vehicle parts",
                  body: "A thin metal layer protects car parts from rusting."
                }
              ]
            }
          ]
        },
        {
          id: "uses-title",
          heading: "🏭 Where electrolysis is used",
          blocks: [
            {
              type: "cardGrid",
              variant: "icons",
              cards: [
                {
                  emoji: "⛏️",
                  title: "Extracting metals",
                  body: "Reactive metals like sodium and aluminium are obtained by electrolysis."
                },
                {
                  emoji: "🧼",
                  title: "Making caustic soda",
                  body: "Sodium hydroxide (caustic soda) is manufactured by electrolysis."
                },
                {
                  emoji: "✨",
                  title: "Electroplating",
                  body: "Coating objects with a protective or decorative metal layer."
                }
              ]
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
                  term: "Electrolyte",
                  meaning: "A liquid or solution that conducts electricity because it contains mobile ions."
                },
                {
                  term: "Non-electrolyte",
                  meaning: "A liquid that does not conduct electricity — it has no mobile ions."
                },
                {
                  term: "Ion",
                  meaning: "A charged particle; the mover that carries current through an electrolyte."
                },
                {
                  term: "Electrode",
                  meaning: "A conductor through which the current enters or leaves the electrolyte."
                },
                {
                  term: "Electrolysis",
                  meaning: "The chemical change caused by passing a current through an electrolyte, splitting it into simpler substances."
                },
                {
                  term: "Inert electrode",
                  meaning: "An electrode that does not react with the electrolyte, e.g. carbon or platinum."
                },
                {
                  term: "Electroplating",
                  meaning: "Coating one metal with another metal using electrolysis."
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
              prompt: "Got it? Mark the lesson done, then test yourself.",
              label: "Mark lesson as done",
              doneLabel: "Lesson complete ✅"
            }
          ]
        }
      ]
    },

    // ---- Exercise 1: classify electrolytes ----
    {
      id: "exercise-1",
      wrapperClass: "sort-calc",
      hero: {
        variant: "intro",
        eyebrow: "Exercise 1",
        title: "Electrolyte or Not?",
        intro:
          "Drag each liquid into the right bin — does it conduct electricity, or not?"
      },
      groups: [
        {
          className: "sort-panel",
          blocks: [
            {
              type: "sortBins",
              title: "Sort the liquids",
              bins: [
                {
                  id: "electrolyte",
                  title: "Electrolyte",
                  emoji: "✅",
                  hint: "conducts — has mobile ions"
                },
                {
                  id: "nonelectrolyte",
                  title: "Non-electrolyte",
                  emoji: "🚫",
                  hint: "does not conduct"
                }
              ],
              items: [
                {
                  id: "salt",
                  text: "Salt solution",
                  binId: "electrolyte",
                  reason: "Salt solution has mobile ions, so it conducts."
                },
                {
                  id: "cuso4",
                  text: "Copper sulphate solution",
                  binId: "electrolyte",
                  reason: "Copper sulphate solution has mobile ions."
                },
                {
                  id: "acid-water",
                  text: "Acidified water",
                  binId: "electrolyte",
                  reason: "Acidified water conducts — the acid provides ions."
                },
                {
                  id: "fused-nacl",
                  text: "Melted (fused) sodium chloride",
                  binId: "electrolyte",
                  reason: "Fused NaCl has free-moving ions, so it conducts."
                },
                {
                  id: "distilled",
                  text: "Distilled water",
                  binId: "nonelectrolyte",
                  reason: "Pure distilled water has no mobile ions."
                },
                {
                  id: "kerosene",
                  text: "Kerosene",
                  binId: "nonelectrolyte",
                  reason: "Kerosene has no ions, so it does not conduct."
                },
                {
                  id: "sugar",
                  text: "Sugar solution",
                  binId: "nonelectrolyte",
                  reason: "Sugar dissolves without forming ions, so it does not conduct."
                },
                {
                  id: "solid-nacl",
                  text: "Solid sodium chloride",
                  binId: "nonelectrolyte",
                  reason: "In the solid state the ions can't move, so it doesn't conduct."
                }
              ]
            }
          ]
        }
      ]
    },

    // ---- Exercise 2: true/false + recap quiz ----
    {
      id: "exercise-2",
      wrapperClass: "sort-calc",
      hero: {
        variant: "intro",
        eyebrow: "Exercise 2",
        title: "Fact or Myth?",
        intro:
          "Decide whether each statement is true or false, then take the recap quiz."
      },
      groups: [
        {
          className: "sort-panel",
          blocks: [
            {
              type: "sortBins",
              title: "Part A · True or false?",
              bins: [
                { id: "true", title: "True", emoji: "✅", hint: "a correct fact" },
                { id: "false", title: "False", emoji: "❌", hint: "a myth or error" }
              ],
              items: [
                {
                  id: "t1",
                  text: "Electrolytes conduct electricity because they contain mobile ions.",
                  binId: "true",
                  reason: "Correct — mobile ions carry the current."
                },
                {
                  id: "t2",
                  text: "Distilled water is a good conductor of electricity.",
                  binId: "false",
                  reason: "False — pure distilled water has no ions and does not conduct."
                },
                {
                  id: "t3",
                  text: "Solid sodium chloride conducts electricity.",
                  binId: "false",
                  reason: "False — in the solid state the ions cannot move."
                },
                {
                  id: "t4",
                  text: "An aqueous solution of an ionic compound conducts electricity.",
                  binId: "true",
                  reason: "Correct — dissolved ions are free to move."
                },
                {
                  id: "t5",
                  text: "During electrolysis, a compound is split into simpler substances.",
                  binId: "true",
                  reason: "Correct — that is exactly what electrolysis does."
                },
                {
                  id: "t6",
                  text: "In the electrolysis of acidified water, hydrogen forms at the positive electrode.",
                  binId: "false",
                  reason: "False — hydrogen forms at the NEGATIVE electrode; oxygen at the positive."
                },
                {
                  id: "t7",
                  text: "About twice as much hydrogen as oxygen is collected when water is electrolysed.",
                  binId: "true",
                  reason: "Correct — the hydrogen volume is roughly double the oxygen."
                },
                {
                  id: "t8",
                  text: "Carbon and platinum are inert electrodes.",
                  binId: "true",
                  reason: "Correct — they do not react with the electrolyte."
                },
                {
                  id: "t9",
                  text: "When electroplating, the object being coated is the positive electrode.",
                  binId: "false",
                  reason: "False — the object being coated is the NEGATIVE electrode."
                },
                {
                  id: "t10",
                  text: "High-quality plating needs a concentrated solution and a high current.",
                  binId: "false",
                  reason: "False — it needs a DILUTE solution and a LOW current, so the change is slow."
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
                  id: "el-q1",
                  prompt: "Which of these is an electrolyte?",
                  options: [
                    "Distilled water",
                    "Sugar dissolved in water",
                    "Sodium chloride dissolved in water",
                    "Grease dissolved in kerosene"
                  ],
                  answer: 2
                },
                {
                  id: "el-q2",
                  prompt: "Petrol does not conduct electricity because it…",
                  options: [
                    "has no mobile electrons",
                    "has no mobile ions",
                    "has a very low density",
                    "is highly volatile"
                  ],
                  answer: 1
                },
                {
                  id: "el-q3",
                  prompt: "Which statement is correct?",
                  options: [
                    "Solid NaCl conducts electricity",
                    "Fused NaCl does not conduct",
                    "An aqueous NaCl solution conducts electricity",
                    "Solid NaCl contains mobile ions"
                  ],
                  answer: 2
                },
                {
                  id: "el-q4",
                  prompt: "In the electrolysis of acidified water, the gas at the negative electrode is…",
                  options: ["Oxygen", "Hydrogen", "Carbon dioxide", "Chlorine"],
                  answer: 1
                },
                {
                  id: "el-q5",
                  prompt: "How do you test the gas collected at the positive electrode?",
                  options: [
                    "A lighted splint gives a squeaky 'pop'",
                    "A glowing splint reignites",
                    "It turns limewater milky",
                    "It has a sharp smell"
                  ],
                  answer: 1
                },
                {
                  id: "el-q6",
                  prompt: "To electroplate a copper ring with silver, the ring must be the…",
                  options: [
                    "positive electrode",
                    "negative electrode",
                    "electrolyte",
                    "inert electrode"
                  ],
                  answer: 1
                },
                {
                  id: "el-q7",
                  prompt: "To electroplate an object with silver, the electrolyte should be…",
                  options: [
                    "a copper salt solution",
                    "a silver salt solution",
                    "distilled water",
                    "kerosene"
                  ],
                  answer: 1
                },
                {
                  id: "el-q8",
                  prompt: "A high-quality electroplating is produced by…",
                  options: [
                    "a concentrated solution and a high current",
                    "a dilute solution and a low current",
                    "heating the object strongly",
                    "using distilled water as the electrolyte"
                  ],
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
