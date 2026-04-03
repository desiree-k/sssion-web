import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sssion | Movement. Mastered.",
  description: "A private studio platform for movement creators and their students. Build your dance instruction business with Sssion.",
  openGraph: {
    title: "Sssion | Movement. Mastered.",
    description: "A private studio platform for movement creators and their students.",
    siteName: "Sssion",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#1A1A2E] text-white font-sans">
        {children}
      </body>
    </html>
  );
}
