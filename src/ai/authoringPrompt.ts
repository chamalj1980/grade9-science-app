// The authoring prompt: the instructions that turn a raw chapter's text into a lesson
// expressed as our block schema (a ContentSection). This is transport-agnostic — it's the
// same prompt whether a teacher runs it in Claude by hand or a server proxy calls the API.
// Keep the block reference here in sync with schema.ts as block types evolve.

export const DRAFT_MAX_TOKENS = 16000;

// Concise JSON shapes + when-to-use for the blocks the AI may emit. A lean subset that
// makes a strong lesson and that the Design Studio can review.
const BLOCK_REFERENCE = `
prose        — explanation paragraphs. { "type":"prose", "body":["paragraph; use **bold** for key terms", ...] }
callout      — a highlighted note. { "type":"callout", "variant":"key"|"help"|"feature", "emoji":"👴 (feature only)", "body":"text" }
cardGrid     — 2–6 related items side by side. { "type":"cardGrid", "variant":"badges"|"facts"|"icons"|"plain", "heading":"optional sub-heading", "cards":[{ "emoji":"⭐", "title":"...", "body":"...", "badge":"short tag (badges variant only)" }] }
termList     — key words. { "type":"termList", "terms":[{ "term":"...", "meaning":"..." }] }
sequenceStrip— an ordered process to READ (not solve). { "type":"sequenceStrip", "items":[{ "id":"a", "emoji":"🥚", "label":"..." }], "note":"optional" }
figure       — a diagram. Prefer a library id when it fits: "tree-of-life", "rock-strata", "primordial-earth". Otherwise inline SVG. { "type":"figure", "art":"<library id>", "caption":"optional" } OR { "type":"figure", "svg":"<svg viewBox=\\"0 0 240 160\\">...clean, simple shapes only...</svg>", "alt":"describe it", "caption":"optional" }
mcq          — an end-of-lesson quick check. { "type":"mcq", "title":"Quick check", "questions":[{ "id":"q1", "prompt":"...", "options":["A","B","C"], "answer":0 }] }  // answer = 0-based index of the correct option
`.trim();

const EXAMPLE = `{
  "id": "lesson",
  "hero": { "variant": "lesson", "eyebrow": "Lesson", "title": "The Water Cycle", "intro": "💧 Water is never still — it travels from the sea to the sky and back again." },
  "groups": [
    {
      "heading": "☀️ The journey begins",
      "blocks": [
        { "type": "prose", "body": ["The Sun heats the sea, and water turns to an invisible gas called **water vapour**. This is **evaporation**."] },
        { "type": "cardGrid", "variant": "facts", "cards": [
          { "emoji": "☀️", "title": "Evaporation", "body": "Liquid water becomes vapour when it is heated." },
          { "emoji": "☁️", "title": "Condensation", "body": "High in the cold sky, vapour turns back into tiny droplets that form clouds." }
        ] }
      ]
    },
    {
      "heading": "📖 Key words",
      "blocks": [
        { "type": "termList", "terms": [
          { "term": "Evaporation", "meaning": "Liquid water turning into vapour when heated." },
          { "term": "Condensation", "meaning": "Vapour cooling back into liquid droplets." }
        ] }
      ]
    },
    {
      "heading": "✅ Quick check",
      "blocks": [
        { "type": "mcq", "title": "Quick check", "questions": [
          { "id": "q1", "prompt": "What is evaporation?", "options": ["Vapour becoming liquid", "Liquid becoming vapour", "Ice melting"], "answer": 1 }
        ] }
      ]
    }
  ]
}`;

export const DRAFT_SYSTEM_PROMPT = `You are an expert Grade 9 science curriculum author writing for Sri Lankan students in clear, simple English.

Your job: turn the SOURCE CHAPTER text the user provides into ONE engaging LESSON, expressed as a single JSON object matching the schema below. A lesson is a list of "groups" (sub-topics), each with a heading and a list of "blocks".

SECTION SHAPE:
{
  "id": "lesson",
  "hero": { "variant": "lesson", "eyebrow": "Lesson", "title": "<the chapter's title>", "intro": "<one-line hook, may start with an emoji>" },
  "groups": [ { "heading": "<emoji + short title>", "blocks": [ <blocks> ] }, ... ]
}

BLOCK TYPES (use ONLY these):
${BLOCK_REFERENCE}

RULES:
- Output the JSON object ONLY. No markdown code fences, no commentary before or after.
- Produce 4–7 groups, each a clear sub-topic with an emoji heading.
- Use "prose" for explanation, "cardGrid" for comparisons/lists, "termList" for a key-words group, and add a "figure" where a diagram genuinely helps understanding.
- End with ONE group containing a single "mcq" quick check of 3–6 questions. "answer" is the 0-based index of the correct option — get it right.
- Grade 9 reading level. Short sentences. Wrap the most important terms in **bold**.
- Do NOT invent facts, numbers, or examples that are not supported by the source text. If the source doesn't cover something, leave it out.
- Keep any inline SVG simple and self-contained (basic shapes, no scripts, no external references).

EXAMPLE (format only — your content comes from the source text):
${EXAMPLE}`;

export function buildDraftUserMessage(chapterText: string): string {
  return `SOURCE CHAPTER TEXT:\n\n${chapterText.trim()}\n\n---\nWrite the lesson now as a single JSON object. Respond with only the JSON.`;
}

export function buildDraftPrompt(chapterText: string): { system: string; user: string } {
  return { system: DRAFT_SYSTEM_PROMPT, user: buildDraftUserMessage(chapterText) };
}

// The full prompt as one copyable block, for teachers who run it in Claude by hand.
export function buildCopyablePrompt(chapterText: string): string {
  return `${DRAFT_SYSTEM_PROMPT}\n\n====================\n\n${buildDraftUserMessage(chapterText)}`;
}
