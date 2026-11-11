/**
 * Responsive image URLs through Vercel Image Optimization (/_vercel/image).
 *
 * Tour photos are uploaded once at up to 2000 px (and older ones were never
 * resized: 3-4 MB originals), but a card shows them ~366 px wide. The edge
 * resizes to the requested width and serves AVIF/WebP, so a card downloads
 * tens of KB instead of megabytes. Allowed widths and remote hosts are
 * declared in vercel.json ("images"); a width not listed there is a 400.
 *
 * `/_vercel/image` only exists on Vercel. In dev (and for data:/blob: URLs)
 * the original URL is returned untouched.
 */

/** Must all appear in vercel.json -> images.sizes. */
export const IMAGE_WIDTHS = [400, 800, 1200, 1600] as const;

const QUALITY = 75;

const canOptimize = (src: string) =>
  import.meta.env.PROD && /^(https:\/\/|\/(?!\/))/.test(src);

const variant = (src: string, width: number) =>
  `/_vercel/image?url=${encodeURIComponent(src)}&w=${width}&q=${QUALITY}`;

/** src + srcSet for an <img>. Pair with a `sizes` attribute. */
export function responsiveImage(
  src: string,
  widths: readonly number[] = [400, 800, 1200],
): { src: string; srcSet?: string } {
  if (!src || !canOptimize(src)) return { src };
  return {
    src: variant(src, widths[Math.floor(widths.length / 2)]),
    srcSet: widths.map((w) => `${variant(src, w)} ${w}w`).join(", "),
  };
}

/** Card grid: 1 column on mobile, 3 from md, inside a ~1150 px container. */
export const CARD_IMAGE_SIZES = "(min-width: 768px) 33vw, 100vw";
