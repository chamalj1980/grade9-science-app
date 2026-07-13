import type { LearningModule } from "../types";

interface ModuleIllustrationProps {
  theme: LearningModule["theme"];
}

export function ModuleIllustration({ theme }: ModuleIllustrationProps) {
  if (theme === "pressure") {
    return (
      <svg
        className="module-illustration"
        viewBox="0 0 180 120"
        role="img"
        aria-label="Block pressing on a soft surface"
      >
        <rect x="20" y="92" width="140" height="16" rx="8" className="svg-surface" />
        <rect x="66" y="30" width="48" height="58" rx="7" className="svg-block" />
        <path d="M90 12v40" className="svg-force" />
        <path d="M78 42l12 14 12-14" className="svg-force" />
        <path d="M60 92c12 12 48 12 60 0" className="svg-dent" />
      </svg>
    );
  }

  if (theme === "sensory-system") {
    return (
      <svg
        className="module-illustration"
        viewBox="0 0 180 120"
        role="img"
        aria-label="An eye with sound waves"
      >
        <path
          className="svg-eye-outline"
          d="M16 60C50 28 116 28 150 60C116 92 50 92 16 60Z"
        />
        <circle className="svg-eye-iris" cx="83" cy="60" r="25" />
        <circle className="svg-eye-pupil" cx="83" cy="60" r="12" />
        <circle className="svg-eye-shine" cx="75" cy="51" r="5" />
        <path className="svg-sound" d="M150 44c11 10 11 22 0 32" />
        <path className="svg-sound" d="M161 37c17 14 17 32 0 46" />
      </svg>
    );
  }

  if (theme === "microbes") {
    return (
      <svg
        className="module-illustration"
        viewBox="0 0 180 120"
        role="img"
        aria-label="Microbes seen through a magnifying glass"
      >
        <circle className="svg-microbe-body" cx="70" cy="60" r="40" />
        {/* a rod-shaped bacterium */}
        <rect className="svg-microbe-cell" x="46" y="40" width="30" height="12" rx="6" transform="rotate(-18 61 46)" />
        {/* a round microbe with a flagellum */}
        <circle className="svg-microbe-cell" cx="82" cy="70" r="11" />
        <path className="svg-microbe-tail" d="M92 74c10 3 14 10 12 18" />
        {/* a small cluster */}
        <circle className="svg-microbe-cell" cx="58" cy="78" r="6" />
        <circle className="svg-microbe-cell" cx="48" cy="70" r="5" />
        {/* magnifying-glass rim and handle */}
        <circle className="svg-microbe-lens" cx="70" cy="60" r="40" />
        <path className="svg-microbe-handle" d="M99 89l24 24" />
      </svg>
    );
  }

  return (
    <svg
      className="module-illustration"
      viewBox="0 0 180 120"
      role="img"
      aria-label="Simple heart and blood vessel paths"
    >
      <path
        className="svg-heart-left"
        d="M88 96C52 70 35 52 35 33c0-13 10-23 23-23 10 0 18 6 23 14 5-8 13-14 23-14 13 0 23 10 23 23 0 19-17 37-53 63z"
      />
      <path
        className="svg-heart-right"
        d="M90 96c36-26 53-44 53-63 0-13-10-23-23-23-10 0-18 6-23 14-3-5-6-8-9-10z"
      />
      <path d="M49 20c-20 10-25 29-14 49" className="svg-vessel-blue" />
      <path d="M131 20c20 10 25 29 14 49" className="svg-vessel-red" />
    </svg>
  );
}