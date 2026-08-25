import LegalLayout from "@/components/LegalLayout";

export const metadata = { title: "Terms & Conditions — ZilVision AI" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms & Conditions" updated="25 August 2026">
      <p>
        These Terms & Conditions ("Terms") govern your use of ZilVision AI (the "Service"),
        operated by ZilVision AI. By using the Service, you agree to these Terms. If you do not
        agree, please do not use the Service.
      </p>

      <h2>1. The Service</h2>
      <p>
        ZilVision AI provides an AI chat assistant, which is free to use without an account, and
        an AI image generation tool ("Image Studio"), which requires you to sign in with a Google
        account.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 13 years old (or the minimum age of digital consent in your country)
        to use the Service. By using the Service you confirm that you meet this requirement.
      </p>

      <h2>3. Accounts</h2>
      <p>
        Image generation requires signing in with Google through our "Continue with Google"
        option. You are responsible for keeping your account secure and for all activity that
        happens under it.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to use the Service to:</p>
      <ul>
        <li>Generate or request illegal, sexually explicit, or child-exploitative content.</li>
        <li>Generate content that harasses, threatens, or defames a real person.</li>
        <li>Attempt to reverse-engineer, overload, or abuse the underlying AI systems or APIs.</li>
        <li>Infringe someone else's intellectual property or impersonate a real person or brand.</li>
      </ul>
      <p>We may suspend or terminate accounts that violate this section.</p>

      <h2>5. Content you create</h2>
      <p>
        You are responsible for the prompts you submit and the outputs you generate. You may use
        the text and images you generate for personal or commercial purposes, subject to the
        underlying AI providers' own usage policies and applicable law.
      </p>

      <h2>6. No warranty</h2>
      <p>
        The Service is provided "as is." AI-generated responses and images may be inaccurate,
        incomplete, or unsuitable for a particular purpose. We do not guarantee uninterrupted or
        error-free operation.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, ZilVision AI is not liable for any indirect,
        incidental, or consequential damages arising from your use of the Service.
      </p>

      <h2>8. Changes to the Service or Terms</h2>
      <p>
        We may update these Terms or change, suspend, or discontinue any part of the Service at
        any time. Continued use after changes means you accept the updated Terms.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about these Terms can be sent through our <a href="/contact" className="text-signal hover:underline">Contact page</a>.
      </p>
    </LegalLayout>
  );
}
