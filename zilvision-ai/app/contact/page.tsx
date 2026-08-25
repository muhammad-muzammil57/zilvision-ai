import { Mail } from "lucide-react";

export const metadata = { title: "Contact — ZilVision AI" };

export default function ContactPage() {
  return (
    <div className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-16 text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-aperture-radial mb-5">
        <Mail className="h-6 w-6 text-aperture" />
      </div>
      <h1 className="font-display text-2xl font-700 mb-3">Get in touch</h1>
      <p className="text-mist text-sm mb-6">
        Questions, feedback, or a report about content on ZilVision AI? Email us and we'll get
        back to you.
      </p>
      <a
        href="mailto:support@zilvision.ai"
        className="inline-block px-5 py-3 rounded-xl bg-aperture text-white text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        support@zilvision.ai
      </a>
    </div>
  );
}
