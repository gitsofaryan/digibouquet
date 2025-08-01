import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Martian_Mono } from "next/font/google";

const martianMono = Martian_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-martian",
});

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico",
  },
  title: "digibouquet",
  description: "create and share a digital flower bouquet",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={martianMono.variable}>
      <body className="font-martian">{children}</body>
    </html>
  );
}
