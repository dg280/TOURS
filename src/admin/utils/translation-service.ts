/**
 * Translation service — thin client over /api/translate.
 *
 * All the work happens server-side (see api/translate.ts). This file only
 * shapes the request and surfaces a readable error.
 *
 * History worth keeping in mind before "simplifying" this back into a direct
 * browser fetch: the admin previously called MyMemory, then Google's
 * unofficial `gtx` endpoint, straight from the page. Both were free, keyless
 * services with no quota contract, and both eventually started refusing us.
 * Google's refusal is an HTML 429 with no CORS headers, which the browser
 * turns into an opaque "Failed to fetch" before any of our error handling
 * runs. Keep the provider behind our own origin.
 */

import { supabase } from "@/lib/supabase";

export type SupportedLanguage = "fr" | "en" | "es";

/**
 * Translate a batch of strings in one round trip.
 * Returns translations in the same order, with blanks preserved.
 */
async function requestTranslation(
  texts: string[],
  from: SupportedLanguage,
  to: SupportedLanguage,
): Promise<string[]> {
  if (!supabase) {
    throw new Error("Session admin indisponible");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Session expirée — reconnecte-toi à l'admin");
  }

  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ texts, from, to }),
  });

  // Same origin, so a non-2xx always carries a readable body — unlike the
  // cross-origin setup this replaced.
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Échec de la traduction (${response.status})`);
  }

  const data = await response.json();

  if (!Array.isArray(data.translations)) {
    throw new Error("Réponse inattendue du service de traduction");
  }

  return data.translations;
}

export const translateText = async (
  text: string,
  from: SupportedLanguage,
  to: SupportedLanguage,
): Promise<string> => {
  if (!text.trim()) return "";
  if (from === to) return text;

  const [translated] = await requestTranslation([text], from, to);
  return translated ?? "";
};

export const translateArray = async (
  items: string[],
  from: SupportedLanguage,
  to: SupportedLanguage,
): Promise<string[]> => {
  if (!items || items.length === 0) return [];
  if (from === to) return items;

  // One request for the whole array — the old version fired a parallel
  // fetch per item, which is exactly the burst pattern that got us blocked.
  return requestTranslation(items, from, to);
};
