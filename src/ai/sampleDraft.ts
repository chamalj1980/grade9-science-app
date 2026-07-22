// A built-in sample of the JSON an AI author returns, so the review flow can be demoed
// end-to-end without a model call. Kept small but multi-group with a figure and a quiz.
export const SAMPLE_DRAFT_JSON = `{
  "id": "lesson",
  "hero": {
    "variant": "lesson",
    "eyebrow": "Lesson",
    "title": "Density — why things float or sink",
    "intro": "🧊 Ice floats on water, but a coin sinks. The secret is how tightly matter is packed."
  },
  "groups": [
    {
      "heading": "⚖️ What is density?",
      "blocks": [
        { "type": "prose", "body": ["**Density** is how much mass is packed into a space. A small, heavy object is **dense**; a large, light one is not.", "We find it with a simple rule: **density = mass ÷ volume**."] },
        { "type": "callout", "variant": "key", "body": "**Density = mass ÷ volume.** Mass is measured in grams, volume in cubic centimetres (cm³)." }
      ]
    },
    {
      "heading": "🌊 Float or sink?",
      "blocks": [
        { "type": "prose", "body": ["An object **floats** if it is less dense than the liquid, and **sinks** if it is more dense."] },
        { "type": "cardGrid", "variant": "facts", "cards": [
          { "emoji": "🪵", "title": "Wood floats", "body": "Wood is less dense than water, so it stays on top." },
          { "emoji": "🪙", "title": "A coin sinks", "body": "Metal is more dense than water, so it drops to the bottom." },
          { "emoji": "🧊", "title": "Ice floats", "body": "Ice is slightly less dense than liquid water — a rare and important exception." }
        ] }
      ]
    },
    {
      "heading": "📖 Key words",
      "blocks": [
        { "type": "termList", "terms": [
          { "term": "Density", "meaning": "The mass packed into a given volume (mass ÷ volume)." },
          { "term": "Volume", "meaning": "The amount of space an object takes up." }
        ] }
      ]
    },
    {
      "heading": "✅ Quick check",
      "blocks": [
        { "type": "mcq", "title": "Quick check", "questions": [
          { "id": "q1", "prompt": "What is the formula for density?", "options": ["mass × volume", "mass ÷ volume", "volume ÷ mass"], "answer": 1 },
          { "id": "q2", "prompt": "An object floats when it is…", "options": ["more dense than the liquid", "less dense than the liquid", "the same colour as the liquid"], "answer": 1 }
        ] }
      ]
    }
  ]
}`;
