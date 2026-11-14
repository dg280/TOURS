export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

export function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle.
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);

  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * This function was adapted from the one in the react-easy-crop example:
 * https://github.com/ValentinH/react-easy-crop/blob/master/docs/index.html
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false }
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const rotRad = getRadianAngle(rotation);

  // calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // translate canvas context to a central point to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0);

  // croppedAreaPixels values are bounding box relative. When the user zooms
  // out below 1x to keep the whole photo, the crop area is larger than the
  // image and its x/y are negative: getImageData would return transparent
  // pixels there (black once encoded as JPEG). Instead, paint the output
  // canvas ourselves: a blurred, cover-scaled copy of the photo as backdrop,
  // then the photo at the exact offset the editor showed.
  const out = document.createElement("canvas");
  const outCtx = out.getContext("2d");
  if (!outCtx) {
    return null;
  }
  out.width = Math.max(1, Math.round(pixelCrop.width));
  out.height = Math.max(1, Math.round(pixelCrop.height));

  const coversFrame =
    pixelCrop.x >= 0 &&
    pixelCrop.y >= 0 &&
    pixelCrop.x + pixelCrop.width <= bBoxWidth &&
    pixelCrop.y + pixelCrop.height <= bBoxHeight;

  if (!coversFrame) {
    outCtx.fillStyle = "#ffffff";
    outCtx.fillRect(0, 0, out.width, out.height);
    const cover = Math.max(out.width / bBoxWidth, out.height / bBoxHeight);
    const w = bBoxWidth * cover;
    const h = bBoxHeight * cover;
    outCtx.save();
    // Canvas filter: Chrome/Edge/Firefox/Safari 18+. Older Safari ignores it
    // and draws the backdrop unblurred, which is still better than black bands.
    outCtx.filter = `blur(${Math.round(Math.max(out.width, out.height) / 40)}px)`;
    outCtx.drawImage(canvas, (out.width - w) / 2, (out.height - h) / 2, w, h);
    outCtx.restore();
  }

  outCtx.drawImage(canvas, -pixelCrop.x, -pixelCrop.y);

  return new Promise((resolve) => {
    out.toBlob(
      (file) => {
        resolve(file);
      },
      "image/jpeg",
      0.9,
    );
  });
}
