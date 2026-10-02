"use client";
import PageWarpTitle from "@/components/ui/PageWarpTitle";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="container page-section">
      <PageWarpTitle text="A brief interruption." />
      <p>We couldn’t load this page. Please try again.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
