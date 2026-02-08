import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientProvider } from "@/components/client-provider";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

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
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon-192.svg",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Dream Journal",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    title: "Dream Journal | Map Your Subconscious",
    description: "AI-powered dream journal with voice recording, pattern detection, and psychological insights.",
    siteName: "Dream Journal",
    images: [
      {
        url: "/opengraph-image.png",
        width: 2400,
        height: 1260,
        alt: "Dream Journal AI - Make sense of your subconscious",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dream Journal | Map Your Subconscious",
    description: "AI-powered dream journal with voice recording, pattern detection, and psychological insights.",
    images: ["/opengraph-image.png"],
  },
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${instrumentSerif.variable} font-sans antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProvider>{children}</ClientProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
