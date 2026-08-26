import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { watermarkImage } from "@/lib/watermark";

// ---------------------------------------------------------------------------
// Four providers, all end up going through the same watermark step before
// being returned to the client:
//  1. "free-fast"      -> Pollinations (flux model). No key.
//  2. "free-accurate"  -> Pollinations (nanobanana -> gptimage -> flux
//                          fallback chain). No key.
//  3. "huggingface"     -> Hugging Face Inference API (FLUX.1-schnell by
//                          default). Uses OUR server-side HUGGINGFACE_API_KEY
//                          from .env — the user never sees or enters a key
//                          for this one.
//  4. "gemini-byok"     -> User's own Gemini API key, called directly, their
//                          own quota/credits are used.
//
// Every image, no matter which provider produced it, gets a small
// "Muzammil" watermark stamped on the bottom-right corner before it's sent
// back to the browser. We fetch raw bytes server-side (not a bare URL) so
// we can (a) verify it's actually an image, not an error page, and
// (b) composite the watermark with sharp.
// ---------------------------------------------------------------------------

interface RawImage {
  buffer: Buffer;
  mimeType: string;
}

function aspectRatioFor(width: number, height: number) {
  const ratio = width / height;
  if (Math.abs(ratio - 1) < 0.05) return "1:1";
  if (ratio > 1.3) return "16:9";
  if (ratio > 1) return "4:3";
  if (ratio < 0.7) return "9:16";
  return "3:4";
}

async function fetchPollinationsImage(
  prompt: string,
  width: number,
  height: number,
  seed: number,
  model: string,
  timeoutMs = 45_000
): Promise<RawImage> {
  const base = process.env.POLLINATIONS_BASE_URL || "https://image.pollinations.ai/prompt";
  const encoded = encodeURIComponent(prompt.trim());
  const url = `${base}/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=${model}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    const contentType = res.headers.get("content-type") || "";

    if (!res.ok || !contentType.startsWith("image/")) {
      let detail = `status ${res.status}`;
      try {
        const text = await res.text();
        detail = text.slice(0, 200) || detail;
      } catch {
        // ignore
      }
      throw new Error(`Model "${model}" unavailable right now (${detail}).`);
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) {
      throw new Error(`Model "${model}" returned an empty image.`);
    }
    return { buffer, mimeType: contentType };
  } finally {
    clearTimeout(timer);
  }
}

async function generateFast(prompt: string, width: number, height: number, seed: number) {
  return fetchPollinationsImage(prompt, width, height, seed, "flux");
}

async function generateAccurate(prompt: string, width: number, height: number, seed: number) {
  const chain = ["nanobanana", "gptimage", "flux"];
  let lastError: unknown;
  for (const model of chain) {
    try {
      return await fetchPollinationsImage(prompt, width, height, seed, model);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("All accurate models are unavailable right now.");
}

async function callHuggingFaceModel(
  model: string,
  apiKey: string,
  prompt: string,
  width: number,
  height: number
): Promise<RawImage> {
  const url = `https://api-inference.huggingface.co/models/${model}`;

  const callOnce = () =>
    fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "image/png",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { width, height },
      }),
    });

  let res = await callOnce();

  // Serverless HF models cold-start; a 503 includes an estimated_time to wait.
  if (res.status === 503) {
    const info = await res.json().catch(() => ({} as any));
    const waitMs = Math.min(Math.ceil((info?.estimated_time ?? 12) * 1000), 20_000);
    await new Promise((r) => setTimeout(r, waitMs));
    res = await callOnce();
  }

  const contentType = res.headers.get("content-type") || "";
  if (!res.ok || !contentType.startsWith("image/")) {
    let detail = `status ${res.status}`;
    try {
      const text = await res.text();
      detail = text.slice(0, 200) || detail;
    } catch {
      // ignore
    }
    throw new Error(`Hugging Face model "${model}" unavailable right now (${detail}).`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  return { buffer, mimeType: contentType };
}

async function generateWithHuggingFace(
  prompt: string,
  width: number,
  height: number
): Promise<RawImage> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    throw new Error("Hugging Face isn't configured on this server yet (missing HUGGINGFACE_API_KEY).");
  }

  const primary = process.env.HUGGINGFACE_IMAGE_MODEL || "black-forest-labs/FLUX.1-schnell";
  const fallback = "stabilityai/stable-diffusion-xl-base-1.0";

  try {
    return await callHuggingFaceModel(primary, apiKey, prompt, width, height);
  } catch (primaryErr) {
    if (primary === fallback) throw primaryErr;
    try {
      return await callHuggingFaceModel(fallback, apiKey, prompt, width, height);
    } catch {
      throw primaryErr instanceof Error ? primaryErr : new Error("Hugging Face models are unavailable right now.");
    }
  }
}

async function generateWithGemini(
  prompt: string,
  width: number,
  height: number,
  apiKey: string
): Promise<RawImage> {
  const model = "gemini-2.5-flash-image";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["IMAGE"],
        imageConfig: { aspectRatio: aspectRatioFor(width, height) },
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const message = data?.error?.message || "Gemini request failed.";
    throw new Error(message);
  }

  const part = data?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
  if (!part) {
    throw new Error("Gemini did not return an image. Try adjusting your prompt.");
  }

  const mimeType = part.inlineData.mimeType || "image/png";
  const buffer = Buffer.from(part.inlineData.data, "base64");
  return { buffer, mimeType };
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Please sign in with Google to generate images." },
      { status: 401 }
    );
  }

  try {
    const {
      prompt,
      width = 1024,
      height = 1024,
      seed,
      provider = "free-fast",
      apiKey,
    } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const seedParam = seed ?? Math.floor(Math.random() * 1_000_000);
    const cleanPrompt = prompt.trim();

    let raw: RawImage;

    if (provider === "gemini-byok") {
      if (!apiKey || !apiKey.trim()) {
        return NextResponse.json(
          { error: "Add your Gemini API key first, or switch to a free option." },
          { status: 400 }
        );
      }
      raw = await generateWithGemini(cleanPrompt, width, height, apiKey.trim());
    } else if (provider === "huggingface") {
      raw = await generateWithHuggingFace(cleanPrompt, width, height);
    } else if (provider === "free-accurate") {
      raw = await generateAccurate(cleanPrompt, width, height, seedParam);
    } else {
      raw = await generateFast(cleanPrompt, width, height, seedParam);
    }

    const watermarked = await watermarkImage(raw.buffer, raw.mimeType);
    const imageUrl = `data:${watermarked.mime};base64,${watermarked.buffer.toString("base64")}`;

    return NextResponse.json({ imageUrl, provider });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
