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
    console.error("Translation error:", error);
    return text; // Return original text on error
  }
};

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
