// Hearing rules for the lesson's loudness meter and the Sense Clinic sound-safety round
// (textbook section 2.5). Pure, tested functions.

// The human audible frequency range.
export const HEARING_MIN_HZ = 20;
export const HEARING_MAX_HZ = 20000;

export type SoundRisk = "safe" | "caution" | "dangerous" | "harmful";

// How risky a sound level is for the ear, in decibels (dB).
//   < 70  safe       (woodland, bedroom, conversation)
//   70-85 caution    (busy office, street traffic — fine briefly, tiring over time)
//   85-120 dangerous (heavy machinery, rock concert — damages hearing with exposure)
//   >= 120 harmful   (jackhammer up close, jet engine — pain, immediate risk)
export function soundRisk(decibels: number): SoundRisk {
  if (decibels < 70) {
    return "safe";
  }
  if (decibels < 85) {
    return "caution";
  }
  if (decibels < 120) {
    return "dangerous";
  }
  return "harmful";
}

// Can the human ear hear a sound of this frequency? (20 Hz – 20,000 Hz, inclusive.)
export function isAudible(frequencyHz: number): boolean {
  return frequencyHz >= HEARING_MIN_HZ && frequencyHz <= HEARING_MAX_HZ;
}
