import type { MicrobeCategoryId } from "../../data/microbeGroups";

interface MicrobeFigureProps {
  type: MicrobeCategoryId;
  title: string;
}

// A shared, animated inline-SVG portrait of each microbe group — the microbes analog
// of HeartFigure / EyeFigure. Movement is driven by CSS animations (see styles.css) so
// it stays lightweight and respects prefers-reduced-motion. Each figure uses the same
// 0 0 200 160 view box so it drops into any layout at a consistent size.
export function MicrobeFigure({ type, title }: MicrobeFigureProps) {
  return (
    <svg
      className="microbe-figure"
      viewBox="0 0 200 160"
      role="img"
      aria-label={title}
    >
      {/* soft slide background */}
      <circle cx="100" cy="80" r="74" className="mf-slide" />

      {type === "bacteria" && (
        <g>
          {/* wiggling flagella behind the body */}
          <g className="mf-flagella">
            <path d="M60 80 q-14 -10 -26 -2 q-12 8 -22 0" />
            <path d="M60 90 q-14 8 -28 2 q-12 -4 -22 4" />
          </g>
          {/* rod body (bacillus) */}
          <rect x="58" y="62" width="92" height="36" rx="18" className="mf-body-bact" />
          {/* free DNA loop (no true nucleus) */}
          <path
            d="M92 80 q8 -12 20 0 q-8 12 -20 0 Z"
            className="mf-dna"
          />
          <circle cx="128" cy="80" r="4" className="mf-dot-bact" />
        </g>
      )}

      {type === "fungi" && (
        <g>
          {/* mother cell */}
          <circle cx="92" cy="84" r="34" className="mf-body-yeast" />
          <circle cx="82" cy="76" r="9" className="mf-nucleus" />
          {/* growing bud */}
          <g className="mf-bud">
            <circle cx="128" cy="60" r="15" className="mf-body-yeast" />
          </g>
          {/* bud scars */}
          <circle cx="74" cy="104" r="3.5" className="mf-scar" />
          <circle cx="108" cy="108" r="3.5" className="mf-scar" />
        </g>
      )}

      {type === "protozoa" && (
        <g className="mf-morph">
          {/* blobby amoeba with pseudopodia */}
          <path
            d="M64 70 q-18 -22 4 -30 q18 -6 26 8 q16 -18 34 -6 q16 12 6 30 q22 8 12 30 q-10 20 -34 12 q-8 20 -30 12 q-20 -8 -12 -28 q-20 -6 -6 -28 Z"
            className="mf-body-amoeba"
          />
          <circle cx="100" cy="82" r="12" className="mf-nucleus" />
          <circle cx="78" cy="72" r="6" className="mf-vacuole" />
          <circle cx="120" cy="94" r="7" className="mf-vacuole" />
        </g>
      )}

      {type === "algae" && (
        <g className="mf-sway">
          {/* filament of cells */}
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${44 + i * 40} 0)`}>
              <rect x="0" y="56" width="38" height="48" rx="10" className="mf-body-algae" />
              {/* spiral chloroplast */}
              <path
                d="M4 80 q9 -20 18 0 q9 20 18 0"
                className="mf-chloroplast"
              />
              <circle cx="19" cy="80" r="4" className="mf-nucleus" />
            </g>
          ))}
        </g>
      )}

      {type === "virus" && (
        <g className="mf-rotate">
          {/* spikes */}
          <g className="mf-spikes">
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i / 12) * Math.PI * 2;
              const x1 = 100 + Math.cos(a) * 34;
              const y1 = 80 + Math.sin(a) * 34;
              const x2 = 100 + Math.cos(a) * 48;
              const y2 = 80 + Math.sin(a) * 48;
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} className="mf-spike" />
                  <circle cx={x2} cy={y2} r="4" className="mf-spike-tip" />
                </g>
              );
            })}
          </g>
          {/* icosahedral capsid */}
          <polygon
            points="100,46 129,63 129,97 100,114 71,97 71,63"
            className="mf-capsid"
          />
          <path d="M92 80 q8 -10 16 0 q-8 10 -16 0 Z" className="mf-rna" />
        </g>
      )}
    </svg>
  );
}
