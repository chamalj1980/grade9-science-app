// Blood transfusion compatibility (spec sections 20.6 and 22). A donor is safe only
// when BOTH the ABO group rule and the Rhesus rule pass.
export type AboGroup = "A" | "B" | "AB" | "O";
export type RhFactor = "+" | "-";

export interface BloodType {
  abo: AboGroup;
  rh: RhFactor;
}

// Which donor ABO groups each recipient can safely receive.
export const compatibleAboDonors: Record<AboGroup, AboGroup[]> = {
  A: ["A", "O"],
  B: ["B", "O"],
  AB: ["A", "B", "AB", "O"],
  O: ["O"]
};

// Rh+ recipients accept either Rh; Rh- recipients accept Rh- only.
export const compatibleRhDonors: Record<RhFactor, RhFactor[]> = {
  "+": ["+", "-"],
  "-": ["-"]
};

export const aboGroups: AboGroup[] = ["A", "B", "AB", "O"];
export const rhFactors: RhFactor[] = ["+", "-"];

export const universalDonor: BloodType = { abo: "O", rh: "-" };
export const universalRecipient: BloodType = { abo: "AB", rh: "+" };

export function formatBloodType(type: BloodType): string {
  return `${type.abo}${type.rh}`;
}

// Every donor bag type, useful for building the donor tray.
export const allBloodTypes: BloodType[] = aboGroups.flatMap((abo) =>
  rhFactors.map((rh) => ({ abo, rh }))
);

export interface TransfusionResult {
  compatible: boolean;
  aboOk: boolean;
  rhOk: boolean;
  reason: string;
}

export function isAboCompatible(recipient: AboGroup, donor: AboGroup): boolean {
  return compatibleAboDonors[recipient].includes(donor);
}

export function isRhCompatible(recipient: RhFactor, donor: RhFactor): boolean {
  return compatibleRhDonors[recipient].includes(donor);
}

// Full check plus a student-friendly reason naming the rule that failed.
export function checkTransfusion(
  recipient: BloodType,
  donor: BloodType
): TransfusionResult {
  const aboOk = isAboCompatible(recipient.abo, donor.abo);
  const rhOk = isRhCompatible(recipient.rh, donor.rh);
  const compatible = aboOk && rhOk;
  const recipientLabel = formatBloodType(recipient);
  const donorLabel = formatBloodType(donor);

  let reason: string;
  if (compatible) {
    reason = `Safe transfusion. A ${recipientLabel} patient can receive ${donorLabel} blood.`;
  } else if (!aboOk && !rhOk) {
    reason = `Incompatible. Group ${recipient.abo} cannot receive group ${donor.abo}, and Rh${recipient.rh} cannot receive Rh${donor.rh}. The red cells would agglutinate.`;
  } else if (!aboOk) {
    reason = `Incompatible ABO groups. A group ${recipient.abo} patient can receive ${compatibleAboDonors[
      recipient.abo
    ].join(", ")}, not ${donor.abo}. The red cells would agglutinate.`;
  } else {
    reason = `Incompatible Rhesus factor. An Rh${recipient.rh} patient can receive Rh${compatibleRhDonors[
      recipient.rh
    ].join(", Rh")} only, not Rh${donor.rh}. The red cells would agglutinate.`;
  }

  return { compatible, aboOk, rhOk, reason };
}
