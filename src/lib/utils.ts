import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Tour } from "./types"

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

export const prepareTourForEditing = (tour: Tour | any): any => {
  if (!tour) return tour;
  const decode = (val: any): any => {
    if (typeof val === 'string') return decodeHTMLEntities(val);
    if (Array.isArray(val)) return val.map(decode);
    if (val && typeof val === 'object') {
      const result: any = {};
      for (const k in val) {
        if (Object.prototype.hasOwnProperty.call(val, k)) {
          result[k] = decode(val[k]);
        }
      }
      return result;
    }
    return val;
  };
  return decode(tour);
};
