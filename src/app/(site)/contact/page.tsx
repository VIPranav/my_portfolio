import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { getSettings } from "@/lib/content";
export const metadata: Metadata = {
  title: "Contact",
  description: "Have an idea? Start a conversation with Pranav VP.",
};
export const revalidate = 60;
export default async function Contact() {
  const settings = await getSettings();
  return (
    <div className="container page-section contact-layout">
      <div>
        <p className="eyebrow">LET’S CONNECT</p>
        <h1 className="page-title">
          Good things
          <br />
          start with
          <br />
          <span className="muted">a conversation.</span>
        </h1>
        <p className="page-lead">
          Tell me what you’re thinking.
          <br />
          Let’s find a way to make it happen.
        </p>
        {settings.email ? (
          <a className="text-link" href={`mailto:${settings.email}`}>
            {settings.email} ↗
          </a>
        ) : (
          <p className="small muted">Email · [PLACEHOLDER]</p>
        )}
        <div className="contact-socials">
          {(["github", "linkedin", "instagram"] as const).map((k) =>
            settings[k] ? (
              <a key={k} href={settings[k]} rel="noreferrer" target="_blank">
                {k} ↗
              </a>
            ) : (
              <span key={k}>{k} · [PLACEHOLDER]</span>
            ),
          )}
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
