import { ButtonLink } from "@/components/ui/Button";
import WarpText from "@/components/home/WarpText";
export default function CtaBanner() {
  return (
    <section className="cta-banner dark-section">
      <p className="eyebrow">HAVE SOMETHING IN MIND?</p>
      <h2>
        <WarpText
          text={"Let’s make\nsomething matter."}
          color="#f5f5f7"
          speed={0.55}
          fontSize="clamp(3rem, 6vw, 5rem)"
          fontWeight={600}
          letterSpacing="-0.035em"
          lineHeight={1.1}
          className="cta-title-warp"
        />
      </h2>
      <p>A new idea. A fresh perspective. A better experience.</p>
      <ButtonLink href="/contact">Start a conversation ↗</ButtonLink>
    </section>
  );
}
