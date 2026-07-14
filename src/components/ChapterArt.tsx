import type { ReactElement } from "react";
import type { ChapterArtId } from "../data/curriculum";
import { ModuleIllustration } from "./ModuleIllustration";

interface ChapterArtProps {
  art: ChapterArtId;
}

// One colourful illustration per chapter, shown on each Discovery Deck card. The four
// built chapters reuse the existing detailed ModuleIllustration scenes so their look is
// unchanged; the remaining chapters get their own topic emblem drawn here. Every emblem
// shares the 0 0 180 120 view box so cards line up. Colours are inline to keep this
// self-contained — no new global CSS is needed per chapter.
export function ChapterArt({ art }: ChapterArtProps) {
  // Built chapters delegate to the original illustrations.
  if (art === "microbes") return <ModuleIllustration theme="microbes" />;
  if (art === "senses") return <ModuleIllustration theme="sensory-system" />;
  if (art === "pressure") return <ModuleIllustration theme="pressure" />;
  if (art === "heart") return <ModuleIllustration theme="circulatory" />;

  return (
    <svg className="module-illustration" viewBox="0 0 180 120" role="img" aria-label={artLabels[art]}>
      {EMBLEMS[art]}
    </svg>
  );
}

const artLabels: Record<ChapterArtId, string> = {
  microbes: "Microbes",
  senses: "Eye and ear",
  pressure: "Pressure",
  heart: "Heart",
  digestion: "Stomach and food",
  photosynthesis: "Leaf in sunlight",
  flower: "A flower",
  matter: "A laboratory flask",
  atom: "An atom",
  bond: "Two bonded atoms",
  ph: "A pH test tube",
  metal: "A gold bar",
  motion: "A moving ball",
  circuit: "A lit bulb and battery",
  magnet: "A horseshoe magnet",
  light: "A prism splitting light",
  sound: "A speaker with sound waves",
  eco: "A tree by a pond",
  space: "The Sun and a ringed planet"
};

