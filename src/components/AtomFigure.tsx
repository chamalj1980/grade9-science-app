import { electronShells } from "../utils/matter";

interface AtomFigureProps {
  protons: number;
  neutrons: number;
  electrons: number;
  title: string;
}

// Lays the nucleus particles out in a tight spiral so a growing nucleus stays compact
// and readable. Deterministic, so the same atom always looks the same.
function nucleusLayout(count: number): { x: number; y: number }[] {
  const spots: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      spots.push({ x: 0, y: 0 });
      continue;
    }
    const angle = i * 2.399963; // golden angle
    const radius = 3.1 * Math.sqrt(i);
    spots.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  }
  return spots;
}

// An animated Bohr-style atom drawn from live particle counts: protons and neutrons
// cluster in the nucleus, electrons ride rotating shells. Movement is CSS-driven (see
// styles.css) so it respects prefers-reduced-motion.
export function AtomFigure({ protons, neutrons, electrons, title }: AtomFigureProps) {
  const shells = electronShells(electrons);
  const nucleons = [
    ...Array.from({ length: protons }).map(() => "p" as const),
    ...Array.from({ length: neutrons }).map(() => "n" as const)
  ];
  // Interleave protons and neutrons so the nucleus looks mixed rather than split.
  nucleons.sort((a, b) => (a === b ? 0 : a === "p" ? -1 : 1));
  const mixed: ("p" | "n")[] = [];
  const ps = nucleons.filter((particle) => particle === "p");
  const ns = nucleons.filter((particle) => particle === "n");
  const longest = Math.max(ps.length, ns.length);
  for (let i = 0; i < longest; i++) {
    if (i < ps.length) mixed.push("p");
    if (i < ns.length) mixed.push("n");
  }
  const spots = nucleusLayout(mixed.length);

  return (
    <svg className="atom-figure" viewBox="0 0 220 220" role="img" aria-label={title}>
      {/* electron shells */}
      {shells.map((count, shellIndex) => {
        const radius = 34 + shellIndex * 26;
        return (
          <g key={shellIndex}>
            <circle
              cx="110"
              cy="110"
              r={radius}
              className="atom-shell"
            />
            <g
              className="atom-orbit"
              style={{
                // Alternate direction and vary speed so the shells don't move as one.
                animationDuration: `${9 + shellIndex * 5}s`,
                animationDirection: shellIndex % 2 === 0 ? "normal" : "reverse"
              }}
            >
              {Array.from({ length: count }).map((_, electronIndex) => {
                const angle = (electronIndex / count) * Math.PI * 2;
                return (
                  <circle
                    key={electronIndex}
                    cx={110 + Math.cos(angle) * radius}
                    cy={110 + Math.sin(angle) * radius}
                    r="5"
                    className="atom-electron"
                  />
                );
              })}
            </g>
          </g>
        );
      })}

      {/* nucleus */}
      <g className="atom-nucleus">
        {spots.map((spot, index) => (
          <circle
            key={index}
            cx={110 + spot.x}
            cy={110 + spot.y}
            r="4.4"
            className={mixed[index] === "p" ? "atom-proton" : "atom-neutron"}
          />
        ))}
      </g>

      {protons === 0 && neutrons === 0 && (
        <text x="110" y="114" className="atom-empty" textAnchor="middle">
          empty
        </text>
      )}
    </svg>
  );
}
