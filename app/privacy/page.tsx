import LegalLayout from "@/components/LegalLayout";

export const metadata = { title: "Privacy Policy — ZilVision AI" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="25 August 2026">
      <p>
        This Privacy Policy explains what information ZilVision AI collects, how it is used, and
        the choices you have.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li>
          <strong>Account information:</strong> when you sign in with Google to use Image Studio,
          we receive your name, email address, and profile picture from Google.
        </li>
        <li>
          <strong>Chat and prompt content:</strong> messages you send to the chat, and prompts you
          submit for image generation, are sent to our AI providers to produce a response.
        </li>
        <li>
          <strong>Usage data:</strong> basic technical data such as browser type and approximate
          usage patterns, used to keep the Service reliable and secure.
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To operate and improve the chat and image generation features.</li>
        <li>To authenticate you and protect the Image Studio from misuse.</li>
        <li>To respond to support requests sent through our Contact page.</li>
      </ul>

      <h2>3. Third-party processors</h2>
      <p>
        Chat messages are processed by our chat AI provider to generate responses. Image prompts
        are sent to our image generation provider to create images. Sign-in is handled by Google.
        These providers process data only as needed to deliver their service to us.
      </p>

      <h2>4. Data retention</h2>
      <p>
        Chat conversations are not stored on our servers after your session ends unless you have
        explicitly saved them. Account information is retained while your account is active.
      </p>

      <h2>5. Your choices</h2>
      <p>
        You can sign out at any time from Settings. You can request deletion of your account and
        associated data by contacting us through the <a href="/contact" className="text-signal hover:underline">Contact page</a>.
      </p>

      <h2>6. Children's privacy</h2>
      <p>
        The Service is not directed at children under 13, and we do not knowingly collect
        personal information from them.
      </p>

      <h2>7. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be reflected
        by updating the "Last updated" date above.
      </p>

      <h2>8. Contact</h2>
      <p>
        For privacy questions or data requests, reach us through our <a href="/contact" className="text-signal hover:underline">Contact page</a>.
      </p>
    </LegalLayout>
  );
}
