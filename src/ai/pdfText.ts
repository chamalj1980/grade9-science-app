// Client-side PDF text extraction via PDF.js. Lazy-imported so the ~1MB library and its
// worker only load when a teacher actually uploads a PDF (kept out of the main bundle).
// Works on text-layer PDFs (the Grade 9 textbook chapters); image-only/scanned PDFs would
// need OCR and return little or no text — the caller warns when the result is empty.
export async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const PdfWorker = (await import("pdfjs-dist/build/pdf.worker.min.mjs?worker")).default;
  pdfjs.GlobalWorkerOptions.workerPort = new PdfWorker();

  const data = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data });
  const doc = await loadingTask.promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
    const page = await doc.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/[ \t]+/g, " ")
      .trim();
    if (text) {
      pages.push(text);
    }
  }

  await loadingTask.destroy();
  return pages.join("\n\n").trim();
}
