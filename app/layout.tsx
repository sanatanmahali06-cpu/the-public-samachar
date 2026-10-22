import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  verification: {
    google: "T3ZBeygfkI_g8YO0K3JvN5Dv6dRRMxB-YlOdWmS6ZNE",
  },
  title: "THE PUBLIC SAMACHAR",
  description: "\u0938\u091a \u0915\u0940 \u0916\u092c\u0930, \u0938\u092c\u0938\u0947 \u092a\u0939\u0932\u0947",
  metadataBase: new URL("https://the-public-samachar.vercel.app"),
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "THE PUBLIC SAMACHAR",
    description: "\u0938\u091a \u0915\u0940 \u0916\u092c\u0930, \u0938\u092c\u0938\u0947 \u092a\u0939\u0932\u0947",
    url: "https://the-public-samachar.vercel.app",
    siteName: "THE PUBLIC SAMACHAR",
    locale: "hi_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "THE PUBLIC SAMACHAR",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "THE PUBLIC SAMACHAR",
    description: "\u0938\u091a \u0915\u0940 \u0916\u092c\u0930, \u0938\u092c\u0938\u0947 \u092a\u0939\u0932\u0947",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head><meta name="google-adsense-account" content="ca-pub-7510125764165873" /></head>
      <body className="min-h-full flex flex-col">{children}<Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7510125764165873" crossOrigin="anonymous" strategy="beforeInteractive" /></body>
    </html>
  );
}