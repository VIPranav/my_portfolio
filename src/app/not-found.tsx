import { ButtonLink } from "@/components/ui/Button";
import PageWarpTitle from "@/components/ui/PageWarpTitle";
export default function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <div className="mini-orbit" aria-hidden="true" />
      <p className="eyebrow">404 / A LITTLE OFF COURSE</p>
      <PageWarpTitle text={"Nothing here.\nPlenty to explore."} />
      <ButtonLink href="/">Back to home ↗</ButtonLink>
    </main>
  );
}
