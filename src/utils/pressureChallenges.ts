import { calculatePressure } from "./pressure";

export type PressureChallengeId =
  | "target-150"
  | "halve-pressure"
  | "reach-500";

export type PressureLevel = "low" | "medium" | "high";

export interface PressureReading {
  forceN: number;
  areaM2: number;
  pressurePa: number;
}

export interface HalvePressureBaseline {
  forceN: number;
  areaM2: number;
  pressurePa: number;
}

export interface PressureChallenge {
  id: PressureChallengeId;
  label: string;
  goal: string;
}

export interface PressureChallengeResult {
  isCorrect: boolean;
  title: string;
  explanation: string;
}

const pressureTolerancePa = 1;
const forceToleranceN = 0.01;
const areaToleranceM2 = 0.051;

export const pressureChallenges: PressureChallenge[] = [
  {
    id: "target-150",
    label: "Challenge 1",
    goal: "Make the pressure exactly 150 Pa."
  },
  {
    id: "halve-pressure",
    label: "Challenge 2",
    goal: "Keep the force the same but halve the pressure."
  },
  {
    id: "reach-500",
    label: "Challenge 3",
    goal: "Reach at least 500 Pa."
  }
];

export function createPressureReading(
  forceN: number,
  areaM2: number
): PressureReading {
  return {
    forceN,
    areaM2,
    pressurePa: calculatePressure(forceN, areaM2)
  };
}

export function createHalvePressureBaseline(
  forceN: number,
  areaM2: number
): HalvePressureBaseline {
  const pressurePa = calculatePressure(forceN, areaM2);

  return { forceN, areaM2, pressurePa };
}

// Shared thresholds so the gauge's colour bands and the Low/Medium/High label always
// agree. Low: below LOW_MAX. Medium: LOW_MAX up to MEDIUM_MAX. High: at/above MEDIUM_MAX.
// GAUGE_MAX is the pressure that fills the gauge to 100%.
export const pressureLowMaxPa = 150;
export const pressureMediumMaxPa = 500;
export const pressureGaugeMaxPa = 800;

export function getPressureLevel(pressurePa: number): PressureLevel {
  if (pressurePa < pressureLowMaxPa) {
    return "low";
  }

  if (pressurePa < pressureMediumMaxPa) {
    return "medium";
  }

  return "high";
}

export function getPressureGaugePercent(pressurePa: number): number {
  return Math.min(
    100,
    Math.max(0, Math.round((pressurePa / pressureGaugeMaxPa) * 100))
  );
}

// Where each colour band ends on the gauge (0–100), from the same thresholds/scale
// used above — so the pointer's position and the band it lands in always match.
export const gaugeLowBandPercent = (pressureLowMaxPa / pressureGaugeMaxPa) * 100;
export const gaugeMediumBandPercent =
  (pressureMediumMaxPa / pressureGaugeMaxPa) * 100;

export function getDentDepthPx(pressurePa: number): number {
  return Math.min(72, Math.max(8, Math.round(pressurePa / 10)));
}

export function validatePressureChallenge(
  challengeId: PressureChallengeId,
  reading: PressureReading,
  baseline?: HalvePressureBaseline
): PressureChallengeResult {
  if (challengeId === "target-150") {
    const isCorrect = Math.abs(reading.pressurePa - 150) <= pressureTolerancePa;

    return isCorrect
      ? {
          isCorrect: true,
          title: "Correct",
          explanation: "Your force divided by area gives about 150 Pa."
        }
      : {
          isCorrect: false,
          title: "Try again",
          explanation:
            reading.pressurePa > 150
              ? "Pressure is above 150 Pa. Lower the force or increase the area."
              : "Pressure is below 150 Pa. Raise the force or decrease the area."
        };
  }

  if (challengeId === "halve-pressure") {
    if (!baseline) {
      return {
        isCorrect: false,
        title: "Start challenge 2",
        explanation: "Choose Challenge 2 to store the starting force and pressure."
      };
    }

    const targetPressure = baseline.pressurePa / 2;
    const targetArea = baseline.areaM2 * 2;
    const forceUnchanged =
      Math.abs(reading.forceN - baseline.forceN) <= forceToleranceN;
    const pressureHalved =
      Math.abs(reading.pressurePa - targetPressure) <= pressureTolerancePa;
    const areaDoubled =
      Math.abs(reading.areaM2 - targetArea) <= areaToleranceM2;

    if (!forceUnchanged) {
      return {
        isCorrect: false,
        title: "Keep the force steady",
        explanation: `The force must stay at ${baseline.forceN} N for this challenge.`
      };
    }

    return pressureHalved && areaDoubled
      ? {
          isCorrect: true,
          title: "Correct",
          explanation:
            "When force stayed the same, doubling the area halved the pressure."
        }
      : {
          isCorrect: false,
          title: "Try again",
          explanation: `Keep ${baseline.forceN} N and make the area ${targetArea.toFixed(
            1
          )} m\u00b2 to reach about ${targetPressure.toFixed(0)} Pa.`
        };
  }

  const isCorrect = reading.pressurePa >= 500;

  return isCorrect
    ? {
        isCorrect: true,
        title: "Correct",
        explanation: "High pressure helps the wire cut into the soap."
      }
    : {
        isCorrect: false,
        title: "Try again",
        explanation:
          "Pressure is below 500 Pa. Increase the force or use a smaller area."
      };
}
