// Sort-the-Scene cards for Pressure Exercise 2 (spec 17.1). Each card belongs in
// either the "increase" or "decrease" bin, with a one-line scientific reason.
export type PressureCategory = "increase" | "decrease";

export interface PressureSortCard {
  id: string;
  label: string;
  emoji: string;
  category: PressureCategory;
  reason: string;
}

export const pressureSortCards: PressureSortCard[] = [
  {
    id: "sharp-knife",
    label: "Sharp knife",
    emoji: "🔪",
    category: "increase",
    reason: "A sharp edge has a very small contact area."
  },
  {
    id: "ice-skate",
    label: "Ice-skate blade",
    emoji: "⛸️",
    category: "increase",
    reason: "A narrow blade creates high pressure on the ice."
  },
  {
    id: "cutting-wire",
    label: "Thin cutting wire",
    emoji: "🧵",
    category: "increase",
    reason: "A thin wire acts over a very small area."
  },
  {
    id: "drawing-pin",
    label: "Drawing pin",
    emoji: "📌",
    category: "increase",
    reason: "The pointed tip has a very small area."
  },
  {
    id: "high-heel",
    label: "High heel",
    emoji: "👠",
    category: "increase",
    reason: "The heel concentrates force on a small area."
  },
  {
    id: "camel-feet",
    label: "Camel's wide feet",
    emoji: "🐫",
    category: "decrease",
    reason: "Wide feet spread weight over a large area."
  },
  {
    id: "bag-strap",
    label: "Broad bag strap",
    emoji: "🎒",
    category: "decrease",
    reason: "A broad strap spreads force over the shoulder."
  },
  {
    id: "truck-wheels",
    label: "Truck with many wheels",
    emoji: "🚚",
    category: "decrease",
    reason: "More wheels increase the total contact area."
  },
  {
    id: "tractor-tyres",
    label: "Tractor's wide tyres",
    emoji: "🚜",
    category: "decrease",
    reason: "Wide tyres spread force over soft ground."
  },
  {
    id: "flat-shoe",
    label: "Flat shoe",
    emoji: "👟",
    category: "decrease",
    reason: "A flat sole has a larger contact area than a heel."
  }
];
