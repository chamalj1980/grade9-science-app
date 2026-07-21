import type { ReactElement } from "react";

// A registry of hand-built SVG illustrations, keyed by id. The `figure` and
// `hotspotDiagram` blocks render one of these by id — so a bespoke, richly drawn visual
// becomes data-addressable ({ type: "figure", art: "tree-of-life" }) and reusable across
// chapters. This is the "signature visual" tier of the block library: a developer draws
// each scene once, then content authors (or the AI) simply reference it.
//
// Each illustration fills its container's width and keeps its own aspect ratio via the
// viewBox, so the same asset works as a standalone figure or as a hotspot-diagram base.

export type Illustration = () => ReactElement;

// ---- Early Earth: volcanoes, lightning and the first ocean ----
function PrimordialEarth(): ReactElement {
  return (
    <svg className="ill" viewBox="0 0 240 160" role="img" aria-label="The early Earth: volcanoes, lightning and a young ocean">
      <defs>
        <linearGradient id="pe-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1230" />
          <stop offset="0.55" stopColor="#7c2d12" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="pe-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e7490" />
          <stop offset="1" stopColor="#083344" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="240" height="160" rx="12" fill="url(#pe-sky)" />
      {/* hazy sun */}
      <circle cx="196" cy="40" r="20" fill="#f59e0b" opacity="0.35" />
      <circle cx="196" cy="40" r="11" fill="#fbbf24" opacity="0.6" />
      {/* clouds */}
      <g fill="#4b5563" opacity="0.55">
        <ellipse cx="60" cy="26" rx="26" ry="10" />
        <ellipse cx="90" cy="30" rx="20" ry="8" />
        <ellipse cx="160" cy="20" rx="22" ry="9" />
      </g>
      {/* lightning */}
      <polyline
        className="ill-flash"
        points="150,30 142,58 156,58 146,92"
        fill="none"
        stroke="#fde68a"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* volcano */}
      <path d="M20 118 L64 52 L108 118 Z" fill="#3f3f46" />
      <path d="M52 66 L64 52 L78 68 Q64 78 52 66 Z" fill="#f97316" />
      <path d="M64 54 q-6 26 -10 64" stroke="#fb923c" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.8" />
      <g className="ill-smoke" fill="#6b7280" opacity="0.5">
        <circle cx="64" cy="44" r="8" />
        <circle cx="72" cy="34" r="6" />
        <circle cx="58" cy="30" r="5" />
      </g>
      {/* ocean — the "primordial soup" */}
      <path d="M0 118 q60 -10 120 0 t120 0 V160 H0 Z" fill="url(#pe-sea)" />
      <path d="M0 120 q60 -8 120 0 t120 0" fill="none" stroke="#67e8f9" strokeWidth="2" opacity="0.5" />
      {/* the first cell forming */}
      <circle cx="150" cy="140" r="8" fill="#a7f3d0" opacity="0.9" />
      <circle cx="147" cy="137" r="2.4" fill="#065f46" />
    </svg>
  );
}

