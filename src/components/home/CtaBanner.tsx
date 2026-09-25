import { ButtonLink } from "@/components/ui/Button";
export default function CtaBanner() {
  return (
    <section className="cta-banner dark-section">
      <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
      <h2>
        Let’s make
        <br />
        something matter.
      </h2>
      <p>A new idea. A fresh perspective. A better experience.</p>
      <ButtonLink href="/contact">Start a conversation ↗</ButtonLink>
    </section>
  );
}
