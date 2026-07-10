import type { ReactNode } from "react";

interface EyeFigureProps {
  children?: ReactNode;
  title: string;
}

// Shared schematic cross-section of the eye. Light enters from the LEFT (cornea/lens) and
// the image forms at the back on the RIGHT (retina), with the optic nerve leaving lower-right.
// Callers render their own overlays (clickable hotspots / numbered markers) as children in
// the same 0 0 360 300 coordinate space.
export function EyeFigure({ children, title }: EyeFigureProps) {
  return (
    <svg
      className="sense-figure"
      viewBox="0 0 360 300"
      role="img"
      aria-label={title}
    >
      {/* optic nerve leaving the back of the eye */}
      <path
        d="M300 172 Q342 186 352 214 Q320 198 292 194 Z"
        fill="#e7b49a"
        stroke="#c98b6a"
        strokeWidth="1.5"
      />

      {/* sclerotic layer (tough white outer) */}
      <circle cx="192" cy="150" r="116" fill="#f7f9fc" stroke="#c3ccd9" strokeWidth="3" />
      {/* choroid layer */}
      <circle cx="192" cy="150" r="106" fill="none" stroke="#c07d92" strokeWidth="6" />
      {/* retina */}
      <circle cx="192" cy="150" r="96" fill="none" stroke="#f0c6d1" strokeWidth="7" />
      {/* vitreous humour (interior jelly) */}
      <circle cx="192" cy="150" r="92" fill="#e9f1fb" />

      {/* cornea + anterior chamber, bulging out on the left */}
      <path
        d="M96 84 Q40 150 96 216 Q128 150 96 84 Z"
        fill="#d3e7f8"
        stroke="#93b4d8"
        strokeWidth="2"
        opacity="0.92"
      />

      {/* iris: two bands leaving a pupil gap in the middle */}
      <path d="M90 108 L124 140 L116 150 L82 122 Z" fill="#6f5334" />
      <path d="M90 192 L124 160 L116 150 L82 178 Z" fill="#6f5334" />
      {/* pupil (dark opening) */}
      <ellipse cx="98" cy="150" rx="7" ry="16" fill="#20303a" />

      {/* lens (biconvex) */}
      <ellipse cx="150" cy="150" rx="15" ry="36" fill="#cfe6fb" stroke="#83abd6" strokeWidth="2" />
      {/* ciliary muscle nubs at the lens edges */}
      <path d="M150 112 l9 -13 l-18 0 Z" fill="#b98a5a" />
      <path d="M150 188 l9 13 l-18 0 Z" fill="#b98a5a" />

      {/* fovea marker on the retina at the back */}
      <circle cx="290" cy="152" r="4" fill="#e0a52f" />

      {children}
    </svg>
  );
}
