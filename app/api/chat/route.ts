import { NextRequest, NextResponse } from "next/server";

// Chat stays free for everyone — no session check here on purpose.
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is missing on the server. Add it to .env.local." },
        { status: 500 }
      );
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are ZilVision AI, a helpful, friendly assistant. Format every answer in clean Markdown: use headings, **bold**, bullet or numbered lists, and code blocks where relevant, the way Gemini or ChatGPT would. Keep answers clear, well-structured, and not overly long.",
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return NextResponse.json({ error: errText }, { status: groqRes.status });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Something went wrong." }, { status: 500 });
  }
}
