import { describe, expect, it } from "vitest";
import {
  calculateArea,
  calculateForce,
  calculatePressure
} from "../../src/utils/pressure";

describe("pressure utilities", () => {
  it("calculates pressure from force and area", () => {
    expect(calculatePressure(300, 2)).toBe(150);
    expect(calculatePressure(400, 2)).toBe(200);
    expect(calculatePressure(550, 2)).toBe(275);
    expect(calculatePressure(400, 1)).toBe(400);
  });

  it("calculates area from force and pressure", () => {
    expect(calculateArea(400, 200)).toBe(2);
  });

  it("calculates force from pressure and area", () => {
    expect(calculateForce(200, 2)).toBe(400);
  });

  it("rejects zero or negative area values", () => {
    expect(() => calculatePressure(300, 0)).toThrow(RangeError);
    expect(() => calculatePressure(300, -2)).toThrow(RangeError);
    expect(() => calculateForce(150, 0)).toThrow(RangeError);
    expect(() => calculateForce(150, -2)).toThrow(RangeError);
    expect(() => calculateArea(0, 200)).toThrow(RangeError);
    expect(() => calculateArea(-400, 200)).toThrow(RangeError);
    expect(() => calculateArea(400, 0)).toThrow(RangeError);
  });
});
