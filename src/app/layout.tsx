import type { Metadata } from "next";
import { Anek_Malayalam, Anton, Instrument_Serif, Inter, Poppins, Unbounded } from "next/font/google";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { SITE_URL } from "@/lib/seo";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import "./globals.css";

/*
 * Inter (SIL OFL), self-hosted by next/font at build time: no third-party
 * request and no layout shift. Check the licence before adding a face.
 */
const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

/*
 * The brand faces, from the brand kit (all SIL OFL): Anton for big headings
 * and impact type, Poppins for subheadings and UI, Anek Malayalam for body
 * copy in English and Malayalam. The homepage flow is set in these.
 */
const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const ui = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const body = Anek_Malayalam({
  subsets: ["latin", "malayalam"],
  weight: ["400", "500", "700"],
  variable: "--font-anek",
  display: "swap",
});

/*
 * Instrument Serif (SIL OFL), italic only: the accent words in the homepage's
 * manifesto, set against the sans.
 */
const accent = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif-accent",
  display: "swap",
});

/*
 * Unbounded (SIL OFL), variable in weight: wide, heavy and round, the face
 * closest to the TWS wordmark's sweeping S and W, so the launch page and its
 * intro use it for their display type.
 */
const wordmark = Unbounded({
  subsets: ["latin"],
  variable: "--font-wordmark",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TWS — Web Design, Development & Digital Experiences",
    // Inner pages set a short title: "Services" -> "Services — TWS".
    template: "%s — TWS",
  },
  description:
    "TWS is a digital studio building high-performance websites, e-commerce platforms, web applications and digital experiences for ambitious businesses.",
  keywords: [
    "web design studio",
    "web development agency",
    "website design",
    "website development",
    "e-commerce development",
    "web application development",
    "UI/UX design",
    "digital strategy",
    "digital studio",
    "digital agency India",
    "web design Kerala",
    "website development Kerala",
    "custom websites",
    "digital experiences",
  ],
  openGraph: {
    siteName: "TWS — The Web Studio",
    title: "TWS — Web Design, Development & Digital Experiences",
    description:
      "TWS is a digital studio building high-performance websites, e-commerce platforms, web applications and digital experiences for ambitious businesses.",
    url: SITE_URL,
    type: "website",
    images: [{ url: "/seo/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary",
    title: "TWS — Web Design, Development & Digital Experiences",
    description:
      "TWS is a digital studio building high-performance websites, e-commerce platforms, web applications and digital experiences for ambitious businesses.",
    images: ["/seo/og-image.png"],
  },
  icons: {
    /*
     * One mark for both schemes: white on black reads either way. No .ico
     * here — `src/app/favicon.ico` already answers /favicon.ico, and a second
     * declaration ships two competing `rel="icon"` links.
     */
    icon: [
      { url: "/seo/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/seo/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/seo/apple-touch-icon-180.png", sizes: "180x180" },
      { url: "/seo/apple-touch-icon-1024.png", sizes: "1024x1024" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${ui.variable} ${body.variable} ${accent.variable} ${wordmark.variable}`}
    >
      <body className="bg-primitive-white text-ink font-sans">
        {children}
        <FloatingWhatsApp />
        <CookieConsent />
      </body>
    </html>
  );
}
