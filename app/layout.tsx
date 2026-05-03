import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "VisaBot | AI-Powered Visa Intelligence",
  description:
    "AI-powered visa triage agent that combines MCP rules with official-source search to deliver structured immigration briefs in seconds. Built for the Zero-to-Agent Hackathon.",
  openGraph: {
    title: "VisaBot | AI-Powered Visa Intelligence",
    description:
      "Know before you go. Get instant immigration briefs with official sources.",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VisaBot | AI-Powered Visa Intelligence",
    description:
      "Know before you go. Get instant immigration briefs with official sources.",
    images: ["/images/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased bg-background ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans">
        {children}
      </body>
    </html>
  );
}
