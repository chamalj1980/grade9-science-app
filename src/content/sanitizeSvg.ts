// Baseline sanitizer for inline SVG markup (teacher- or AI-authored, stored as data).
// Strips the common SVG XSS vectors before the markup is injected into the DOM:
//   • <script> / <style> blocks
//   • embedding elements that can host arbitrary HTML/JS (foreignObject, iframe, …)
//   • inline event-handler attributes (onload, onclick, …)
//   • javascript: URLs in href / xlink:href
//
// This is a pragmatic first line of defense for REVIEWED content (the pipeline is
// human-in-the-loop: draft → teacher review → publish). Before accepting UNTRUSTED SVG
// into a shared, publicly-served library, harden this with a vetted sanitizer such as
// DOMPurify configured with the SVG profile.

export function isSvgMarkup(markup: string | undefined): boolean {
  return !!markup && /^\s*<svg[\s>]/i.test(markup);
}

export function sanitizeSvg(markup: string): string {
  if (!markup) {
    return "";
  }
  return markup
    .replace(/<script\b[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style\s*>/gi, "")
    .replace(/<\/?(?:foreignObject|iframe|object|embed|script|style)\b[^>]*>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\s(?:xlink:href|href)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi, "")
    .trim();
}
