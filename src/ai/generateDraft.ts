import { buildDraftPrompt, DRAFT_MAX_TOKENS } from "./authoringPrompt";
import { DEFAULT_MODEL } from "./models";

// OPTIONAL direct call to the Anthropic Messages API from the browser. This is a
// DEV/PREVIEW convenience for a single author using their OWN key — it is NOT how a
// launched product should work: a shipped app must call the model through a server proxy
// that holds the key, never expose a key in client code. The zero-backend workflow
// (assemble prompt → run in Claude → paste JSON back) is the safe default in the UI.
export async function generateDraftViaApi(
  chapterText: string,
  apiKey: string,
  model: string = DEFAULT_MODEL
): Promise<string> {
  const { system, user } = buildDraftPrompt(chapterText);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      // Required to allow calling the API directly from a browser.
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model,
      max_tokens: DRAFT_MAX_TOKENS,
      system,
      messages: [{ role: "user", content: user }]
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Anthropic API ${response.status}: ${detail.slice(0, 300)}`);
  }

  const data = (await response.json()) as {
    content?: { type: string; text?: string }[];
  };
  return (data.content ?? [])
    .filter((block) => block.type === "text")
    .map((block) => block.text ?? "")
    .join("")
    .trim();
}
