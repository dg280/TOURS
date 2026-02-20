import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const decodeHTMLEntities = (str: string) => {
  if (typeof str !== 'string') return str;
  // Browser-only DOMParser
  if (typeof window === 'undefined') return str;

  const doc = new DOMParser().parseFromString(str, 'text/html');
  let decoded = doc.documentElement.textContent || str;
  // Handle multiple rounds of encoding (like &amp;amp;#39;)
  while (decoded !== str && (decoded.includes('&') || decoded.includes('#'))) {
    str = decoded;
    const nextDoc = new DOMParser().parseFromString(str, 'text/html');
    decoded = nextDoc.documentElement.textContent || str;
  }
  return decoded;
};

export const prepareTourForEditing = <T>(item: T): T => {
  if (!item) return item;

  const decode = (val: unknown): unknown => {
    if (typeof val === 'string') return decodeHTMLEntities(val);
    if (Array.isArray(val)) return val.map(decode);
    if (val && typeof val === 'object') {
      const result: Record<string, unknown> = {};
      const obj = val as Record<string, unknown>;
      for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          result[k] = decode(obj[k]);
        }
      }
      return result;
    }
    return val;
  };

  return decode(item) as T;
};
export const extractIframeSrc = (input: string): string => {
  if (!input) return '';
  if (!input.includes('<iframe')) return input.trim();

  const match = input.match(/src=["']([^"']+)["']/);
  return match ? match[1] : input.trim();
};

export const isEmbeddableMapUrl = (url: string): boolean => {
  if (!url) return false;
  // Standard Google Maps embed URLs contain /embed/ or /maps/embed
  // shortened links (maps.app.goo.gl) or direct map links are NOT embeddable
  return url.includes('/embed') || url.includes('/maps/embed') || url.includes('google.com/maps/preview');
};
