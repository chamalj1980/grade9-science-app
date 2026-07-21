import type { Block } from "./schema";
import { Callout, CardGrid, Prose, SequenceStrip, TermList } from "./blocks/Presentational";
import { RevealTabs } from "./blocks/RevealTabs";
import { Stepper } from "./blocks/Stepper";
import { OrderTimeline } from "./blocks/OrderTimeline";
import { SortBins } from "./blocks/SortBins";
import { Mcq } from "./blocks/Mcq";
import { MarkDone } from "./blocks/MarkDone";

// The block registry: maps a block's `type` to its component. Adding a new KIND of
// interaction means adding one case here (and its schema type); adding new CONTENT of an
// existing kind is pure data. `blockId` identifies assessment blocks to the section's
// progress aggregator. The switch keeps each case's `block` type narrowed and checked.
export function BlockView({ block, blockId }: { block: Block; blockId: string }) {
  switch (block.type) {
    case "prose":
      return <Prose block={block} />;
    case "callout":
      return <Callout block={block} />;
    case "cardGrid":
      return <CardGrid block={block} />;
    case "sequenceStrip":
      return <SequenceStrip block={block} />;
    case "termList":
      return <TermList block={block} />;
    case "revealTabs":
      return <RevealTabs block={block} />;
    case "stepper":
      return <Stepper block={block} />;
    case "orderTimeline":
      return <OrderTimeline block={block} blockId={blockId} />;
    case "sortBins":
      return <SortBins block={block} blockId={blockId} />;
    case "mcq":
      return <Mcq block={block} blockId={blockId} />;
    case "markDone":
      return <MarkDone block={block} blockId={blockId} />;
    default: {
      // Exhaustiveness guard: a new block type without a case fails the type-check here.
      const _never: never = block;
      return _never;
    }
  }
}
