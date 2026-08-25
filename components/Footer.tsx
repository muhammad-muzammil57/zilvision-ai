import Link from "next/link";
import { Aperture } from "lucide-react";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/", label: "AI Chat" },
      { href: "/image", label: "Image Studio" },
      { href: "/settings", label: "Settings" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/rules", label: "Rules & Regulations" },
      { href: "/refund", label: "Refund Policy" },
    ],
  },
  {
    title: "Company",
    links: [{ href: "/contact", label: "Contact Us" }],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line/60 bg-iris/60 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Aperture className="h-5 w-5 text-aperture" />
            <span className="font-display font-700">
              Zil<span className="text-gradient">Vision</span> AI
            </span>
          </div>
          <p className="text-sm text-mist leading-relaxed">
            Free AI chat and AI image generation, in one clear space.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-paper mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-mist hover:text-signal transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-mist flex flex-col sm:flex-row gap-2 items-center justify-between">
          <p>© {new Date().getFullYear()} ZilVision AI. All rights reserved.</p>
          <p>Chat is free for everyone. Sign in with Google to generate images.</p>
        </div>
      </div>
    </footer>
  );
}
