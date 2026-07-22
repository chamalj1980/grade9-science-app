import type { Block, BlockType } from "../../content/schema";

// Block types the Lesson editor can currently create and edit with a structured form.
// The palette only offers these; more are added as their forms are built.
export const editableBlockTypes: BlockType[] = [
  "prose",
  "callout",
  "cardGrid",
  "figure",
  "mcq"
];

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
    default:
      return { type: "prose", body: ["New paragraph."] };
  }
}
