import pdfParse from "pdf-parse";

export async function extractTextFromPdfUrl(
  pdfUrl: string | null | undefined,
): Promise<string | null> {
  if (!pdfUrl || typeof pdfUrl !== "string" || pdfUrl.trim() === "") {
    console.warn("Invalid PDF URL provided:", pdfUrl);
    return null;
  }

  try {
    const response = await fetch(pdfUrl, {
      // Set a reasonable timeout (30 seconds)
      signal: AbortSignal.timeout(30000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; CacaLei/1.0)",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch PDF from ${pdfUrl}: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.includes("application/pdf")) {
      console.warn(
        `Unexpected content type for PDF URL ${pdfUrl}: ${contentType}`,
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfData = await pdfParse(buffer);

    return pdfData.text || null;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TimeoutError" || error.name === "AbortError") {
        console.error(`Timeout while fetching PDF from ${pdfUrl}`);
        return null;
      }

      console.error(`Error extracting text from PDF ${pdfUrl}:`, error.message);
    } else {
      console.error(`Unknown error extracting text from PDF ${pdfUrl}:`, error);
    }
    return null;
  }
}

