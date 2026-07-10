import type { ReactNode } from "react";

interface EarFigureProps {
  children?: ReactNode;
  title: string;
}

// Shared schematic cross-section of the ear. Outer ear (pinna) on the LEFT; sound travels
// right through the canal to the eardrum, the ossicles, then the cochlea and auditory nerve.
// Callers render overlays (hotspots / markers) as children in the 0 0 360 300 space.
export function EarFigure({ children, title }: EarFigureProps) {
  return (
    <svg
      className="sense-figure"
      viewBox="0 0 360 300"
      role="img"
      aria-label={title}
    >
      {/* faint head background so the outer/inner split reads clearly */}
      <rect x="150" y="24" width="196" height="252" rx="20" fill="#f4f1fb" />

      {/* pinna (outer ear flap) */}
      <path
        d="M78 92 Q26 96 26 156 Q26 214 82 210 Q60 182 62 152 Q60 118 84 100 Z"
        fill="#f2c9b8"
        stroke="#d59b83"
        strokeWidth="2"
      />

      {/* external auditory canal */}
      <path d="M74 134 H164 V166 H74 Z" fill="#f6ddcf" stroke="#d59b83" strokeWidth="1.5" />

      {/* tympanic membrane (eardrum) — slanted */}
      <line x1="164" y1="126" x2="172" y2="176" stroke="#b06a4a" strokeWidth="5" strokeLinecap="round" />

      {/* ossicles: three little bones as a zig-zag */}
      <path
        d="M176 150 l16 -24 l14 12 l14 -10"
        fill="none"
        stroke="#9a7b52"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* semicircular canals (three loops) — balance */}
      <g fill="none" stroke="#6f8fca" strokeWidth="5">
        <ellipse cx="252" cy="78" rx="20" ry="13" transform="rotate(-28 252 78)" />
        <ellipse cx="278" cy="86" rx="20" ry="12" transform="rotate(26 278 86)" />
        <ellipse cx="264" cy="104" rx="15" ry="11" />
      </g>

      {/* cochlea (spiral) — hearing */}
      <circle cx="250" cy="182" r="20" fill="#f2d0da" stroke="#c98aa0" strokeWidth="3" />
      <circle cx="252" cy="182" r="12" fill="none" stroke="#c98aa0" strokeWidth="3" />
      <circle cx="254" cy="182" r="5" fill="#c98aa0" />

      {/* auditory nerve to the brain */}
      <path
        d="M268 190 Q302 196 344 208"
        fill="none"
        stroke="#e0b28f"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* eustachian tube down to the throat */}
      <path
        d="M196 172 Q210 204 244 226"
        fill="none"
        stroke="#e6bfa6"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {children}
    </svg>
  );
}
