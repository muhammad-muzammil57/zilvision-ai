import LegalLayout from "@/components/LegalLayout";

export const metadata = { title: "Refund Policy — ZilVision AI" };

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" updated="25 August 2026">
      <p>
        ZilVision AI's chat and image generation features are currently offered free of charge.
        No payment is required to use the Service in its current form.
      </p>

      <h2>1. Free features</h2>
      <p>
        AI chat is free and does not require an account. Image generation is free once you sign
        in with Google — no payment is collected for image generation at this time.
      </p>

      <h2>2. If paid plans are introduced</h2>
      <p>
        Should ZilVision AI introduce paid plans or credits in the future, this policy will be
        updated to describe eligibility for refunds, the refund request process, and applicable
        timeframes, before any payments are collected.
      </p>

      <h2>3. Questions</h2>
      <p>
        For any billing-related questions, reach us through our <a href="/contact" className="text-signal hover:underline">Contact page</a>.
      </p>
    </LegalLayout>
  );
}
