import { ButtonLink } from "@/components/ui/Button";
export default function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <div className="mini-orbit" aria-hidden="true" />
      <p className="eyebrow">404 / A LITTLE OFF COURSE</p>
      <h1 className="page-title">
        Nothing here.
        <br />
        Plenty to explore.
      </h1>
      <ButtonLink href="/">Back to home ↗</ButtonLink>
    </main>
  );
}
