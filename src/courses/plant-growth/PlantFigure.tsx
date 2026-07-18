import type { AuxinSide, Bend, LightDir } from "../../utils/plantGrowth";

interface PlantFigureProps {
  bend: Bend;
  auxinSide: AuxinSide;
  bushy: boolean;
  light: LightDir;
  title: string;
}

// Tip position for each way the shoot can grow. The stem is drawn as a smooth curve
// from the soil (100, 196) up to this tip, with a control point that gives it the bend.
const TIP: Record<Bend, { x: number; y: number; cx: number; cy: number }> = {
  up: { x: 100, y: 44, cx: 100, cy: 120 },
  left: { x: 52, y: 66, cx: 84, cy: 118 },
  right: { x: 148, y: 66, cx: 116, cy: 118 },
  none: { x: 100, y: 96, cx: 100, cy: 150 } // short stub when the apex is cut
};

// Where the sun sits for each light direction.
const SUN: Record<LightDir, { x: number; y: number }> = {
  left: { x: 24, y: 60 },
  right: { x: 176, y: 60 },
  top: { x: 100, y: 22 }
};

export function PlantFigure({ bend, auxinSide, bushy, light, title }: PlantFigureProps) {
  const tip = TIP[bend];
  const sun = SUN[light];
  const stem = `M100 196 Q ${tip.cx} ${tip.cy} ${tip.x} ${tip.y}`;

  return (
    <svg
      className="plant-figure"
      viewBox="0 0 200 240"
      role="img"
      aria-label={title}
    >
      <defs>
        <radialGradient id="pf-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* light source */}
      <circle cx={sun.x} cy={sun.y} r="34" fill="url(#pf-sun)" />
      <circle cx={sun.x} cy={sun.y} r="13" className="pf-sun-core" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            className="pf-ray"
            x1={sun.x + Math.cos(rad) * 16}
            y1={sun.y + Math.sin(rad) * 16}
            x2={sun.x + Math.cos(rad) * 24}
            y2={sun.y + Math.sin(rad) * 24}
          />
        );
      })}

      {/* soil + pot */}
      <path d="M64 196 L136 196 L128 232 L72 232 Z" className="pf-pot" />
      <rect x="60" y="188" width="80" height="12" rx="4" className="pf-pot-rim" />

      {/* auxin band on the shaded side of the stem */}
      {!bushy && auxinSide !== "even" && (
        <path
          d={stem}
          className={`pf-auxin pf-auxin-${auxinSide}`}
          fill="none"
        />
      )}

      {/* the stem */}
      <path d={stem} className="pf-stem" fill="none" />

      {/* a pair of leaves partway up */}
      <ellipse cx="78" cy="150" rx="18" ry="9" className="pf-leaf" transform="rotate(-24 78 150)" />
      <ellipse cx="122" cy="150" rx="18" ry="9" className="pf-leaf" transform="rotate(24 122 150)" />

      {bushy ? (
        <>
          {/* lateral buds sprouting because the apex is gone */}
          <circle cx={tip.x} cy={tip.y} r="4" className="pf-cut" />
          <g className="pf-buds">
            <ellipse cx="72" cy="118" rx="15" ry="8" className="pf-leaf pf-bud" transform="rotate(-30 72 118)" />
            <ellipse cx="128" cy="118" rx="15" ry="8" className="pf-leaf pf-bud" transform="rotate(30 128 118)" />
            <ellipse cx="70" cy="150" rx="13" ry="7" className="pf-leaf pf-bud" transform="rotate(-30 70 150)" />
            <ellipse cx="130" cy="150" rx="13" ry="7" className="pf-leaf pf-bud" transform="rotate(30 130 150)" />
          </g>
        </>
      ) : (
        // the apex: a growing tip bud
        <circle cx={tip.x} cy={tip.y} r="8" className="pf-apex" />
      )}
    </svg>
  );
}
