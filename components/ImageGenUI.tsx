"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2, Download, RefreshCcw, KeyRound, Eye, EyeOff } from "lucide-react";

const RATIOS = [
  { label: "Square", w: 1024, h: 1024 },
  { label: "Portrait", w: 832, h: 1216 },
  { label: "Landscape", w: 1216, h: 832 },
];

const PROVIDERS = [
  {
    id: "free-fast",
    label: "Fast (Free)",
    hint: "Quick generations, no API key needed.",
  },
  {
    id: "free-accurate",
    label: "Accurate (Free)",
    hint: "Slower but follows your prompt much more closely. No API key needed.",
  },
  {
    id: "huggingface",
    label: "Flux / SDXL (Hugging Face)",
    hint: "Runs on Hugging Face's Flux.1-schnell (with SDXL as backup). No key needed from you.",
  },
  {
    id: "gemini-byok",
    label: "Gemini (Your API Key)",
    hint: "Uses your own Gemini API key — credits are deducted from your account, not ours.",
  },
] as const;

type ProviderId = (typeof PROVIDERS)[number]["id"];

const GEMINI_KEY_STORAGE = "zilvision_gemini_api_key";

export default function ImageGenUI() {
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState(RATIOS[0]);
  const [provider, setProvider] = useState<ProviderId>("free-fast");
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");

  // Load a previously saved Gemini key from this browser only (never sent anywhere until Generate is pressed).
  useEffect(() => {
    const saved = window.localStorage.getItem(GEMINI_KEY_STORAGE);
    if (saved) setApiKey(saved);
  }, []);

  function updateApiKey(value: string) {
    setApiKey(value);
    if (value.trim()) {
      window.localStorage.setItem(GEMINI_KEY_STORAGE, value.trim());
    } else {
      window.localStorage.removeItem(GEMINI_KEY_STORAGE);
    }
  }

  async function generate() {
    if (!prompt.trim() || loading) return;
    if (provider === "gemini-byok" && !apiKey.trim()) {
      setError("Add your Gemini API key first, or switch to a free option.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          width: ratio.w,
          height: ratio.h,
          provider,
          apiKey: provider === "gemini-byok" ? apiKey.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image generation failed");
      setImages((prev) => [data.imageUrl, ...prev]);
    } catch (e: any) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const activeProvider = PROVIDERS.find((p) => p.id === provider)!;

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-aperture-radial mb-4">
          <Sparkles className="h-6 w-6 text-signal" />
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-700 mb-2">Image Studio</h1>
        <p className="text-mist text-sm">Describe anything. ZilVision AI will paint it for you.</p>
      </div>

      <div className="glass rounded-2xl p-4 space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="e.g. A neon-lit cyberpunk street in Lahore at night, cinematic, 4k"
          className="w-full bg-transparent outline-none resize-none text-sm placeholder:text-mist/70"
        />

        {/* Provider selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-mist">Model</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as ProviderId)}
            className="w-full sm:w-auto bg-panel border border-line rounded-xl px-3 py-2 text-sm outline-none focus:border-aperture"
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-mist">{activeProvider.hint}</p>
          <p className="text-xs text-mist/70">
            Every image, no matter which model you pick, gets a small "Muzammil" watermark in the corner.
          </p>
        </div>

        {/* Gemini API key input, only shown when that provider is selected */}
        {provider === "gemini-byok" && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-mist flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5" /> Your Gemini API key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => updateApiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full bg-panel border border-line rounded-xl px-3 py-2 pr-10 text-sm outline-none focus:border-aperture"
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mist hover:text-paper"
                aria-label={showKey ? "Hide key" : "Show key"}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-mist">
              Get a free key from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-aperture underline"
              >
                Google AI Studio
              </a>
              . Saved only in this browser — sent directly to Google for each generation, never stored on our servers.
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {RATIOS.map((r) => (
            <button
              key={r.label}
              onClick={() => setRatio(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                ratio.label === r.label
                  ? "bg-aperture border-aperture text-white"
                  : "border-line text-mist hover:text-paper"
              }`}
            >
              {r.label}
            </button>
          ))}
          <button
            onClick={generate}
            disabled={loading || !prompt.trim()}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-signal text-void text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
        {error && <p className="text-sm text-flare">⚠️ {error}</p>}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {images.map((src, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden group relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={prompt} className="w-full h-64 object-cover" loading="lazy" />
              <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-void/70 to-transparent">
                <a
                  href={src}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 flex items-center justify-center rounded-full bg-panel text-paper hover:bg-aperture transition-colors"
                  aria-label="Download image"
                >
                  <Download className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && images.length === 0 && !error && (
        <div className="mt-10 flex flex-col items-center text-mist text-sm gap-2">
          <RefreshCcw className="h-5 w-5" />
          Your generated images will appear here.
        </div>
      )}
    </div>
  );
}
