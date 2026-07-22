import { describe, expect, it } from "vitest";
import { isSvgMarkup, sanitizeSvg } from "../../src/content/sanitizeSvg";

describe("isSvgMarkup", () => {
  it("recognises svg markup and rejects everything else", () => {
    expect(isSvgMarkup('<svg viewBox="0 0 10 10"></svg>')).toBe(true);
    expect(isSvgMarkup("  <svg>\n</svg>")).toBe(true);
    expect(isSvgMarkup("<div>not svg</div>")).toBe(false);
    expect(isSvgMarkup("tree-of-life")).toBe(false);
    expect(isSvgMarkup(undefined)).toBe(false);
    expect(isSvgMarkup("")).toBe(false);
  });
});

describe("sanitizeSvg", () => {
  it("keeps benign shapes and attributes intact", () => {
    const svg = '<svg viewBox="0 0 10 10"><rect x="1" y="1" width="8" height="8" fill="#f00"/></svg>';
    expect(sanitizeSvg(svg)).toBe(svg);
  });

  it("strips <script> blocks and their contents", () => {
    const out = sanitizeSvg('<svg><script>alert(1)</script><circle r="4"/></svg>');
    expect(out).not.toMatch(/script/i);
    expect(out).not.toContain("alert(1)");
    expect(out).toContain('<circle r="4"/>');
  });

  it("removes inline event handlers", () => {
    const out = sanitizeSvg('<svg><rect onload="steal()" onclick="x()" width="5"/></svg>');
    expect(out).not.toMatch(/onload/i);
    expect(out).not.toMatch(/onclick/i);
    expect(out).toContain('width="5"');
  });

  it("removes javascript: URLs and embedding elements", () => {
    const out = sanitizeSvg(
      '<svg><a xlink:href="javascript:evil()"><text>x</text></a><foreignObject></foreignObject></svg>'
    );
    expect(out).not.toMatch(/javascript:/i);
    expect(out).not.toMatch(/foreignObject/i);
  });
});
