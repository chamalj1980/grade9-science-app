// A built-in sample of the JSON an AI author returns for a full chapter (lesson +
// exercise + recap), so the review flow can be demoed end-to-end without a model call.
export const SAMPLE_DRAFT_JSON = `{
  "title": "Density — why things float or sink",
  "sections": [
    {
      "kind": "lesson",
      "label": "Lesson",
      "hero": {
        "eyebrow": "Lesson",
        "title": "Density — why things float or sink",
        "intro": "🧊 Ice floats on water, but a coin sinks. The secret is how tightly matter is packed."
      },
      "groups": [
        {
          "heading": "⚖️ What is density?",
          "blocks": [
            { "type": "prose", "body": ["**Density** is how much mass is packed into a space. A small, heavy object is **dense**; a large, light one is not.", "We find it with a simple rule: **density = mass ÷ volume**."] },
            { "type": "callout", "variant": "key", "body": "**Density = mass ÷ volume.** Mass in grams, volume in cubic centimetres (cm³)." }
          ]
        },
        {
          "heading": "🌊 Float or sink?",
          "blocks": [
            { "type": "prose", "body": ["An object **floats** if it is less dense than the liquid, and **sinks** if it is more dense."] },
            { "type": "cardGrid", "variant": "facts", "cards": [
              { "emoji": "🪵", "title": "Wood floats", "body": "Wood is less dense than water, so it stays on top." },
              { "emoji": "🪙", "title": "A coin sinks", "body": "Metal is more dense than water, so it drops." },
              { "emoji": "🧊", "title": "Ice floats", "body": "Ice is slightly less dense than liquid water — a rare exception." }
            ] }
          ]
        }
      ]
    },
    {
      "kind": "exercise",
      "label": "Exercise 1",
      "hero": { "eyebrow": "Exercise 1", "title": "Float or sink?", "intro": "Sort each material by what it does in water." },
      "groups": [
        {
          "blocks": [
            { "type": "sortBins", "title": "Sort the materials",
              "bins": [
                { "id": "float", "title": "Floats", "emoji": "🛟", "hint": "less dense than water" },
                { "id": "sink", "title": "Sinks", "emoji": "⚓", "hint": "more dense than water" }
              ],
              "items": [
                { "id": "i1", "text": "Wood", "binId": "float", "reason": "Wood is less dense than water." },
                { "id": "i2", "text": "Iron nail", "binId": "sink", "reason": "Iron is far more dense than water." },
                { "id": "i3", "text": "Ice", "binId": "float", "reason": "Ice is slightly less dense than liquid water." },
                { "id": "i4", "text": "Stone", "binId": "sink", "reason": "Stone is more dense than water." }
              ] }
          ]
        }
      ]
    },
    {
      "kind": "exercise",
      "label": "Exercise 2",
      "hero": { "eyebrow": "Exercise 2", "title": "Quick check", "intro": "Test what you remember." },
      "groups": [
        {
          "blocks": [
            { "type": "mcq", "title": "Quick check", "questions": [
              { "id": "q1", "prompt": "What is the formula for density?", "options": ["mass × volume", "mass ÷ volume", "volume ÷ mass"], "answer": 1 },
              { "id": "q2", "prompt": "An object floats when it is…", "options": ["more dense than the liquid", "less dense than the liquid", "the same colour as the liquid"], "answer": 1 }
            ] }
          ]
        }
      ]
    },
    {
      "kind": "recap",
      "label": "Recap",
      "hero": { "eyebrow": "Recap", "title": "Density — recap", "intro": "The key points in one place for quick revision." },
      "groups": [
        {
          "heading": "Key points",
          "blocks": [
            { "type": "prose", "body": ["**Density = mass ÷ volume.**", "Less dense than the liquid → **floats**. More dense → **sinks**.", "Ice is less dense than water, so it floats."] },
            { "type": "termList", "terms": [
              { "term": "Density", "meaning": "The mass packed into a given volume (mass ÷ volume)." },
              { "term": "Volume", "meaning": "The amount of space an object takes up." }
            ] }
          ]
        }
      ]
    }
  ]
}`;
