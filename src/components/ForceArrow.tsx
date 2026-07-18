import { arrowEnd, directionLabels, type Direction } from "../utils/force";

interface ForceArrowProps {
  magnitude: number;
  direction: Direction;
  scale?: number; // pixels per newton
  title: string;
  showParts?: boolean; // label the three parts of the vector
}

// Draws a force as the textbook does (section 4.4): a straight line from the point of
// application (a dot) whose LENGTH shows the magnitude and whose ARROWHEAD shows the
// direction. The object sits at the point of application in the centre of the stage.
export function ForceArrow({
  magnitude,
  direction,
  scale = 9,
  title,
  showParts = false
}: ForceArrowProps) {
  const cx = 150;
  const cy = 110;
  const end = arrowEnd(cx, cy, magnitude, direction, scale);
  const markerId = `fa-head-${direction}-${Math.round(magnitude)}`;

  // A short offset so the magnitude label sits beside the middle of the line.
  const midX = (cx + end.x) / 2;
  const midY = (cy + end.y) / 2;

  return (
    <svg className="force-arrow" viewBox="0 0 300 220" role="img" aria-label={title}>
      <defs>
        <marker
          id={markerId}
          markerWidth="7"
          markerHeight="7"
          refX="5"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0 L7 3.5 L0 7 Z" className="fa-head" />
        </marker>
      </defs>

      {/* the object the force acts on */}
      <rect x="126" y="86" width="48" height="48" rx="8" className="fa-object" />

      {magnitude > 0 && (
        <line
          x1={cx}
          y1={cy}
          x2={end.x}
          y2={end.y}
          className="fa-line"
          markerEnd={`url(#${markerId})`}
        />
      )}

      {/* point of application */}
      <circle cx={cx} cy={cy} r="5.5" className="fa-point" />

      {/* magnitude label */}
      {magnitude > 0 && (
        <text x={midX} y={midY - 8} className="fa-mag" textAnchor="middle">
          {magnitude} N
        </text>
      )}

      {showParts && magnitude > 0 && (
        <>
          <text x={end.x} y={end.y - 10} className="fa-part" textAnchor="middle">
            direction
          </text>
          <text x={cx} y={cy + 22} className="fa-part" textAnchor="middle">
            point of application
          </text>
        </>
      )}

      {magnitude === 0 && (
        <text x={cx} y={cy + 40} className="fa-empty" textAnchor="middle">
          no force
        </text>
      )}

      <title>{`${magnitude} N, ${directionLabels[direction]}`}</title>
    </svg>
  );
}
