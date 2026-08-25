import LegalLayout from "@/components/LegalLayout";

export const metadata = { title: "Rules & Regulations — ZilVision AI" };

export default function RulesPage() {
  return (
    <LegalLayout title="Rules & Regulations" updated="25 August 2026">
      <p>
        These rules apply to everyone using ZilVision AI, whether chatting or generating images.
        They exist to keep the Service safe and usable for everyone.
      </p>

      <h2>1. Prohibited content</h2>
      <p>Do not use ZilVision AI to create, request, or share:</p>
      <ul>
        <li>Sexual content involving minors, in any form.</li>
        <li>Non-consensual sexual imagery of real people.</li>
        <li>Content that promotes terrorism, violent extremism, or targeted violence.</li>
        <li>Instructions for building weapons, explosives, or other dangerous devices.</li>
        <li>Malware, hacking tools, or content designed to compromise other systems.</li>
        <li>Hate speech or content that dehumanizes people based on protected characteristics.</li>
      </ul>

      <h2>2. Respectful use</h2>
      <p>
        Do not use the chat to harass, threaten, or impersonate other people. Do not attempt to
        extract another user's private information through the Service.
      </p>

      <h2>3. Fair use of AI resources</h2>
      <p>
        Chat and image generation run on shared, rate-limited infrastructure. Automated scripts,
        bulk scraping, or attempts to bypass rate limits are not allowed and may result in
        temporary or permanent suspension.
      </p>

      <h2>4. Image Studio specifics</h2>
      <ul>
        <li>Generated images may not depict real, identifiable people in a misleading or harmful way.</li>
        <li>Do not use generated images to create misinformation presented as real photography.</li>
        <li>You are responsible for how you use and share images you generate.</li>
      </ul>

      <h2>5. Enforcement</h2>
      <p>
        We may remove content, restrict features, or suspend accounts that violate these rules,
        with or without prior notice, depending on severity.
      </p>

      <h2>6. Reporting</h2>
      <p>
        If you see content or behavior that violates these rules, please report it through our{" "}
        <a href="/contact" className="text-signal hover:underline">Contact page</a>.
      </p>
    </LegalLayout>
  );
}
