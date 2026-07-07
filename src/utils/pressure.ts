export function validatePositiveArea(areaM2: number): void {
  if (!Number.isFinite(areaM2) || areaM2 <= 0) {
    throw new RangeError("Area must be a finite number greater than 0 m2.");
  }
}

export function calculatePressure(forceN: number, areaM2: number): number {
  validatePositiveArea(areaM2);

  return forceN / areaM2;
}

export function calculateForce(pressurePa: number, areaM2: number): number {
  validatePositiveArea(areaM2);

  return pressurePa * areaM2;
}

export function calculateArea(forceN: number, pressurePa: number): number {
  const areaM2 = forceN / pressurePa;

  validatePositiveArea(areaM2);

  return areaM2;
}
