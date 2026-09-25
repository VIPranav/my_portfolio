import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSettings } from "@/lib/content";
import { siteUrl } from "@/lib/config";
import "./globals.css";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: settings.title, template: "%s | Pranav VP" },
    description: settings.bio,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Pranav VP",
      title: settings.title,
      description: settings.bio,
    },
    twitter: { card: "summary_large_image" },
  };
}
const themeScript = `(function(){var t='system';try{t=localStorage.getItem('portfolio-theme')||'system'}catch(e){}document.documentElement.dataset.theme=t==='light'||t==='dark'?t:window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'})()`;
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Pranav VP",
    url: siteUrl(),
    jobTitle: "Designer and developer",
    knowsAbout: [
      "Software development",
      "UI/UX",
      "Graphic design",
      "Video editing",
      "3D",
    ],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(person).replace(/</g, "\u003c"),
          }}
        />
      </head>
      <body className={inter.variable}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