// ---- The tree of life: a trunk of time branching into the major groups ----
function TreeOfLife(): ReactElement {
  const nodes: { x: number; y: number; side: "l" | "r"; emoji: string; label: string; color: string }[] = [
    { x: 120, y: 182, side: "r", emoji: "🦠", label: "Bacteria", color: "#22c55e" },
    { x: 120, y: 156, side: "l", emoji: "🟢", label: "Algae", color: "#16a34a" },
    { x: 120, y: 130, side: "r", emoji: "🌿", label: "Plants", color: "#15803d" },
    { x: 120, y: 104, side: "l", emoji: "🐟", label: "Fish", color: "#0891b2" },
    { x: 120, y: 78, side: "r", emoji: "🐸", label: "Amphibians", color: "#65a30d" },
    { x: 120, y: 52, side: "l", emoji: "🦎", label: "Reptiles", color: "#ca8a04" },
    { x: 120, y: 28, side: "r", emoji: "🦅", label: "Birds & mammals", color: "#b45309" }
  ];
  return (
    <svg className="ill" viewBox="0 0 240 210" role="img" aria-label="The tree of life branching from a common ancestor into the major groups">
      <rect x="0" y="0" width="240" height="210" rx="12" fill="#f4f7f2" />
      {/* ground */}
      <rect x="0" y="196" width="240" height="14" fill="#e2e8e0" />
      <text x="120" y="206" textAnchor="middle" fontSize="8" fill="#64748b">common ancestor</text>
      {/* trunk */}
      <path d="M120 196 V22" stroke="#7c5b39" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* branches + nodes */}
      {nodes.map((n) => {
        const tipX = n.side === "r" ? n.x + 58 : n.x - 58;
        const labelAnchor = n.side === "r" ? "start" : "end";
        const labelX = n.side === "r" ? tipX + 12 : tipX - 12;
        return (
          <g key={n.label}>
            <path
              d={`M120 ${n.y} Q ${(120 + tipX) / 2} ${n.y - 10} ${tipX} ${n.y}`}
              stroke="#9a7b53"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx={tipX} cy={n.y} r="9" fill={n.color} />
            <text x={tipX} y={n.y + 3.5} textAnchor="middle" fontSize="10">{n.emoji}</text>
            <text x={labelX} y={n.y + 3.5} textAnchor={labelAnchor} fontSize="9" fontWeight="600" fill="#334155">
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ---- Rock strata: sedimentary layers with fossils, oldest at the bottom ----
// Also the base for the fossil hotspot diagram (marker %s match the fossil positions).
function RockStrata(): ReactElement {
  return (
    <svg className="ill" viewBox="0 0 240 180" role="img" aria-label="Layers of sedimentary rock with fossils, the oldest at the bottom">
      {/* layers, youngest (top) to oldest (bottom) */}
      <rect x="0" y="18" width="240" height="14" fill="#6f9e2f" />
      <rect x="0" y="32" width="240" height="30" fill="#d8c39b" />
      <rect x="0" y="62" width="240" height="30" fill="#c6a97e" />
      <rect x="0" y="92" width="240" height="30" fill="#a9895f" />
      <rect x="0" y="122" width="240" height="30" fill="#856a4c" />
      <rect x="0" y="152" width="240" height="28" fill="#5f4b36" />
      {/* subtle layer lines */}
      <g stroke="#00000022" strokeWidth="1">
        <line x1="0" y1="62" x2="240" y2="62" />
        <line x1="0" y1="92" x2="240" y2="92" />
        <line x1="0" y1="122" x2="240" y2="122" />
        <line x1="0" y1="152" x2="240" y2="152" />
      </g>
      {/* fossils */}
      {/* leaf — youngest layer */}
      <g transform="translate(60 47)" stroke="#3f2d16" strokeWidth="1.5" fill="none">
        <path d="M-9 6 Q0 -10 9 6 Q0 10 -9 6 Z" fill="#3f2d16" opacity="0.35" />
        <path d="M-6 4 L6 -2" />
      </g>
      {/* bone */}
      <g transform="translate(168 77)" fill="#efe6d2">
        <rect x="-12" y="-2.5" width="24" height="5" rx="2.5" />
        <circle cx="-12" cy="-4" r="3.5" /><circle cx="-12" cy="4" r="3.5" />
        <circle cx="12" cy="-4" r="3.5" /><circle cx="12" cy="4" r="3.5" />
      </g>
      {/* fish skeleton */}
      <g transform="translate(78 107)" stroke="#efe6d2" strokeWidth="1.6" fill="none">
        <path d="M-16 0 Q0 -9 16 0 Q0 9 -16 0 Z" />
        <path d="M16 0 l8 -5 v10 Z" fill="#efe6d2" />
        <path d="M-6 -6 v12 M2 -7 v14" />
        <circle cx="-11" cy="-1" r="1.4" fill="#efe6d2" />
      </g>
      {/* ammonite spiral */}
      <g transform="translate(172 137)" stroke="#efe6d2" strokeWidth="1.8" fill="none">
        <path d="M0 0 m0 -9 a9 9 0 1 1 -0.1 0 M0 0 m0 -5 a5 5 0 1 0 0.1 0" />
      </g>
      {/* trilobite — oldest layer */}
      <g transform="translate(92 166)" fill="#efe6d2">
        <ellipse cx="0" cy="0" rx="10" ry="6" />
        <path d="M-10 0 h20 M-6 -4 v8 M0 -5 v10 M6 -4 v8" stroke="#5f4b36" strokeWidth="1" />
      </g>
      {/* age axis */}
      <g stroke="#1f2937" strokeWidth="2" fill="#1f2937">
        <line x1="10" y1="36" x2="10" y2="168" />
        <path d="M10 168 l-3 -6 h6 Z" />
        <text x="16" y="42" fontSize="8" stroke="none">younger</text>
        <text x="16" y="166" fontSize="8" stroke="none">older</text>
      </g>
    </svg>
  );
}

export const illustrations: Record<string, Illustration> = {
  "primordial-earth": PrimordialEarth,
  "tree-of-life": TreeOfLife,
  "rock-strata": RockStrata
};

export function getIllustration(id: string): Illustration | undefined {
  return illustrations[id];
}
