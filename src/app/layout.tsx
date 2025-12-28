import type { Metadata } from "next";
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
  title: {
    default: "Premium Textiles Manufacturing Co.",
    template: "%s | Premium Textiles Manufacturing",
  },
  description:
    "High-volume garment manufacturing with consistent quality. T-shirts, hoodies, jackets, workwear, and more. Request a quote today.",
  keywords: [
    "textile manufacturing",
    "garment manufacturing",
    "bulk clothing",
    "wholesale apparel",
    "custom clothing",
    "B2B textiles",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

