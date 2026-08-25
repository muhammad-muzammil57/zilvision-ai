"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Aperture, User, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Aik business idea suggest karein Pakistan ke liye",
  "Explain black holes in simple words",
  "Write a short poem about the moon",
  "5 healthy breakfast ideas dein",
];

export default function ChatUI() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat failed");
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (e: any) {
      setMessages([
        ...next,
        { role: "assistant", content: `⚠️ ${e.message || "Something went wrong. Please try again."}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 sm:px-6 py-6">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
          <div className="relative h-16 w-16 flex items-center justify-center rounded-full bg-aperture-radial">
            <Aperture className="h-8 w-8 text-aperture animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-700 mb-2">
              What's on your mind today?
            </h1>
            <p className="text-mist text-sm">Chat is free, no sign-in needed.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="glass rounded-xl px-4 py-3 text-left text-sm text-mist hover:text-paper hover:border-aperture/50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 space-y-5 pb-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="h-8 w-8 shrink-0 rounded-full bg-aperture-radial flex items-center justify-center">
                  <Aperture className="h-4 w-4 text-aperture" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-aperture text-white whitespace-pre-wrap"
                    : "glass text-paper"
                }`}
              >
                {m.role === "assistant" ? (
                  <div
                    className="prose prose-invert prose-sm max-w-none
                      prose-p:my-2 prose-headings:my-3 prose-headings:font-display
                      prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5
                      prose-strong:text-paper prose-a:text-signal
                      prose-code:text-signal prose-code:bg-panel prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                      prose-pre:bg-panel prose-pre:border prose-pre:border-line"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
              {m.role === "user" && (
                <div className="h-8 w-8 shrink-0 rounded-full bg-panel flex items-center justify-center">
                  <User className="h-4 w-4 text-mist" />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 shrink-0 rounded-full bg-aperture-radial flex items-center justify-center">
                <Aperture className="h-4 w-4 text-aperture" />
              </div>
              <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2 text-mist text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="sticky bottom-4 glass rounded-2xl p-2 flex items-center gap-2 mt-10"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message ZilVision AI..."
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-mist/70"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="h-9 w-9 shrink-0 rounded-xl bg-aperture text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
