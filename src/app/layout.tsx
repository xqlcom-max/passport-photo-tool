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
  title: "US Passport Photo Tool — Crop & Print Helper",
  description: "Create US passport photos that meet State Department requirements. AI-powered cropping, 2x2 inch format, proper head size and position. No drugstore trips needed.",
  openGraph: {
    title: "US Passport Photo Tool",
    description: "Create US passport photos that meet State Department requirements.",
    type: "website",
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
