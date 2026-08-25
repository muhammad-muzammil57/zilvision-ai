import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Image generation requires a logged-in account.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Please sign in with Google to generate images." },
      { status: 401 }
    );
  }

  try {
    const { prompt, width = 1024, height = 1024, seed } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const base = process.env.POLLINATIONS_BASE_URL || "https://image.pollinations.ai/prompt";
    const encoded = encodeURIComponent(prompt.trim());
    const seedParam = seed ?? Math.floor(Math.random() * 1_000_000);

    // Pollinations.ai: free, no API key, no hard daily cap.
    const imageUrl = `${base}/${encoded}?width=${width}&height=${height}&seed=${seedParam}&nologo=true`;

    return NextResponse.json({ imageUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Something went wrong." }, { status: 500 });
  }
}
