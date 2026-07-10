// Optics rules for the eye lesson's defect toggle and the Sense Clinic exercise
// (textbook section 2.2). Kept as pure, tested functions so the UI just renders results.

// Refractive states the ray-diagram toggle can show. Cataract and glaucoma are NOT
// refractive (they are opacity / nerve damage), so they are handled by the disease
// simulator, not by these focus-position functions.
export type RefractiveState = "normal" | "myopia" | "hypermetropia";

// Full set of defects the clinic can diagnose.
export type VisionDefect = RefractiveState | "cataract" | "glaucoma";

export type CorrectionLens = "concave" | "convex" | "none";

export type ObjectDistance = "near" | "far";

// Where the image forms relative to the retina.
export type ImagePosition = "front-of-retina" | "on-retina" | "behind-retina";

// The corrective lens for a defect. Myopia (short sight) uses a concave lens; long sight
// (hypermetropia) uses a convex lens. Everything else has no lens correction.
export function correctionLensFor(defect: VisionDefect): CorrectionLens {
  if (defect === "myopia") {
    return "concave";
  }
  if (defect === "hypermetropia") {
    return "convex";
  }
  return "none";
}

// Where the image lands for an object at `distance`, for a given refractive state, with or
// without the correct lens worn.
//   - Normal eye: always on the retina.
//   - Myopia: distant objects focus IN FRONT of the retina (near is fine).
//   - Hypermetropia: near objects focus BEHIND the retina (far is fine).
//   - With the correct lens, the blurred case is pulled back onto the retina.
export function imageLandsOn(
  state: RefractiveState,
  distance: ObjectDistance,
  corrected: boolean
): ImagePosition {
  if (state === "normal" || corrected) {
    return "on-retina";
  }

  if (state === "myopia") {
    return distance === "far" ? "front-of-retina" : "on-retina";
  }

  // hypermetropia
  return distance === "near" ? "behind-retina" : "on-retina";
}

// Does `lens` correctly treat `defect`? (For a normal eye the right answer is "none".)
export function isCorrectLens(defect: VisionDefect, lens: CorrectionLens): boolean {
  return lens === correctionLensFor(defect);
}

// Refractive defect implied by which object distances a patient sees clearly.
// Both clear -> normal. Only far blurred -> myopia. Only near blurred -> hypermetropia.
// Both blurred -> "unclear" (not a simple refractive error; likely a disease).
export function diagnoseRefractive(
  clearNear: boolean,
  clearFar: boolean
): RefractiveState | "unclear" {
  if (clearNear && clearFar) {
    return "normal";
  }
  if (clearNear && !clearFar) {
    return "myopia";
  }
  if (!clearNear && clearFar) {
    return "hypermetropia";
  }
  return "unclear";
}