// Each emblem is a small group of shapes. Kept compact and recognisable.
const EMBLEMS: Record<Exclude<ChapterArtId, "microbes" | "senses" | "pressure" | "heart">, ReactElement> = {
  digestion: (
    <g>
      <path
        d="M74 22q36-6 42 30q6 40-24 50q-30 10-40-14q-6-18 12-24q-16-8-8-24q6-14 18-18Z"
        fill="#f9a8d4"
        stroke="#db2777"
        strokeWidth="4"
      />
      <circle cx="90" cy="70" r="7" fill="#db2777" opacity="0.6" />
      <circle cx="44" cy="44" r="15" fill="#ef4444" />
      <path d="M44 30c1-7 8-9 13-6" stroke="#15803d" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  ),
  photosynthesis: (
    <g>
      <circle cx="132" cy="40" r="18" fill="#facc15" />
      <g stroke="#f59e0b" strokeWidth="4" strokeLinecap="round">
        <path d="M132 12v-8" />
        <path d="M132 76v0" />
        <path d="M158 40h8" />
        <path d="M151 21l6-6" />
        <path d="M151 59l6 6" />
      </g>
      <path d="M30 96q4-52 62-58q0 54-62 58Z" fill="#16a34a" />
      <path d="M40 90q28-18 46-44" stroke="#dcfce7" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  ),
  flower: (
    <g>
      <path d="M90 108V64" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
      <path d="M90 88q-16-2-22-16" stroke="#15803d" strokeWidth="5" fill="none" strokeLinecap="round" />
      <g fill="#ec4899">
        <circle cx="90" cy="34" r="14" />
        <circle cx="68" cy="50" r="14" />
        <circle cx="112" cy="50" r="14" />
        <circle cx="77" cy="20" r="13" />
        <circle cx="103" cy="20" r="13" />
      </g>
      <circle cx="90" cy="38" r="12" fill="#facc15" />
    </g>
  ),
  matter: (
    <g>
      <path d="M78 24h24v26l22 44a8 8 0 0 1-7 12H63a8 8 0 0 1-7-12l22-44Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="4" />
      <path d="M68 74h44l14 28a6 6 0 0 1-5 9H59a6 6 0 0 1-5-9Z" fill="#fb923c" />
      <rect x="74" y="18" width="32" height="8" rx="4" fill="#ea580c" />
      <circle cx="82" cy="96" r="4" fill="#fff7ed" />
      <circle cx="98" cy="88" r="3" fill="#fff7ed" />
    </g>
  ),
  atom: (
    <g fill="none" stroke="#6366f1" strokeWidth="4">
      <ellipse cx="90" cy="60" rx="46" ry="18" />
      <ellipse cx="90" cy="60" rx="46" ry="18" transform="rotate(60 90 60)" />
      <ellipse cx="90" cy="60" rx="46" ry="18" transform="rotate(120 90 60)" />
      <circle cx="90" cy="60" r="9" fill="#4338ca" stroke="none" />
      <circle cx="136" cy="60" r="5" fill="#f43f5e" stroke="none" />
      <circle cx="67" cy="20" r="5" fill="#f43f5e" stroke="none" />
    </g>
  ),
  bond: (
    <g>
      <rect x="78" y="54" width="24" height="12" rx="6" fill="#94a3b8" />
      <circle cx="62" cy="60" r="26" fill="#38bdf8" stroke="#0284c7" strokeWidth="4" />
      <circle cx="118" cy="60" r="26" fill="#f472b6" stroke="#db2777" strokeWidth="4" />
      <circle cx="54" cy="52" r="7" fill="#e0f2fe" />
      <circle cx="110" cy="52" r="7" fill="#fce7f3" />
    </g>
  ),
  ph: (
    <g>
      <rect x="72" y="18" width="30" height="86" rx="15" fill="#fef3c7" stroke="#ca8a04" strokeWidth="4" />
      <path d="M76 62h22v34a11 11 0 0 1-22 0Z" fill="#e11d48" />
      <circle cx="87" cy="82" r="4" fill="#fecdd3" />
      <path d="M120 34l10 14a6 6 0 1 1-20 0Z" fill="#22c55e" />
    </g>
  ),
  metal: (
    <g>
      <path d="M40 70l20-16h72l12 16-20 16H52Z" fill="#fbbf24" stroke="#b45309" strokeWidth="3" />
      <path d="M40 70l20-16v20l-20 12Z" fill="#f59e0b" />
      <path d="M60 54h72l12 16H72Z" fill="#fcd34d" />
      <path d="M70 60l14 0" stroke="#fffbeb" strokeWidth="4" strokeLinecap="round" />
    </g>
  ),
  motion: (
    <g>
      <g stroke="#6366f1" strokeWidth="6" strokeLinecap="round" opacity="0.5">
        <path d="M30 60h16" />
        <path d="M40 44h16" />
        <path d="M40 76h16" />
      </g>
      <circle cx="96" cy="60" r="28" fill="#6366f1" />
      <circle cx="86" cy="50" r="8" fill="#c7d2fe" />
      <path d="M132 60h20m0 0l-8-8m8 8l-8 8" stroke="#f43f5e" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  circuit: (
    <g>
      <path d="M44 92h92" stroke="#0f766e" strokeWidth="5" fill="none" strokeLinecap="round" />
      <rect x="52" y="80" width="14" height="24" rx="2" fill="#22c55e" />
      <rect x="66" y="84" width="10" height="20" rx="2" fill="#16a34a" />
      <circle cx="118" cy="48" r="22" fill="#fde047" stroke="#f59e0b" strokeWidth="4" />
      <path d="M110 66h16v8h-16Z" fill="#94a3b8" />
      <g stroke="#f59e0b" strokeWidth="3" strokeLinecap="round">
        <path d="M118 18v-6" />
        <path d="M146 30l5-4" />
        <path d="M90 30l-5-4" />
      </g>
      <path d="M118 70v22M60 80V64h58v6" stroke="#0f766e" strokeWidth="4" fill="none" />
    </g>
  ),
  magnet: (
    <g>
      <path d="M56 30v30a34 34 0 0 0 68 0V30" fill="none" stroke="#94a3b8" strokeWidth="18" strokeLinecap="butt" />
      <rect x="47" y="26" width="18" height="20" fill="#ef4444" />
      <rect x="115" y="26" width="18" height="20" fill="#3b82f6" />
      <g stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" opacity="0.7">
        <path d="M56 98q34 20 68 0" />
      </g>
    </g>
  ),
  light: (
    <g>
      <path d="M92 30l34 60H58Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" opacity="0.85" />
      <path d="M28 60h56" stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" />
      <path d="M28 60h56" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
      <g strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M110 70l44-4" stroke="#ef4444" />
        <path d="M110 74l44 4" stroke="#f59e0b" />
        <path d="M110 78l44 12" stroke="#eab308" />
        <path d="M110 82l44 20" stroke="#22c55e" />
        <path d="M110 86l40 26" stroke="#3b82f6" />
      </g>
    </g>
  ),
  sound: (
    <g>
      <path d="M40 46h20l24-20v68l-24-20H40Z" fill="#6366f1" />
      <g stroke="#f43f5e" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M96 44a24 24 0 0 1 0 32" />
        <path d="M110 34a42 42 0 0 1 0 52" />
        <path d="M124 24a60 60 0 0 1 0 72" />
      </g>
    </g>
  ),
  eco: (
    <g>
      <path d="M20 100q40-14 140 0v6H20Z" fill="#4ade80" />
      <ellipse cx="120" cy="98" rx="30" ry="8" fill="#38bdf8" />
      <rect x="60" y="66" width="10" height="34" rx="3" fill="#92400e" />
      <circle cx="65" cy="52" r="26" fill="#16a34a" />
      <circle cx="48" cy="60" r="16" fill="#22c55e" />
      <circle cx="82" cy="60" r="16" fill="#22c55e" />
    </g>
  ),
  space: (
    <g>
      <circle cx="46" cy="44" r="22" fill="#f59e0b" />
      <circle cx="46" cy="44" r="22" fill="#fbbf24" opacity="0.5" />
      <circle cx="116" cy="66" r="26" fill="#0ea5e9" />
      <path d="M92 78a30 10 0 1 0 48-24" fill="none" stroke="#e2e8f0" strokeWidth="5" transform="rotate(-16 116 66)" />
      <circle cx="150" cy="30" r="3" fill="#fde047" />
      <circle cx="96" cy="26" r="2.5" fill="#fde047" />
    </g>
  )
};
