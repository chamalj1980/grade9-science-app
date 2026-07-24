import type { Block, BlockType } from "../../content/schema";

let counter = 0;

// Stable-enough unique id for authored items (mcq questions, etc.). Not cryptographic —
// just needs to be unique within a draft.
export function uid(prefix = "id"): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter}`;
}

// A sensible starter instance for each block type, so a freshly-added block renders
// something immediately and the teacher edits from there.
export function createStarterBlock(type: BlockType): Block {
  switch (type) {
    case "prose":
      return { type: "prose", body: ["Write a paragraph. Use **bold** for key terms."] };
    case "callout":
      return { type: "callout", variant: "key", body: "A key point worth remembering." };
    case "cardGrid":
      return {
        type: "cardGrid",
        variant: "facts",
        cards: [{ emoji: "⭐", title: "Card title", body: "Card detail." }]
      };
    case "figure":
      return { type: "figure", art: "tree-of-life", caption: "" };
    case "mcq":
      return {
        type: "mcq",
        title: "Quick check",
        questions: [
          { id: uid("q"), prompt: "Your question?", options: ["Option A", "Option B"], answer: 0 }
        ]
      };
    case "termList":
      return {
        type: "termList",
        terms: [{ term: "New term", meaning: "What it means." }]
      };
    case "sortBins": {
      const binA = uid("bin");
      const binB = uid("bin");
      return {
        type: "sortBins",
        title: "Sort into groups",
        bins: [
          { id: binA, title: "Group A", emoji: "🅰️" },
          { id: binB, title: "Group B", emoji: "🅱️" }
        ],
        items: [
          { id: uid("it"), text: "First item", binId: binA },
          { id: uid("it"), text: "Second item", binId: binB }
        ]
      };
    }
    case "orderTimeline":
      return {
        type: "orderTimeline",
        rounds: [
          {
            id: uid("round"),
            title: "Put these in order",
            prompt: "Arrange them, first to last.",
            order: [
              { id: uid("o"), emoji: "1️⃣", label: "First" },
              { id: uid("o"), emoji: "2️⃣", label: "Second" },
              { id: uid("o"), emoji: "3️⃣", label: "Third" }
            ]
          }
        ]
      };
    default:
      return { type: "prose", body: ["New paragraph."] };
  }
}
