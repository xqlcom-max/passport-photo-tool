import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "US Passport Photo Maker — 2x2 AI Tool | Free Preview",
  description: "Create US passport photos online with AI. Auto-crop to 2x2 inches, white background, correct head size. Free preview, instant download. Meets State Department requirements.",
  keywords: ["passport photo", "US passport photo", "passport photo maker", "2x2 passport photo", "AI passport photo", "passport photo online", "passport photo tool"],
  openGraph: {
    title: "US Passport Photo Maker — Free AI Tool",
    description: "Create compliant US passport photos online. AI-powered cropping, 2x2 inch format, white background. Free preview.",
    type: "website",
    siteName: "Passport Photo Tool",
  },
  twitter: {
    card: "summary_large_image",
    title: "US Passport Photo Maker — Free AI Tool",
    description: "Create compliant US passport photos online. AI-powered cropping, 2x2 inch format.",
  },
  alternates: {
    canonical: "https://passphototool.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)] bg-[#FAFAFA] text-[#0A0A0A]">
        {children}
      </body>
    </html>
  );
}
