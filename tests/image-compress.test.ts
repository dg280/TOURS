import { test, expect } from "@playwright/test";

/**
 * Canvas code only tells the truth in a real browser, so these run in the page
 * and import the module straight from the Vite dev server.
 *
 * Images are generated in-page rather than downloaded: the test stays
 * hermetic, fast, and does not depend on the Supabase bucket still holding a
 * particular photo.
 */

const MODULE = "/src/admin/utils/image-compress.ts";

/** Build a JPEG blob of the requested size, in the page. */
const makeImage = `async (w, h) => {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "#1b4332"); grad.addColorStop(1, "#e9c46a");
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = "rgb(" + ((i * 37) % 255) + "," + ((i * 91) % 255) + "," + ((i * 53) % 255) + ")";
    ctx.fillRect((i * 137) % w, (i * 71) % h, 40, 40);
  }
  return await new Promise((r) => c.toBlob(r, "image/jpeg", 0.95));
}`;

test.describe("Image compression before upload", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("caps an oversized photo at 2000 px and re-encodes it as JPEG", async ({
    page,
  }) => {
    const out = await page.evaluate(
      async ({ mod, mk }) => {
        const { compressImage, MAX_SIDE } = await import(/* @vite-ignore */ mod);
        const src: Blob = await eval(mk)(5000, 3000);
        const res = await compressImage(src, "image/jpeg");
        const bmp = await createImageBitmap(res.blob);
        return {
          MAX_SIDE,
          compressed: res.compressed,
          contentType: res.contentType,
          width: bmp.width,
          height: bmp.height,
          srcSize: src.size,
          outSize: res.blob.size,
        };
      },
      { mod: MODULE, mk: makeImage },
    );

    expect(out.compressed).toBe(true);
    expect(out.contentType).toBe("image/jpeg");
    expect(Math.max(out.width, out.height)).toBe(out.MAX_SIDE);
    // 5000x3000 scaled by 2000/5000 keeps the aspect ratio.
    expect(out.height).toBe(1200);
    expect(out.outSize).toBeLessThan(out.srcSize);
    // Must survive base64 (+33%) inside Vercel's 4.5 MB body cap.
    expect(out.outSize).toBeLessThan(3.3 * 1024 * 1024);
  });

  test("never upscales an image that is already small", async ({ page }) => {
    const out = await page.evaluate(
      async ({ mod, mk }) => {
        const { compressImage } = await import(/* @vite-ignore */ mod);
        const src: Blob = await eval(mk)(320, 240);
        const res = await compressImage(src, "image/jpeg");
        const bmp = await createImageBitmap(res.blob);
        return { width: bmp.width, height: bmp.height };
      },
      { mod: MODULE, mk: makeImage },
    );

    expect(out.width).toBe(320);
    expect(out.height).toBe(240);
  });

  test("returns undecodable formats untouched instead of losing them", async ({
    page,
  }) => {
    const out = await page.evaluate(
      async ({ mod }) => {
        const { compressImage } = await import(/* @vite-ignore */ mod);
        // HEIC is what an iPhone produces; no canvas outside Safari decodes it.
        const fake = new Blob([new Uint8Array([1, 2, 3, 4])], { type: "image/heic" });
        const res = await compressImage(fake, "image/heic");
        return { compressed: res.compressed, contentType: res.contentType, size: res.blob.size };
      },
      { mod: MODULE },
    );

    expect(out.compressed).toBe(false);
    expect(out.contentType).toBe("image/heic");
    expect(out.size).toBe(4);
  });

  test("rewrites the storage path once the image became a JPEG", async ({
    page,
  }) => {
    const out = await page.evaluate(
      async ({ mod }) => {
        const { asJpegPath } = await import(/* @vite-ignore */ mod);
        return [
          asJpegPath("tours/3/1788180387230-j95s7.HEIC"),
          asJpegPath("tours/3/photo.png"),
          asJpegPath("stops/1/stop-0-123.jpg"),
        ];
      },
      { mod: MODULE },
    );

    expect(out).toEqual([
      "tours/3/1788180387230-j95s7.jpg",
      "tours/3/photo.jpg",
      "stops/1/stop-0-123.jpg",
    ]);
  });
});
