import type { Metadata } from "next";
import { Geist, Geist_Mono, Nerko_One } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nerkoOne = Nerko_One({
  weight: "400",
  variable: "--font-nerko-one",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Toilet Hero",
  description: "by Restroom Association",
  icons: {
    icon: "/mascots/mascot-logo.png",
    apple: "/mascots/mascot-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nerkoOne.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
