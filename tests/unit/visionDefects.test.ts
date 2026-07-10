import { describe, expect, it } from "vitest";
import {
  correctionLensFor,
  diagnoseRefractive,
  imageLandsOn,
  isCorrectLens
} from "../../src/utils/visionDefects";

describe("vision defect optics", () => {
  it("prescribes concave for myopia and convex for hypermetropia", () => {
    expect(correctionLensFor("myopia")).toBe("concave");
    expect(correctionLensFor("hypermetropia")).toBe("convex");
  });

  it("prescribes no lens for a normal eye or a non-refractive disease", () => {
    expect(correctionLensFor("normal")).toBe("none");
    expect(correctionLensFor("cataract")).toBe("none");
    expect(correctionLensFor("glaucoma")).toBe("none");
  });

  it("focuses every distance on the retina for a normal eye", () => {
    expect(imageLandsOn("normal", "near", false)).toBe("on-retina");
    expect(imageLandsOn("normal", "far", false)).toBe("on-retina");
  });

  it("puts a myopic eye's distant image in front of the retina", () => {
    expect(imageLandsOn("myopia", "far", false)).toBe("front-of-retina");
    // Near objects are still fine for short sight.
    expect(imageLandsOn("myopia", "near", false)).toBe("on-retina");
  });

  it("puts a hypermetropic eye's near image behind the retina", () => {
    expect(imageLandsOn("hypermetropia", "near", false)).toBe("behind-retina");
    // Distant objects are still fine for long sight.
    expect(imageLandsOn("hypermetropia", "far", false)).toBe("on-retina");
  });

  it("pulls the blurred image back onto the retina once corrected", () => {
    expect(imageLandsOn("myopia", "far", true)).toBe("on-retina");
    expect(imageLandsOn("hypermetropia", "near", true)).toBe("on-retina");
  });

  it("accepts only the matching lens as the correct treatment", () => {
    expect(isCorrectLens("myopia", "concave")).toBe(true);
    expect(isCorrectLens("myopia", "convex")).toBe(false);
    expect(isCorrectLens("hypermetropia", "convex")).toBe(true);
    expect(isCorrectLens("normal", "none")).toBe(true);
  });

  it("diagnoses a refractive defect from which distances are clear", () => {
    expect(diagnoseRefractive(true, true)).toBe("normal");
    expect(diagnoseRefractive(true, false)).toBe("myopia"); // near clear, far blurry
    expect(diagnoseRefractive(false, true)).toBe("hypermetropia"); // near blurry, far clear
    expect(diagnoseRefractive(false, false)).toBe("unclear"); // likely a disease
  });
});
