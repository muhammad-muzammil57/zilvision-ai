import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ---------------------------------------------------------------------------
// Three providers:
//  1. "free-fast"     -> Pollinations (flux model). No key. Current default.
//  2. "free-accurate" -> Pollinations (nanobanana model = Google's Gemini
//                         image model, proxied for free). No key needed,
//                         much better prompt-following than flux/turbo.
//  3. "gemini-byok"    -> User's own Gemini API key. We call Google directly
//                         with the key they typed in. Their own quota/
//                         credits are used, nothing is billed to us and we
//                         never store the key server-side.
// ---------------------------------------------------------------------------

function aspectRatioFor(width: number, height: number) {
  const ratio = width / height;
  if (Math.abs(ratio - 1) < 0.05) return "1:1";
  if (ratio > 1.3) return "16:9";
  if (ratio > 1) return "4:3";
  if (ratio < 0.7) return "9:16";
  return "3:4";
}

async function generateWithPollinations(
  prompt: string,
  width: number,
  height: number,
  seed: number,
  model: "flux" | "nanobanana"
) {
  const base = process.env.POLLINATIONS_BASE_URL || "https://image.pollinations.ai/prompt";
  const encoded = encodeURIComponent(prompt.trim());
  const imageUrl = `${base}/${encoded}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=${model}`;
  return imageUrl;
}

async function generateWithGemini(
  prompt: string,
  width: number,
  height: number,
  apiKey: string
) {
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

    if (provider === "gemini-byok") {
      if (!apiKey || !apiKey.trim()) {
        return NextResponse.json(
          { error: "Add your Gemini API key first, or switch to a free option." },
          { status: 400 }
        );
      }
      const imageUrl = await generateWithGemini(prompt.trim(), width, height, apiKey.trim());
      return NextResponse.json({ imageUrl, provider });
    }

    if (provider === "free-accurate") {
      const imageUrl = await generateWithPollinations(
        prompt.trim(),
        width,
        height,
        seedParam,
        "nanobanana"
      );
      return NextResponse.json({ imageUrl, provider });
    }

    // default: free-fast
    const imageUrl = await generateWithPollinations(
      prompt.trim(),
      width,
      height,
      seedParam,
      "flux"
    );
    return NextResponse.json({ imageUrl, provider });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Something went wrong." }, { status: 500 });
  }
}
