import type { Language } from "./types";

/**
 * Returns the localized value of a field on an object that follows the
 * `field` / `field_en` / `field_es` naming convention.
 *
 * Falls back to the French (default) value when the localized one is empty.
 *
 * @example
 *   getLocalizedField(tour, 'en', 'title')
 *   // returns tour.title_en if non-empty, otherwise tour.title
 */
export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  lang: Language,
  field: string,
): unknown {
  if (lang === "fr") return obj[field];
  const localized = obj[`${field}_${lang}`];
  if (Array.isArray(localized))
    return localized.length > 0 ? localized : obj[field];
  if (typeof localized === "string")
    return localized.trim() !== "" ? localized : obj[field];
  return localized ?? obj[field];
}

/**
 * Typed convenience wrapper for string fields.
 */
export function getLocalizedString<T extends Record<string, unknown>>(
  obj: T,
  lang: Language,
  field: string,
): string {
  return (getLocalizedField(obj, lang, field) as string) ?? "";
}

/**
 * Typed convenience wrapper for string array fields.
 */
export function getLocalizedArray<T extends Record<string, unknown>>(
  obj: T,
  lang: Language,
  field: string,
): string[] {
  return (getLocalizedField(obj, lang, field) as string[]) ?? [];
}
