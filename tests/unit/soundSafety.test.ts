import { describe, expect, it } from "vitest";
import {
  HEARING_MAX_HZ,
  HEARING_MIN_HZ,
  isAudible,
  soundRisk
} from "../../src/utils/soundSafety";

describe("sound safety", () => {
  it("labels quiet and conversational sound as safe", () => {
    expect(soundRisk(30)).toBe("safe"); // woodland
    expect(soundRisk(60)).toBe("safe"); // conversation
  });

  it("labels busy-street levels as caution", () => {
    expect(soundRisk(70)).toBe("caution");
    expect(soundRisk(84)).toBe("caution");
  });

  it("labels concert / machinery levels as dangerous", () => {
    expect(soundRisk(85)).toBe("dangerous");
    expect(soundRisk(110)).toBe("dangerous"); // rock concert
  });

  it("labels pain-threshold levels as harmful", () => {
    expect(soundRisk(120)).toBe("harmful");
    expect(soundRisk(140)).toBe("harmful"); // jet engine
  });

  it("treats the band edges consistently (85 and 120 step up)", () => {
    expect(soundRisk(69)).toBe("safe");
    expect(soundRisk(119)).toBe("dangerous");
  });

  it("knows the human audible range is 20 Hz - 20,000 Hz inclusive", () => {
    expect(HEARING_MIN_HZ).toBe(20);
    expect(HEARING_MAX_HZ).toBe(20000);
    expect(isAudible(20)).toBe(true);
    expect(isAudible(20000)).toBe(true);
    expect(isAudible(15000)).toBe(true);
  });

  it("rejects frequencies outside the audible range", () => {
    expect(isAudible(10)).toBe(false); // infrasound
    expect(isAudible(30000)).toBe(false); // ultrasound
  });
});
