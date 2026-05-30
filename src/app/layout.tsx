import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FundGrow - MSME Funding & Business Consultancy in India",
  description: "India's trusted MSME funding consultancy. Business registration, government schemes, loans, grants, legal compliance, and branding services. 40+ years of combined experience, 5000+ projects delivered.",
  keywords: [
    "MSME funding",
    "business registration India",
    "government schemes",
    "startup funding",
    "business consultancy",
    "MUDRA loan",
    "SIDBI",
    "Startup India",
    "company registration",
    "GST registration",
    "FundGrow",
  ],
  authors: [{ name: "FundGrow" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "FundGrow - MSME Funding & Business Consultancy",
    description: "Empowering Indian MSMEs with funding, registration, and business growth solutions. 5000+ projects delivered across 36+ states.",
    siteName: "FundGrow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FundGrow - MSME Funding & Business Consultancy",
    description: "Empowering Indian MSMEs with funding, registration, and business growth solutions.",
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
        </ThemeProvider>
      </body>
    </html>
  );
}
