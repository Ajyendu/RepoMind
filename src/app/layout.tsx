import type { Metadata, Viewport } from "next";
import { Archivo_Black, Playfair_Display, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import JsonLd from "./components/json-ld";
import { Providers } from "@/components/Providers";
import { getCanonicalSiteUrl } from "@/lib/site-url";

const archivo = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const canonicalSiteUrl = getCanonicalSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(canonicalSiteUrl),
  applicationName: "RepoMind",
  title: {
    default: "RepoMind - Understand any codebase in seconds",
    template: "%s | RepoMind",
  },
  description: "Agentic CAG-powered analysis for GitHub repositories and developer profiles. Chat with your codebase, generate visual flowcharts, uncover deep insights, detect vulnerabilities, and accelerate development with AI-driven repository intelligence.",
  keywords: [
    "agentic AI",
    "compositional agentic generation",
    "github repo visualizer",
    "codebase analysis",
    "ai code assistant",
    "repository flowcharts",
    "code intelligence",
    "github repo chat",
    "repository chat",
    "code understanding",
    "developer tools",
    "static analysis",
    "vulnerability detection",
  ],
  icons: {
    icon: [
      { url: "/git.png?v=2", type: "image/png" },
      { url: "/favicon.ico?v=2", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=2", type: "image/png" }],
    shortcut: "/git.png?v=2",
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: "RepoMind",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "RepoMind - Understand any codebase in seconds",
    description: "Agentic CAG-powered analysis for GitHub repositories. Chat with your codebase, generate visual flowcharts, uncover deep insights, and accelerate development with AI-driven repository intelligence.",
    url: canonicalSiteUrl,
    siteName: "RepoMind",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "RepoMind - Understand any codebase in seconds",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RepoMind - Understand any codebase in seconds",
    description: "Agentic CAG-powered analysis for GitHub repositories. Chat with your codebase, generate visual flowcharts, uncover deep insights, and accelerate development.",
    images: ["/og-image.svg"],
    creator: "@Ajyendu",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body
        className="antialiased font-sans"
        suppressHydrationWarning
      >
        <JsonLd />
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="bottom-right"
          theme="light"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: '#ffffff',
              border: '2px solid #111111',
              color: '#111111',
              borderRadius: '0px',
              boxShadow: '6px 6px 0 #111111',
            },
          }}
        />
      </body>
    </html>
  );
}
