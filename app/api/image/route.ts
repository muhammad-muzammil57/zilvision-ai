import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ---------------------------------------------------------------------------
// Three providers:
//  1. "free-fast"     -> Pollinations (flux model). No key.
//  2. "free-accurate" -> Pollinations (nanobanana, falling back to gptimage,
//                         falling back to flux if those are overloaded).
//                         No key needed, best prompt-following of the free
//                         tiers.
//  3. "gemini-byok"    -> User's own Gemini API key, called directly.
//
// IMPORTANT: for the Pollinations providers we fetch the image bytes on the
// server FIRST and check the response is actually an image before ever
// telling the client "success". This is what stops the broken-image-icon
// problem: previously we just handed the browser a URL and hoped for the
// best, so a 429/403/500 from Pollinations rendered as a broken <img>.
// ---------------------------------------------------------------------------

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
): Promise<string> {
  const base = process.env.POLLINATIONS_BASE_URL || "https://image.pollinations.ai/prompt";
  const encoded = encodeURIComponent(prompt.trim());
  const url = `${base}/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=${model}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { signal: controller.signal });
    const contentType = res.headers.get("content-type") || "";

    if (!res.ok || !contentType.startsWith("image/")) {
      // Pollinations returns JSON/HTML for errors (rate limit, model down, etc).
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
    return `data:${contentType};base64,${buffer.toString("base64")}`;
  } finally {
    clearTimeout(timer);
  }
}

async function generateFast(prompt: string, width: number, height: number, seed: number) {
  return fetchPollinationsImage(prompt, width, height, seed, "flux");
}

async function generateAccurate(prompt: string, width: number, height: number, seed: number) {
  // Try the strongest prompt-following model first, then degrade gracefully
  // instead of surfacing a broken image to the user.
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

async function generateWithGemini(prompt: string, width: number, height: number, apiKey: string) {
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
  return `data:${mimeType};base64,${part.inlineData.data}`;
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

    if (provider === "gemini-byok") {
      if (!apiKey || !apiKey.trim()) {
        return NextResponse.json(
          { error: "Add your Gemini API key first, or switch to a free option." },
          { status: 400 }
        );
      }
      const imageUrl = await generateWithGemini(cleanPrompt, width, height, apiKey.trim());
      return NextResponse.json({ imageUrl, provider });
    }

    if (provider === "free-accurate") {
      const imageUrl = await generateAccurate(cleanPrompt, width, height, seedParam);
      return NextResponse.json({ imageUrl, provider });
    }

    // default: free-fast
    const imageUrl = await generateFast(cleanPrompt, width, height, seedParam);
    return NextResponse.json({ imageUrl, provider });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
