/**
 * Translation service using Google Translate unofficial client endpoint.
 * No API key required. Suitable for moderate internal usage.
 */

export type SupportedLanguage = "fr" | "en" | "es";

const LANG_MAP: Record<SupportedLanguage, string> = {
  fr: "fr",
  en: "en",
  es: "es",
};

/**
 * Translates a single chunk of text via Google Translate client endpoint.
 */
async function translateSingleChunk(
  text: string,
  from: SupportedLanguage,
  to: SupportedLanguage
): Promise<string> {
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx&sl=${LANG_MAP[from]}&tl=${LANG_MAP[to]}&dt=t` +
    `&q=${encodeURIComponent(text)}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erreur réseau Google Translate (${response.status})`);
  }

  // Response shape: [[[translatedText, originalText, ...], ...], null, sourceLang, ...]
  const data = await response.json();

  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error("Réponse inattendue de Google Translate");
  }

  // Join all translation segments
  const translated: string = (data[0] as [string, string][])
    .map((segment) => segment[0] ?? "")
    .join("");

  if (!translated) {
    throw new Error("Google Translate a renvoyé une traduction vide");
  }

  return translated;
}

/**
 * Splits text into chunks ≤ maxLen, respecting sentence boundaries.
 */
function splitTextIntoChunks(text: string, maxLen: number): string[] {
  const chunks: string[] = [];
  let current = text;

  while (current.length > 0) {
    if (current.length <= maxLen) {
      chunks.push(current);
      break;
    }
    const area = current.substring(0, maxLen);
    let idx = area.lastIndexOf(". ");
    if (idx === -1) idx = area.lastIndexOf("! ");
    if (idx === -1) idx = area.lastIndexOf("? ");
    if (idx === -1) idx = area.lastIndexOf("\n");
    if (idx === -1) idx = area.lastIndexOf(" ");
    if (idx === -1 || idx < maxLen * 0.5) idx = maxLen;
    else idx += 1;
    chunks.push(current.substring(0, idx));
    current = current.substring(idx);
  }

  return chunks;
}

export const translateText = async (
  text: string,
  from: SupportedLanguage,
  to: SupportedLanguage
): Promise<string> => {
  if (!text.trim()) return "";
  if (from === to) return text;

  const chunks = splitTextIntoChunks(text, 1000);
  const translated = await Promise.all(
    chunks.map((chunk) => translateSingleChunk(chunk, from, to))
  );
  return translated.join("");
};

export const translateArray = async (
  items: string[],
  from: SupportedLanguage,
  to: SupportedLanguage
): Promise<string[]> => {
  if (!items || items.length === 0) return [];
  return Promise.all(items.map((item) => translateText(item, from, to)));
};
