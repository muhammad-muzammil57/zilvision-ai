"use client";

import { signIn } from "next-auth/react";
import { Aperture } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="glass rounded-3xl p-8 sm:p-10 max-w-sm w-full text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-aperture-radial mb-5">
          <Aperture className="h-6 w-6 text-aperture animate-spin-slow" />
        </div>
        <h1 className="font-display text-xl font-700 mb-2">Sign in to ZilVision AI</h1>
        <p className="text-mist text-sm mb-6">
          Chat stays free without an account. Sign in with Google to unlock the Image Studio.
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/image" })}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-paper text-void text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.54-5.17 3.54-8.65z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.15-4.05 1.15-3.11 0-5.75-2.1-6.69-4.93H1.3v3.09C3.26 21.3 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.31 14.31A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.58.4-2.31V6.6H1.3A11.98 11.98 0 0 0 0 12c0 1.94.46 3.77 1.3 5.4l4.01-3.09z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.76 0 3.34.6 4.59 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.3 6.6l4.01 3.09C6.25 6.85 8.89 4.75 12 4.75z"
            />
          </svg>
          Continue with Google
        </button>
        <p className="text-xs text-mist mt-5">
          By continuing, you agree to our{" "}
          <a href="/terms" className="text-signal hover:underline">Terms</a> and{" "}
          <a href="/privacy" className="text-signal hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
