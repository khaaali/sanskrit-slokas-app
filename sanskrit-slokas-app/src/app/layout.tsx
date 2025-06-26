import type { Metadata } from "next";
import { Inter, Tiro_Devanagari_Sanskrit } from "next/font/google";
import "./globals.css";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });
const tiroDevanagari = Tiro_Devanagari_Sanskrit({ 
  subsets: ["devanagari"],
  weight: "400",
  variable: '--font-tiro-devanagari',
});

export const metadata: Metadata = {
  title: "Sanskrit Slokas",
  description: "Learn Sanskrit Slokas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${tiroDevanagari.variable} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
        {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
