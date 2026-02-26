/**
 * Simple translation service using MyMemory API
 * Documentation: https://mymemory.translated.net/doc/spec.php
 */

export type SupportedLanguage = "fr" | "en" | "es";

export const translateText = async (
  text: string,
  from: SupportedLanguage,
  to: SupportedLanguage
): Promise<string> => {
  if (!text.trim()) return "";
  if (from === to) return text;

  // MyMemory free tier has a ~500 character limit per request.
  // We split the text into chunks to safely stay within limits.
  const MAX_CHUNK_LENGTH = 450;
  
  // Split by sentences to avoid cutting in the middle of a word if possible
  const chunks = splitTextIntoChunks(text, MAX_CHUNK_LENGTH);
  const translatedChunks = await Promise.all(
    chunks.map((chunk) => translateSingleChunk(chunk, from, to))
  );

  return translatedChunks.join("");
};

/**
 * Translates a single chunk of text (< 500 chars)
 */
async function translateSingleChunk(
  text: string,
  from: SupportedLanguage,
  to: SupportedLanguage
): Promise<string> {
  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${from}|${to}`
    );

    if (!response.ok) {
      throw new Error("Translation service responded with an error");
    }

    const data = await response.json();
    return data.responseData.translatedText || text;
  } catch (error) {
    console.error("Translation error for chunk:", error);
    return text;
  }
}

/**
 * Splits a text into chunks of roughly maxLen, trying to respect sentences.
 */
function splitTextIntoChunks(text: string, maxLen: number): string[] {
  const chunks: string[] = [];
  let currentText = text;

  while (currentText.length > 0) {
    if (currentText.length <= maxLen) {
      chunks.push(currentText);
      break;
    }

    // Look for the last sentence end (., !, ?) or space within the limit
    let splitIndex = -1;
    const searchArea = currentText.substring(0, maxLen);
    
    // Try to find a period followed by a space
    splitIndex = searchArea.lastIndexOf(". ");
    if (splitIndex === -1) splitIndex = searchArea.lastIndexOf("! ");
    if (splitIndex === -1) splitIndex = searchArea.lastIndexOf("? ");
    if (splitIndex === -1) splitIndex = searchArea.lastIndexOf("\n");
    if (splitIndex === -1) splitIndex = searchArea.lastIndexOf(" ");

    // If no good split point found, just hard cut at maxLen
    if (splitIndex === -1 || splitIndex < maxLen * 0.5) {
      splitIndex = maxLen;
    } else {
      splitIndex += 1; // Include the space, punctuation or newline
    }

    chunks.push(currentText.substring(0, splitIndex));
    currentText = currentText.substring(splitIndex);
  }

  return chunks;
}

/**
 * Translates an array of strings
 */
export const translateArray = async (
  items: string[],
  from: SupportedLanguage,
  to: SupportedLanguage
): Promise<string[]> => {
  if (!items || items.length === 0) return [];
  
  // To avoid hitting rate limits or making too many requests, we join and translate if suitable,
  // or translate items individually if they are short.
  // For simplicity, we translate one by one here.
  return Promise.all(items.map((item) => translateText(item, from, to)));
};
