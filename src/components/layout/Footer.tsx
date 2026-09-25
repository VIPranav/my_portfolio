import Link from "next/link";
import { getSettings } from "@/lib/content";
export default async function Footer() {
  const settings = await getSettings();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link href="/" className="wordmark">
              VP<span className="accent">.</span>
            </Link>
            <p>
              Thoughtfully designed.
              <br />
              Built to work.
            </p>
          </div>
          <div>
            <h2>Explore</h2>
            <Link href="/work">Work</Link>
            <Link href="/about">About</Link>
            <Link href="/journey">Journey</Link>
          </div>
          <div>
            <h2>Let’s work together</h2>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/resume">Résumé</Link>
          </div>
          <div>
            <h2>Elsewhere</h2>
            {(["github", "linkedin", "instagram"] as const).map((label) =>
              settings[label] ? (
                <a
                  key={label}
                  href={settings[label]}
                  target="_blank"
                  rel="noreferrer"
                >
                  {label} ↗
                </a>
              ) : (
                <span key={label} className="social-placeholder">
                  {label} · [PLACEHOLDER]
                </span>
              ),
            )}
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Pranav VP</span>
          <span>Made with intention.</span>
          <a href="#main-content">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
