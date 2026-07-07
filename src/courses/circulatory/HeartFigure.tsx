import type { ReactNode } from "react";

interface HeartFigureProps {
  children?: ReactNode;
  title: string;
}

// Shared longitudinal heart section. Callers render their own overlays (clickable
// hotspots, numbered markers) as children inside the same SVG coordinate space.
// Right side of the heart is drawn blue (oxygen-poor), left side red (oxygen-rich).
export function HeartFigure({ children, title }: HeartFigureProps) {
  return (
    <svg
      className="heart-figure"
      viewBox="0 0 360 340"
      role="img"
      aria-label={title}
    >
      {/* vessels above the heart */}
      <path d="M150 10 q10 40 -6 70 l-14 -4 q14 -30 4 -64 Z" fill="#dc2626" />
      <path d="M180 8 q-6 40 8 66 l14 -6 q-12 -28 -6 -60 Z" fill="#2563eb" />
      <rect x="205" y="14" width="20" height="66" rx="8" fill="#3b6fbf" />
      <rect x="96" y="255" width="20" height="60" rx="8" fill="#3b6fbf" />
      <rect
        x="243"
        y="86"
        width="16"
        height="34"
        rx="7"
        fill="#dc2626"
        transform="rotate(18 251 103)"
      />

      {/* heart body */}
      <path
        d="M70 95 q-25 60 20 140 q40 45 90 55 q50 -10 90 -55 q45 -80 20 -140 q-40 -30 -90 -20 q-50 -10 -90 20 Z"
        fill="#ffd7dd"
        stroke="#c2410c"
        strokeWidth="2"
      />
      <line
        x1="180"
        y1="95"
        x2="180"
        y2="300"
        stroke="#c2410c"
        strokeWidth="2"
        strokeDasharray="4 4"
      />

      {/* chambers: right side blue, left side pink/red */}
      <path
        d="M95 100 q-15 40 10 75 h70 v-80 q-40 -12 -80 5 Z"
        fill="#bcd4f5"
      />
      <path d="M185 95 q40 -12 80 5 q15 35 -8 75 h-72 Z" fill="#f7b8c2" />
      <path
        d="M95 180 q0 55 55 85 q20 8 25 3 v-95 h-70 q-4 3 -10 7 Z"
        fill="#9cc0ef"
      />
      <path
        d="M185 178 v92 q6 5 26 -3 q55 -30 55 -90 q-40 8 -81 1 Z"
        fill="#f299a8"
      />

      {/* valves */}
      <line
        x1="100"
        y1="176"
        x2="168"
        y2="176"
        stroke="#7a4b00"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="192"
        y1="174"
        x2="260"
        y2="174"
        stroke="#7a4b00"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="158" cy="86" r="6" fill="#f5b700" stroke="#8a6d00" />
      <circle cx="184" cy="82" r="6" fill="#f5b700" stroke="#8a6d00" />

      {children}
    </svg>
  );
}
