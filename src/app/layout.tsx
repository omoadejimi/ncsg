import type { Metadata } from "next";
import { Newsreader, Public_Sans, Spline_Sans_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSearchIndex } from "@/lib/docs";
import { site } from "@/lib/site";
import "./globals.css";

/*
  Typography
  ----------
  - Newsreader (display): an editorial serif used sparingly — hero and
    page titles only — giving the guide a calm, literate voice.
  - Public Sans (body/UI): an open-source civic typeface, fitting for an
    open-source civic-minded guide, and highly legible at small sizes on
    low-end mobile screens.
  - Spline Sans Mono: for copy examples, so interface strings read as
    quotable artefacts rather than prose.
*/
const display = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const sans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });
const mono = Spline_Sans_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Write for Nigeria. Design for everyone.`,
    template: `%s — ${site.shortName}`,
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

/*
  Inline theme script: runs before paint to apply the saved (or system)
  theme, preventing a flash of the wrong colour scheme. Kept tiny and
  dependency-free on purpose.
*/
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("ncsg-theme");
    var dark = stored ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const searchIndex = getSearchIndex();

  return (
    <html lang="en-NG" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${display.variable} ${sans.variable} ${mono.variable} font-sans`}>
        {/* First focusable element on every page (WCAG 2.4.1 Bypass Blocks) */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header searchIndex={searchIndex} />
        {children}
        <Footer />
      </body>
      {/*
        Google Analytics 4. Next's official component loads gtag.js
        efficiently (after the page is interactive) and automatically
        tracks client-side navigations between pages — which the raw
        snippet from Google would miss on a single-page-style app.
      */}
      <GoogleAnalytics gaId="G-H1H74WV81V" />
    </html>
  );
}
