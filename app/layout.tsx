import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tomáš Znamenáček",
  description: "Dělám věci, občas to funguje, občas ne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
