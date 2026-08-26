import sharp from "sharp";

const WATERMARK_TEXT = "✦ Muzammil";

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildWatermarkSvg(width: number, height: number) {
  const fontSize = Math.max(14, Math.round(width * 0.032));
  const paddingX = fontSize * 0.65;
  const paddingY = fontSize * 0.42;
  const approxCharWidth = fontSize * 0.58;
  const textWidth = WATERMARK_TEXT.length * approxCharWidth;
  const pillWidth = Math.round(textWidth + paddingX * 2);
  const pillHeight = Math.round(fontSize + paddingY * 2);
  const margin = Math.round(width * 0.025);

  const pillX = Math.max(0, width - pillWidth - margin);
  const pillY = Math.max(0, height - pillHeight - margin);
  const textX = pillX + paddingX;
  const textY = pillY + pillHeight - paddingY - fontSize * 0.2;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="${pillX}" y="${pillY}" width="${pillWidth}" height="${pillHeight}" rx="${pillHeight / 2}"
      fill="black" fill-opacity="0.4" />
    <text x="${textX}" y="${textY}" font-family="Arial, Helvetica, sans-serif" font-weight="700"
      font-size="${fontSize}" fill="#ffffff" fill-opacity="0.95">${escapeXml(WATERMARK_TEXT)}</text>
  </svg>`;
}

/**
 * Stamps the small "Muzammil" watermark pill onto the bottom-right corner
 * of an image, no matter which model generated it (Pollinations, Gemini,
 * Hugging Face, etc). Falls back to returning the original buffer if
 * watermarking fails for any reason, so a rendering glitch never blocks a
 * user from getting their image.
 */
export async function watermarkImage(
  buffer: Buffer,
  mime: string
): Promise<{ buffer: Buffer; mime: string }> {
  try {
    const image = sharp(buffer);
    const meta = await image.metadata();
    const width = meta.width || 1024;
    const height = meta.height || 1024;

    const svg = Buffer.from(buildWatermarkSvg(width, height));
    const isPng = mime.includes("png") || meta.format === "png";
    const format: "png" | "jpeg" = isPng ? "png" : "jpeg";

    const composited = image.composite([{ input: svg, top: 0, left: 0 }]);
    const outBuffer =
      format === "png"
        ? await composited.png().toBuffer()
        : await composited.jpeg({ quality: 92 }).toBuffer();

    return { buffer: outBuffer, mime: `image/${format}` };
  } catch {
    // Never let a watermarking failure turn into a broken image for the user.
    return { buffer, mime };
  }
}
