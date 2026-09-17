import type { Metadata } from "next";
import "./globals.css";

/*
 * Clarkson and Clarkson Serif are self-hosted from `public/fonts` via @font-face
 * in globals.css rather than next/font, because they are not Google fonts and the
 * files were pulled straight off Squarespace's CDN.
 */

export const metadata: Metadata = {
  metadataBase: new URL("https://www.squarespace.com"),
  title:
    "Website Builder – Easily Create Your Own Website — Squarespace",
  description:
    "Create a website and grow your business with a free Squarespace trial. Start with customizable website templates, AI website builder tools, or a domain name.",
  openGraph: {
    siteName: "Squarespace",
    title:
      "Website Builder – Easily Create Your Own Website — Squarespace",
    url: "https://www.squarespace.com",
    type: "website",
    images: [{ url: "/seo/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary",
    title:
      "Website Builder – Easily Create Your Own Website — Squarespace",
    images: ["/seo/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/seo/favicon-light-mode.ico", media: "(prefers-color-scheme: light)" },
      { url: "/seo/favicon-dark-mode.ico", media: "(prefers-color-scheme: dark)" },
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
    <html lang="en">
      <body className="bg-primitive-black text-primitive-white font-clarkson">
        {children}
      </body>
    </html>
  );
}
