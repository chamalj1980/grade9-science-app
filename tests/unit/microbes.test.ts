import { describe, expect, it } from "vitest";
import { microbeMatches, microbeMatchLevels } from "../../src/data/microbeMatch";
import { microbeSortCards } from "../../src/data/microbeSortCards";
import {
  cardsForEffect,
  getMatch,
  getSortCard,
  isCorrectEffect,
  isCorrectMatch,
  matchesForField,
  totalMatches,
  totalSortCards
} from "../../src/utils/microbes";

describe("microbe matching (Exercise 1)", () => {
  it("counts every match across the three levels", () => {
    expect(totalMatches).toBe(microbeMatches.length);
    const levelTotal = microbeMatchLevels.reduce(
      (sum, level) => sum + level.matchIds.length,
      0
    );
    expect(levelTotal).toBe(totalMatches);
  });

  it("accepts a microbe only on its own job", () => {
    expect(isCorrectMatch("rhizobium-nitrogen", "rhizobium-nitrogen")).toBe(true);
    expect(isCorrectMatch("rhizobium-nitrogen", "yeast-bread")).toBe(false);
  });

  it("returns the matches for a field, and every id resolves", () => {
    for (const level of microbeMatchLevels) {
      const matches = matchesForField(level.id);
      expect(matches.map((match) => match.id)).toEqual(level.matchIds);
      for (const match of matches) {
        expect(match.field).toBe(level.id);
        expect(getMatch(match.id)).toBeDefined();
      }
    }
  });

  it("has unique match ids", () => {
    const ids = new Set(microbeMatches.map((match) => match.id));
    expect(ids.size).toBe(microbeMatches.length);
  });
});

describe("microbe sorting (Exercise 2)", () => {
  it("counts every sort card", () => {
    expect(totalSortCards).toBe(microbeSortCards.length);
  });

  it("checks a card against its own effect", () => {
    expect(isCorrectEffect("rhizobium", "beneficial")).toBe(true);
    expect(isCorrectEffect("rhizobium", "harmful")).toBe(false);
    expect(isCorrectEffect("anthrax", "harmful")).toBe(true);
    expect(isCorrectEffect("anthrax", "beneficial")).toBe(false);
  });

  it("splits cards into beneficial and harmful with both present", () => {
    const beneficial = cardsForEffect("beneficial");
    const harmful = cardsForEffect("harmful");
    expect(beneficial.length).toBeGreaterThan(0);
    expect(harmful.length).toBeGreaterThan(0);
    expect(beneficial.length + harmful.length).toBe(totalSortCards);
    for (const card of beneficial) {
      expect(card.effect).toBe("beneficial");
    }
  });

  it("resolves every sort card by id and keeps ids unique", () => {
    const ids = new Set(microbeSortCards.map((card) => card.id));
    expect(ids.size).toBe(microbeSortCards.length);
    for (const card of microbeSortCards) {
      expect(getSortCard(card.id)).toEqual(card);
    }
  });
});
