import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anirahadvisory.in";
const siteTitle = "Anirah Advisory";
const siteDescription =
  "Anirah Advisory helps Indian startups, MSMEs, and entrepreneurs with business registration, funding support, government schemes, compliance, certification, and legal documentation.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Anirah Advisory | MSME Funding & Business Consultancy in India",
    template: "%s | Anirah Advisory",
  },
  description: siteDescription,
  keywords: [
    "Anirah Advisory",
    "MSME funding",
    "MSME loan consultant",
    "business registration India",
    "government schemes",
    "startup funding",
    "business consultancy",
    "business compliance",
    "MUDRA loan",
    "CGTMSE loan",
    "PMEGP loan",
    "SIDBI",
    "Startup India",
    "company registration",
    "GST registration",
    "FSSAI registration",
    "trademark registration",
  ],
  authors: [{ name: "Anirah Advisory" }],
  creator: "Anirah Advisory",
  publisher: "Anirah Advisory",
  category: "Business Consultancy",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Anirah Advisory | MSME Funding & Business Consultancy in India",
    description: siteDescription,
    url: siteUrl,
    siteName: siteTitle,
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anirah Advisory | MSME Funding & Business Consultancy in India",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.querySelectorAll('[fdprocessedid]').forEach(function(e){e.removeAttribute('fdprocessedid')})}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
          <SonnerToaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
