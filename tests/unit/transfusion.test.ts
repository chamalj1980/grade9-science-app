import { describe, expect, it } from "vitest";
import {
  aboGroups,
  allBloodTypes,
  checkTransfusion,
  compatibleAboDonors,
  isAboCompatible,
  isRhCompatible,
  rhFactors,
  universalDonor,
  universalRecipient,
  type BloodType
} from "../../src/utils/transfusion";

describe("transfusion compatibility", () => {
  it("matches the ABO compatibility table", () => {
    expect(compatibleAboDonors.A).toEqual(["A", "O"]);
    expect(compatibleAboDonors.B).toEqual(["B", "O"]);
    expect(compatibleAboDonors.AB).toEqual(["A", "B", "AB", "O"]);
    expect(compatibleAboDonors.O).toEqual(["O"]);
  });

  it("applies the Rhesus rule: minus receives minus only", () => {
    expect(isRhCompatible("+", "+")).toBe(true);
    expect(isRhCompatible("+", "-")).toBe(true);
    expect(isRhCompatible("-", "-")).toBe(true);
    expect(isRhCompatible("-", "+")).toBe(false);
  });

  it("requires BOTH ABO and Rh to pass", () => {
    // ABO ok but Rh fails
    expect(
      checkTransfusion({ abo: "A", rh: "-" }, { abo: "O", rh: "+" }).compatible
    ).toBe(false);
    // Rh ok but ABO fails
    expect(
      checkTransfusion({ abo: "O", rh: "+" }, { abo: "A", rh: "+" }).compatible
    ).toBe(false);
    // Both ok
    expect(
      checkTransfusion({ abo: "AB", rh: "+" }, { abo: "B", rh: "-" }).compatible
    ).toBe(true);
  });

  it("names the failing rule in the reason", () => {
    const rhFail = checkTransfusion({ abo: "A", rh: "-" }, { abo: "A", rh: "+" });
    expect(rhFail.aboOk).toBe(true);
    expect(rhFail.rhOk).toBe(false);
    expect(rhFail.reason).toMatch(/Rhesus/i);

    const aboFail = checkTransfusion({ abo: "O", rh: "+" }, { abo: "B", rh: "+" });
    expect(aboFail.reason).toMatch(/ABO/i);
  });

  it("confirms O- is the universal donor for every recipient", () => {
    const everyRecipient: BloodType[] = allBloodTypes;
    for (const recipient of everyRecipient) {
      expect(checkTransfusion(recipient, universalDonor).compatible).toBe(true);
    }
  });

  it("confirms AB+ is the universal recipient for every donor", () => {
    for (const donor of allBloodTypes) {
      expect(checkTransfusion(universalRecipient, donor).compatible).toBe(true);
    }
  });

  it("covers all 8 blood types and 64 donor/recipient combinations consistently", () => {
    expect(allBloodTypes).toHaveLength(8);

    let compatibleCount = 0;
    for (const recipient of allBloodTypes) {
      for (const donor of allBloodTypes) {
        const result = checkTransfusion(recipient, donor);
        const expected =
          isAboCompatible(recipient.abo, donor.abo) &&
          isRhCompatible(recipient.rh, donor.rh);
        expect(result.compatible).toBe(expected);
        if (result.compatible) {
          compatibleCount += 1;
        }
      }
    }

    // Sanity: not everything is compatible and not nothing is.
    expect(compatibleCount).toBeGreaterThan(0);
    expect(compatibleCount).toBeLessThan(64);
    expect(aboGroups).toHaveLength(4);
    expect(rhFactors).toHaveLength(2);
  });
});
