"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { LogOut, Trash2, User } from "lucide-react";
import type { Session } from "next-auth";

export default function SettingsPanel({ session }: { session: Session | null }) {
  const [imageQuality, setImageQuality] = useState<"standard" | "high">("standard");

  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-5 flex items-center gap-4">
        {session?.user?.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={session.user.image} alt="" className="h-14 w-14 rounded-full" />
        ) : (
          <div className="h-14 w-14 rounded-full bg-panel flex items-center justify-center">
            <User className="h-6 w-6 text-mist" />
          </div>
        )}
        <div>
          <p className="font-semibold">{session?.user?.name}</p>
          <p className="text-sm text-mist">{session?.user?.email}</p>
        </div>
      </section>

      <section className="glass rounded-2xl p-5">
        <h2 className="font-semibold mb-3">Image Studio preferences</h2>
        <p className="text-sm text-mist mb-4">
          Choose the default quality for new generations. This only affects the Image Studio —
          chat is unaffected.
        </p>
        <div className="flex gap-2">
          {(["standard", "high"] as const).map((q) => (
            <button
              key={q}
              onClick={() => setImageQuality(q)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border capitalize transition-colors ${
                imageQuality === q
                  ? "bg-aperture border-aperture text-white"
                  : "border-line text-mist hover:text-paper"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </section>

      <section className="glass rounded-2xl p-5">
        <h2 className="font-semibold mb-3">Account</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-line text-sm text-mist hover:text-paper hover:border-aperture transition-colors"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <button
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-flare/40 text-sm text-flare hover:bg-flare/10 transition-colors"
            title="Contact support to permanently delete your account and data"
          >
            <Trash2 className="h-4 w-4" /> Delete account
          </button>
        </div>
      </section>
    </div>
  );
}
