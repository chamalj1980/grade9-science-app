import { Fragment, type ReactNode } from "react";

// Renders a content string with **bold** spans turned into <strong>. Kept deliberately
// tiny — the content model uses only this one inline convention so authored text stays
// readable as data. Extend here (e.g. *italic*) if the schema ever needs more.
export function richText(text: string): ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : <Fragment key={index}>{part}</Fragment>
  );
}
