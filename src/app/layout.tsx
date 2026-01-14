import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Dream Journal | Map Your Subconscious",
  description:
    "AI-powered dream journal with voice recording, pattern detection, and psychological insights. Record, analyze, and understand your dreams.",
  keywords: ["dream journal", "dream analysis", "AI", "psychology", "lucid dreaming"],
  authors: [{ name: "Dream Journal" }],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased bg-zinc-950 text-zinc-50 min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200`}
      >
        {children}
      </body>
    </html>
  );
}
