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

  const decode = (val: any): any => {
    if (typeof val === 'string') return decodeHTMLEntities(val);
    if (Array.isArray(val)) return val.map(decode);
    if (val && typeof val === 'object') {
      const result: Record<string, any> = {};
      for (const k in val) {
        if (Object.prototype.hasOwnProperty.call(val, k)) {
          result[k] = decode((val as any)[k]);
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
