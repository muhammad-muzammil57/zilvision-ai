"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import { Aperture, MessageSquare, Sparkles, Settings, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Chat", icon: MessageSquare },
  { href: "/image", label: "Image Studio", icon: Sparkles },
];

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 glass border-b border-line/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-aperture-radial">
            <Aperture className="h-5 w-5 text-aperture animate-spin-slow" />
          </span>
          <span className="font-display font-700 text-lg tracking-tight">
            Zil<span className="text-gradient">Vision</span> AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === href
                  ? "bg-panel text-paper"
                  : "text-mist hover:text-paper hover:bg-panel/60"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          {session && (
            <Link
              href="/settings"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/settings"
                  ? "bg-panel text-paper"
                  : "text-mist hover:text-paper hover:bg-panel/60"
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-9 w-24 rounded-full bg-panel animate-pulse" />
          ) : session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-line text-sm text-mist hover:text-paper hover:border-aperture transition-colors"
            >
              {session.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" className="h-6 w-6 rounded-full" />
              ) : null}
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="px-4 py-2 rounded-full bg-aperture text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Continue with Google
            </button>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-line/60 px-4 py-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-mist hover:text-paper hover:bg-panel/60"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          {session && (
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-mist hover:text-paper hover:bg-panel/60"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          )}
          <div className="pt-2">
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-full border border-line text-sm text-mist"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="w-full px-4 py-2.5 rounded-full bg-aperture text-white text-sm font-semibold"
              >
                Continue with Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
